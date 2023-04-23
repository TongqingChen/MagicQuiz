import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'
import store from './store'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/el-message-box.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-overlay.css'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
// if(sessionStorage.getItem('store')){
//     store.replaceState(Object.assign({}, store.state, JSON.parse(String(sessionStorage.getItem('store')))))
// }
// window.addEventListener('beforeunload', ()=>{sessionStorage.setItem('store', JSON.stringify(store.state))})
app.use(router)
app.use(store)
app.mount('#app')