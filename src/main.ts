import { createApp } from 'vue'
import './style.css'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/el-message-box.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-overlay.css'
import 'uno.css'

import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import 'default-passive-events'
// import 'element-plus/theme-chalk/dark/css-vars.css'

// highlightjs
import hljs from 'highlight.js';

VMdPreview.use(githubTheme, {Hljs: hljs,});

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router)
app.use(store)
app.use(VMdPreview)
app.mount('#app')