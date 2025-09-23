<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import theme from '@/theme'
import { width } from '@/composables/useScreenSize'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import EmptyLayout from '@/layouts/EmptyLayout.vue'
import LoadingComponent from './components/Loading.vue'
const route = useRoute()
const layouts: Record<string, any> = {
    default: DefaultLayout,
    auth: AuthLayout,
    empty: EmptyLayout,
}
const layoutName = computed(() => route.matched[route.matched.length - 1]?.meta?.layout || 'default')
const Layout = computed(() => layouts[layoutName.value] ?? layouts.empty)
const dynamicPad: Record<string, string> = {
    '3xs':'55px','2xs':'55px','xs':'60px', 'phone': '70px', 'sm':'70px',
    'md':'70px','lg':'70px','xl':'70px','2xl':'75px',
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
</template>
<style>
.fade-enter-active,.fade-leave-active { transition: opacity .15s }
.fade-enter-from,.fade-leave-to { opacity: 0 }
</style>