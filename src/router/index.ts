import { createRouter, createWebHistory } from 'vue-router'
import publicRoutes from '@/router/routes/public'
import NotFound from '@/views/ErrorView.vue'
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        ...publicRoutes,
        { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound, meta: { layout: 'empty' }}
    ],
})
export default router