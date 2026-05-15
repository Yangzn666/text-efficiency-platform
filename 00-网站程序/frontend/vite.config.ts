import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

export default defineConfig({
  plugins: [vue()],
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
  build: {
    // 代码分割优化
    rollupOptions: {
      output: {
        manualChunks: {
          // 将大型库单独打包
          'element-plus': ['element-plus'],
          'vue': ['vue', 'vue-router', 'pinia'],
          'mermaid': ['mermaid']
        }
      }
    },
    // 使用默认esbuild压缩（更快）
    minify: 'esbuild',
    // chunk大小警告阈值
    chunkSizeWarningLimit: 1000
  }
})