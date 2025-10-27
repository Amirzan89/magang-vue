import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import setupPrimeVue from '@/plugins/primevue'
import { useGlobalStore } from './stores/Global'
import './assets/main.css'
import './assets/layout/layout.scss'
const app = createApp(App)
app.use(createPinia())
function getInitialState(){
    const cookie = document.cookie.split('; ').find(c => c.startsWith('__INITIAL_COSTUM_STATE__='))
    if(!cookie) return null
    try{
        const value = decodeURIComponent(cookie.split('=')[1])
        console.log('balue',value)
        const decoded = JSON.parse(atob(value))
        return decoded
    }catch(e){
        console.warn('Failed to parse initial state:', e)
        return null
    }
}
const state = getInitialState()
if(state){
    const store = useGlobalStore()
    store.hydrate(state)
    console.log('entok state', state)
    document.cookie = '__INITIAL_COSTUM_STATE__=; Max-Age=0; path=/;'
}
app.use(router)
setupPrimeVue(app)
router.isReady().then(() => app.mount('#app'))