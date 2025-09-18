<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import theme from '@/theme'
import { width } from '@/composables/useScreenSize'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import EmptyLayout from '@/layouts/EmptyLayout.vue'
import LoadingComponent from './components/Loading.vue'
import ToastComponent from './components/CustomToast/ToastContainer.vue'
const route = useRoute()
const layouts: Record<string, any> = {
    default: DefaultLayout,
    auth: AuthLayout,
    empty: EmptyLayout,
}
const layoutName = computed(() => route.matched[route.matched.length - 1]?.meta?.layout || 'default')
const Layout = computed(() => layouts[layoutName.value] ?? layouts.empty)
const dynamicPad: Record<string, string> = {
    '3xs':'30px','2xs':'30px','xs':'30px','sm':'40px',
    'md':'50px','lg':'60px','xl':'70px','2xl':'120px',
    }
    const screenCon = Object.values(theme.screens).map(s => parseInt(s.replace('px','')))
    const updatePadding = () => {
    const breakpoint = [...screenCon].sort((a,b) => b-a).find(b => width.value >= b)
    const pad = breakpoint ? dynamicPad[Object.keys(dynamicPad)[screenCon.indexOf(breakpoint)]] : '50px'
    document.documentElement.style.setProperty('--paddTop', pad)
}
updatePadding()
watch(width, updatePadding)
</script>
<template>
    <!-- <transition name="fade" mode="out-in"> -->
        <component :is="Layout" :key="layoutName" />
    <!-- </transition> -->
    <LoadingComponent/>
    <ToastComponent/>
</template>
<style>
.fade-enter-active,.fade-leave-active { transition: opacity .15s }
.fade-enter-from,.fade-leave-to { opacity: 0 }
</style>