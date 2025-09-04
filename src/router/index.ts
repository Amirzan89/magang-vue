import { createRouter, createWebHistory } from 'vue-router'
import publicRoutes from '@/router/routes/public'
import NotFound from '@/views/Error.vue'
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        ...publicRoutes,
        { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
    ],
})
export default router