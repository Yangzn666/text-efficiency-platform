import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

// 生产环境部署在 GitHub Pages 子路径下，PWA 的 scope/start_url 必须与 base 一致，
// 否则手机安装后会把应用打开到站点根目录（/）导致 404
const isProd = process.env.NODE_ENV === 'production'
const base = isProd ? '/text-efficiency-platform/' : '/'

export default defineConfig({
  plugins: [
    vue(),
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
        name: '考研效率平台',
        short_name: '考研',
        description: '今日状态 · 任务生成 · 打卡链 · 进度预警，随时随地知道该干什么',
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
          '**/reading-questions.json'
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
  resolve: {
    alias: {
      '@': resolve(fileURLToPath(new URL('./', import.meta.url)), 'src')
    }
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
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
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
})