export default [
    {
        path: '/login',
        name: 'LoginPage',
        component: () => import('@/views/Auth/Login.vue'),
        meta: { layout: 'auth', requiresAuth: true },
    },
]