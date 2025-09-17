import{ type Router } from 'vue-router'
import{ useFetchDataStore } from '@/stores/FetchData'
export function setupGuards(router: Router){
    router.beforeEach(async (to) => {
        if(typeof window === 'undefined') return true
            // cek dynamic path
            const isDetail = to.path.toLowerCase().includes('detail')
            if(isDetail){
            const parts = to.path.split('/').filter(Boolean)
            const lastPart = parts[parts.length - 1]
            if(!lastPart){
                return{ path: '/' + parts[0] }
            }
        }
        // fetch data via Pinia
        const fetchDataS = useFetchDataStore()
        const res = await fetchDataS.fetchPage(to.fullPath)
        if(res === undefined || res.status === 'error'){
            if(res?.data?.redirect){
                if(res.data.redirect === '/login' && to.path === '/login') return true
                return{ path: res.data.redirect }
            }
            return true
        }
        return true
    })
    router.beforeEach((to, from) =>{
        const getDepth = (path: string) => path.split('/').filter(seg => seg.length > 0).length
        const toDepth = getDepth(to.path)
        const fromDepth = getDepth(from.path)

        if(toDepth > fromDepth){
        to.meta.pageTransition ={ name: 'page-left', mode: 'out-in' }
        from.meta.pageTransition ={ name: 'page-left', mode: 'out-in' }
        } else{
        to.meta.pageTransition ={ name: 'page-right', mode: 'out-in' }
        from.meta.pageTransition ={ name: 'page-right', mode: 'out-in' }
        }
        return true
    })
}