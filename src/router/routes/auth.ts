export default [
    {
        path: '/login',
        name: 'LoginPage',
        component: () => import('@/views/Login.vue'),
        meta: { layout: 'empty', requiresAuth: true },
    },
]