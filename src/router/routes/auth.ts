export default [
    {
        path: '/login',
        name: 'LoginPage',
        component: () => import('@/views/Admin/Dashboard.vue'),
        meta: { layout: 'mpety' },
    },
]