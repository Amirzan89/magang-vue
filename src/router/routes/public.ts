export default [
    {
        path: '/',
        name: 'HomePage',
        component: () => import('@/views/Home.vue'),
        meta: { layout: 'default' },
    },
    {
        path: '/about',
        name: 'AboutPage',
        component: () => import('@/views/About.vue'),
        meta: { layout: 'default' },
    },
    {
        path: '/events',
        name: 'EventAllPage',
        component: () => import('@/views/Events.vue'),
        meta: { layout: 'default' },
    },
    {
        path: '/search',
        name: 'EventSearchPage',
        component: () => import('@/views/EventSearch.vue'),
        meta: { layout: 'default' },
    },
    {
        path: '/events/:id',
        name: 'EventDetailPage',
        component: () => import('@/views/EventDetail.vue'),
        meta: { layout: 'default' },
    },
]