export default [
    {
        path: '/dashboard',
        name: 'DashboardPage',
        component: () => import('@/views/Admin/Dashboard.vue'),
        meta: { layout: 'admin' },
    },
    {
        path: '/event-booked',
        name: 'EventBookedPage',
        component: () => import('@/views/Admin/EventBooked.vue'),
        meta: { layout: 'admin' },
    },
    {
        path: '/profile',
        name: 'ProfilePage',
        component: () => import('@/views/Admin/Profile.vue'),
        meta: { layout: 'admin' },
    },
]