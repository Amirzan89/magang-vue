import{ type Router } from 'vue-router'
import { useGlobalStore } from '@/stores/Global'
import { useFetchDataStore } from '@/stores/FetchData'
const publicRoutes = ['/', '/about', '/events', '/search', '/login', '/password/reset', '/verify/password', '/verify/email']
const publicPrefixes = ['/event/', '/booking/']
export function setupGuards(router: Router){
    router.beforeEach(async(to) => {
        const globalStore = useGlobalStore()
        if(globalStore.statusCode == 200) return true
        const fetchDataS = useFetchDataStore()
        if(fetchDataS.isFirstTime){
            await fetchDataS.checkAuth()
        }
        const isPublic = publicRoutes.includes(to.path) || publicPrefixes.some((prefix) => to.path.startsWith(prefix))
        if(!fetchDataS.isAuth){
            setTimeout(() => {
                fetchDataS.clearDecryptedImage()
            }, 500);
            if(!isPublic){
                return { path: '/login' }
            }
        }
        if(isPublic && fetchDataS.isAuth){
            return { path: '/dashboard' }
        }
        return true
    })
    router.onError((err) => {
        if (err?.message?.includes('Navigation aborted')) return
        console.error('[Router Error]', err)
    })
}