import { createApp } from 'vue'
import { createPinia } from 'pinia'
// Element Plus 组件与 API 已改为按需自动引入（见 vite.config.ts 的 AutoImport/Components），
// 不再整体 import ElementPlus + app.use()，以显著减小打包体积。
// 样式仍保留全量 index.css：代码中存在大量 import { ElMessage } 等显式引入，
// 它们不会经过按需解析器注入样式，保留全量 CSS 可确保这些组件样式正常。
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'
import './styles/main.scss'

const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)

app.mount('#app')