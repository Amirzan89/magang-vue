<script setup lang="ts">
import { computed, provide, watch } from 'vue'
import { useRoute } from 'vue-router'
import { customBreakpoints, width } from '@/composables/useScreenSize'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import EmptyLayout from '@/layouts/EmptyLayout.vue'
import LoadingComponent from './components/Loading.vue'
const route = useRoute()
type LayoutKey = 'admin' | 'default' | 'empty'
const layouts: Record<LayoutKey, any> = {
    default: DefaultLayout,
    admin: AdminLayout,
    empty: EmptyLayout,
}
const layoutName = computed(() => (route.matched[route.matched.length - 1]?.meta?.layout as LayoutKey) || 'default')
const Layout = computed(() => layouts[layoutName.value] ?? layouts.empty)
const dynamicPad: Record<string, string> = {
    '3xs':'55px','2xs':'55px','xs':'60px', 'phone': '70px', 'sm':'70px',
    'md':'70px','lg':'70px','xl':'70px','2xl':'75px',
}
const updatePadding = () => {
    const screenCon = Object.values(customBreakpoints)
    const breakpoint = [...screenCon].sort((a,b) => b-a).find(b => width.value >= b)
    const pad = breakpoint ? dynamicPad[Object.keys(dynamicPad)[screenCon.indexOf(breakpoint)]] : '50px'
    document.documentElement.style.setProperty('--paddTop', pad)
}
provide('header', '50px')
updatePadding()
watch(width, updatePadding)
</script>
<template>
    <component :is="Layout" :key="layoutName" />
    <!-- <LoadingComponent/> -->
</template>
<style>
.fade-enter-active,.fade-leave-active { transition: opacity .15s }
.fade-enter-from,.fade-leave-to { opacity: 0 }
</style>