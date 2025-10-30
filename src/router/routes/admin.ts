export default [
    {
        path: '/dashboard',
        name: 'DashboardPage',
        component: () => import('@/views/Admin/Dashboard.vue'),
        meta: { layout: 'admin', isNeedAuth: { requiresAuth: true } },
    },
    {
        path: '/kelola-event',
        name: 'EventKelolaPage',
        component: () => import('@/views/Admin/Event/EventKelola.vue'),
        meta: { layout: 'admin', isNeedAuth: { requiresAuth: true } },
    },
    {
        path: '/kelola-event/tambah',
        name: 'EventTambahPage',
        component: () => import('@/views/Admin/Event/EventTambah.vue'),
        meta: { layout: 'admin', isNeedAuth: { requiresAuth: true } },
    },
    {
        path: '/event-booked',
        name: 'EventBookedPage',
        component: () => import('@/views/Admin/EventBooked.vue'),
        meta: { layout: 'admin', isNeedAuth: { requiresAuth: true } },
    },
    {
        path: '/profile',
        name: 'ProfilePage',
        component: () => import('@/views/Admin/Profile.vue'),
        meta: { layout: 'admin', isNeedAuth: { requiresAuth: true } },
    },
]