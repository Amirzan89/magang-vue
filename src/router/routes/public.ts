export default [
    {
        path: '/',
        name: 'HomePage',
        component: () => import('@/views/Home.vue'),
        meta: { layout: 'default', isNeedAuth: { requiresAuth: false } },
    },
    {
        path: '/about',
        name: 'AboutPage',
        component: () => import('@/views/About.vue'),
        meta: { layout: 'default', isNeedAuth: { requiresAuth: false } },
    },
    {
        path: '/events',
        name: 'EventAllPage',
        component: () => import('@/views/EventHome/EventAll.vue'),
        meta: { layout: 'default', isNeedAuth: { requiresAuth: false } },
    },
    {
        path: '/search',
        name: 'EventSearchPage',
        component: () => import('@/views/EventHome/EventSearch.vue'),
        meta: { layout: 'default', isNeedAuth: { requiresAuth: false } },
    },
    {
        path: '/event',
        redirect: '/events',
    },
    {
        path: '/event/:id',
        name: 'EventDetailHomePage',
        component: () => import('@/views/EventHome/EventDetailBooking.vue'),
        meta: { layout: 'default', isNeedAuth: { requiresAuth: false } },
    },
    {
        path: '/booking/:id',
        name: 'EventBookingPage',
        component: () => import('@/views/EventHome/EventDetailBooking.vue'),
        meta: { layout: 'default', isNeedAuth: { requiresAuth: false } },
    },
]