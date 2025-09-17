export default [
    {
        path: '/',
        name: 'HomePage',
        component: () => import('@/views/Home.vue'),
        meta: { layout: 'default' },
    },
    {
        path: '/search',
        name: 'EventSearchPage',
        component: () => import('@/views/EventSearch.vue'),
        meta: { layout: 'default' },
    },
]