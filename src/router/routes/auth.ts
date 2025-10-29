export default [
    {
        path: '/login',
        name: 'LoginPage',
        component: () => import('@/views/Auth/Login.vue'),
        meta: { layout: 'auth', isNeedAuth: { requiresAuth: false } },
    },
    {
        path: '/forgot-password',
        name: 'ForgotPasswordPage',
        component: () => import('@/views/Auth/ForgotPassword.vue'),
        meta: { layout: 'auth', isNeedAuth: { requiresAuth: false } },
    },
    {
        path: '/ganti-password/:id',
        name: 'GantiPasswordPage',
        component: () => import('@/views/Auth/ForgotPassword.vue'),
        meta: { layout: 'auth', isNeedAuth: { requiresAuth: false } },
    },
]