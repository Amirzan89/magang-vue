<script setup lang="ts">
import { computed, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import theme from '@/theme'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import EmptyLayout from '@/layouts/EmptyLayout.vue'
import LoadingComponent from './components/Loading.vue'
import ToastComponent from './components/CustomToast/ToastContainer.vue'
const route = useRoute()
const layouts: any = {
    default: DefaultLayout,
    auth: AuthLayout,
    empty: EmptyLayout,
}
const layoutName = computed(() => {
    return route.matched[route.matched.length - 1]?.meta?.layout as string || 'default'
})
const dynamicPad: any = {
    '3xs':'30px',
    '2xs':'30px',
    'xs':'30px',
    'sm':'40px',
    'md':'50px',
    'lg':'60px',
    'xl':'70px',
    '2xl':'120px',
}
let screenCon: any = null;
const Layout = computed(() => layouts[layoutName.value] ?? layouts.default)
const updatePadding = () => {
    const currentWidth = window.innerWidth;
    const breakpoints = [...screenCon].sort((a, b) => b - a);
    const breakpoint = breakpoints.find((fixWidth) => {
        return currentWidth >= fixWidth;
    });
    if(!breakpoint){
        document.documentElement.style.setProperty('--paddTop', '50');
        return;
    }
    document.documentElement.style.setProperty('--paddTop', `${dynamicPad[Object.keys(dynamicPad)[screenCon.indexOf(breakpoint)]]}`);
    return;
}
onBeforeMount(() => {
    screenCon = Object.values(theme.screens).map((item) => {
        return parseInt(item.replace('px', ''));
    });
    updatePadding();
});
window.onresize = () => {
    updatePadding();
}
</script>
<template>
    <transition name="fade" mode="out-in">
        <component :is="Layout" :key="layoutName" />
    </transition>
    <LoadingComponent/>
    <ToastComponent/>
</template>
<style>
.fade-enter-active,.fade-leave-active { transition: opacity .15s }
.fade-enter-from,.fade-leave-to { opacity: 0 }
</style>