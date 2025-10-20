import { createRouter, createWebHistory } from 'vue-router'
import publicRoutes from '@/router/routes/public'
import adminRoutes from '@/router/routes/admin'
import NotFound from '@/views/ErrorView.vue'
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        ...publicRoutes,
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
            return  { left: 0, top: 0, behavior: 'instant' }////////
        }else{
            return { left: 0, top: 0, behavior: 'instant' }////////
        }
    }
})
export default router