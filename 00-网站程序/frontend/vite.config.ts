import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

export default defineConfig({
  plugins: [vue()],
  // 根据环境动态设置base路径
  base: process.env.NODE_ENV === 'production' ? '/text-efficiency-platform/' : '/',
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
          'element-plus': ['element-plus'],
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'utils': ['axios', 'dayjs', 'localforage'],
          'mermaid': ['mermaid']
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
    cssCodeSplit: true
  }
})