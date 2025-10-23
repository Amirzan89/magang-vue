import { createRouter, createWebHistory } from 'vue-router'
import { setupGuards } from './guards'
import publicRoutes from '@/router/routes/public'
import authRoutes from '@/router/routes/auth'
import adminRoutes from '@/router/routes/admin'
import NotFound from '@/views/ErrorView.vue'
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        ...publicRoutes,
        ...authRoutes,
        ...adminRoutes,
        {
            path: '/testing',
            name: 'TestingPage',
            component: () => import('@/views/testing.vue'),
            meta: { layout: 'empty' },
        },
        { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound, meta: { layout: 'empty' }}
    ],
    scrollBehavior(to, from, savedPosition){
        if(savedPosition){
            return { ...savedPosition, behavior: 'instant' } 
        }
        if(to.path === from.path){
            return false
        }
        return { left: 0, top: 0, behavior: 'instant' }
    }
})
setupGuards(router)
export default router