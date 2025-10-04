import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import setupPrimeVue from '@/plugins/primevue'
import './assets/main.css'
import './assets/layout/layout.scss'
const app = createApp(App)
app.use(createPinia())
app.use(router)
setupPrimeVue(app)
router.isReady().then(() => app.mount('#app'))