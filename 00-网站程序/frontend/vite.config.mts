import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { execFileSync } from 'child_process'

const root = fileURLToPath(new URL('./', import.meta.url))

// —— 版本时间戳（构建时注入，共享版页脚用于区分版本；个人版不渲染但一并 define 以便复用同一 App.vue）——
function readGitUpdated(): string {
  try {
    return execFileSync(
      'git',
      ['log', '-1', '--format=%cd', '--date=format:%Y-%m-%d %H:%M'],
      { encoding: 'utf8', cwd: root }
    ).trim()
  } catch {
    return ''
  }
}
function buildStamp(): string {
  try {
    return new Intl.DateTimeFormat('zh-CN', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false
    }).format(new Date()).replace(/\//g, '-')
  } catch {
    return new Date().toISOString().slice(0, 16).replace('T', ' ')
  }
}
const gitUpdated = readGitUpdated()
const builtAt = buildStamp()
const lastUpdated = gitUpdated || builtAt

// P5 方案 B：单树双版本。默认(个人)构建行为保持不变；`--mode share` 切到公开知识库变体。
export default defineConfig(({ mode }) => {
  const SHARE = mode === 'share'
  const isProd = mode !== 'development'
  // 生产环境部署在 GitHub Pages 子路径下，PWA 的 scope/start_url 必须与 base 一致，
  // 否则手机安装后会把应用打开到站点根目录（/）导致 404
  const base = isProd ? (SHARE ? '/kaoyan-knowledge-base/' : '/text-efficiency-platform/') : '/'

  // 共享版私有静态资源裁剪：个人 public/ 中存在、而 frontend-share/public 中不存在的文件。
  // 两步：① 下方 shareGlobIgnores 阻止其进入 workbox 预缓存；② 构建后 scripts/prune-share-dist.mjs
  //    从 dist 物理删除（Vite 在插件 closeBundle 之后才复制 publicDir，故不能在插件里删）。
  //    删除清单以 prune-share-dist.mjs 为准，这里的 globIgnores 与其一一对应。
  // workbox 预缓存排除（仅 share 模式）
  const shareGlobIgnores = SHARE
    ? [
        '**/1000题*',
        '**/cloze-test.html',
        '**/init-math-chapters.html',
        '**/english-resources/**',
        '**/data/english/intensive-reading-analysis.json',
        '**/data/english/translation-exams.json'
      ]
    : []

  return {
    plugins: [
      vue(),
      // 仅 share 模式：把入口 HTML 的浏览器标签标题 / 主屏快捷方式名切到「考研知识库」。
      // 个人版不装载此插件，index.html 原样输出。
      ...(SHARE
        ? [
            {
              name: 'share-html-title',
              transformIndexHtml(html: string) {
                return html
                  .replace('<title>个人考研效率平台</title>', '<title>考研知识库</title>')
                  .replace('content="考研效率"', 'content="考研知识库"')
              }
            }
          ]
        : []),
      // Element Plus 按需自动引入：模板里的 <el-*> 组件与 ElMessage 等 API 自动导入，
      // 不再整体打包 element-plus（显著减小首屏体积，加快手机访问）
      AutoImport({
        resolvers: [ElementPlusResolver({ importStyle: false })]
      }),
      Components({
        resolvers: [ElementPlusResolver({ importStyle: false })]
      }),
      // PWA：可安装到手机主屏幕 + 离线查看（base 路径通过下方 base 常量统一处理）
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'icons/*.svg'],
        manifest: {
          name: SHARE ? '考研知识库' : '考研效率平台',
          short_name: '考研',
          description: SHARE
            ? '数学一/408知识点整理与备考参考'
            : '今日状态 · 任务生成 · 打卡链 · 进度预警，随时随地知道该干什么',
          theme_color: '#1976D2',
          background_color: '#f5f7fa',
          display: 'standalone',
          scope: base,
          start_url: base,
          icons: [
            {
              src: 'icons/icon.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'any'
            },
            {
              src: 'icons/icon.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'maskable'
            }
          ]
        },
        workbox: {
          // 预缓存静态资源（含 json/md 学习数据），离线可打开应用并查看章节内容
          globPatterns: ['**/*.{js,css,html,svg,png,webp,ico,woff2,json,md}'],
          // 预缓存瘦身：体积大且按需加载的 chunk（思维导图/关系图/图表引擎等）不预缓存，
          // 避免首次访问时 Service Worker 后台下载约 2MB 用不到的代码，拖慢手机网络；
          // 它们改由下方 runtimeCaching 在真正访问对应页面时缓存（仍可离线二次访问）。
          globIgnores: [
            '**/mermaid.core-*.js',
            '**/cytoscape.esm-*.js',
            '**/wardley-*.js',
            '**/MindMapView-*.js',
            '**/SkillTreeView-*.js',
            '**/cose-bilkent-*.js',
            '**/sequenceDiagram-*.js',
            '**/architectureDiagram-*.js',
            '**/reading-questions.json',
            // 英语阅读已按年拆分：轻量索引 + 按年份重字段文件，均走下方 runtimeCaching(SWR)，
            // 不预缓存，避免安装时后台下载用不到的年份数据拖慢手机端。
            '**/data/english/reading/index.json',
            '**/data/english/reading/by-year/*.json',
            // share 模式追加：私有静态资源不预缓存（与构建后 dist 删除一致）
            ...shareGlobIgnores
          ],
          // 运行时缓存策略
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
              }
            },
            {
              // 同源静态资源（含未预缓存的懒加载大 chunk）：
              // StaleWhileRevalidate——有缓存先秒开，同时后台更新，兼顾速度与新鲜度
              urlPattern: /\.(?:js|css|json|md|woff2|png|webp|svg|ico)$/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'static-resources',
                expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 }
              }
            }
          ]
        }
      })
    ],
    // 根据环境动态设置base路径（与 PWA scope/start_url 保持一致）
    base,
    define: {
      __LAST_UPDATED__: JSON.stringify(lastUpdated),
      __BUILD_TIME__: JSON.stringify(builtAt)
    },
    resolve: {
      // 别名顺序敏感：更具体的键须排在 '@' 前，才能优先命中。
      alias: [
        { find: '@/router/routes', replacement: resolve(root, SHARE ? 'src/router/routes.share.ts' : 'src/router/routes.personal.ts') },
        { find: '@/utils/cloudSync', replacement: resolve(root, SHARE ? 'src/utils/cloudSync.share.ts' : 'src/utils/cloudSync.ts') },
        { find: '@', replacement: resolve(root, 'src') }
      ]
    },
    server: {
      port: 6900,
      open: true,
      host: '0.0.0.0', // 允许局域网访问
      hmr: {
        overlay: false
      },
      fs: {
        strict: false
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`
        }
      }
    },
    esbuild: {
      // 生产环境移除console和debugger
      drop: isProd ? ['console', 'debugger'] : []
    },
    build: {
      // 代码分割优化
      rollupOptions: {
        output: {
          manualChunks: {
            // 将大型库单独打包
            // 注意：不再声明 'element-plus'。改为按需引入后，若仍强制把整个 element-plus
            // 塞进一个 chunk，会重新引入一个大体积的首屏依赖；交给 Rollup 按实际使用拆分，
            // 让 Element Plus 组件随各视图按需加载，显著减小首屏体积。
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            'utils': ['axios', 'dayjs', 'localforage']
            // mermaid和cytoscape使用动态导入，不在此处声明
          },
          // 减小chunk大小
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
        }
      },
      // 使用默认esbuild压缩（更快）
      minify: 'esbuild',
      // chunk大小警告阈值
      chunkSizeWarningLimit: 500,
      // 启用CSS代码分割
      cssCodeSplit: true,
      // 启用gzip压缩
      reportCompressedSize: true,
      // 移除sourcemap，减小体积
      sourcemap: false
    }
  }
})
