export default [
    {
        path: '/',
        name: 'HomePage',
        component: () => import('@/views/Home.vue'),
        meta: { layout: 'default' },
    },
]