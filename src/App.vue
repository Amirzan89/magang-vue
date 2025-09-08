<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import EmptyLayout from '@/layouts/EmptyLayout.vue'
import LoadingComponent from './components/Loading.vue'
const layouts = {
    default: DefaultLayout,
    auth: AuthLayout,
    empty: EmptyLayout,
}
const route = useRoute()
const layoutName = computed(() => {
    return route.matched[route.matched.length - 1]?.meta?.layout as string || 'default'
})
const Layout = computed(() => layouts[layoutName.value] ?? layouts.default)
watchEffect(() => {
    console.log('current layout:', layoutName.value)
    console.log('Leaf meta:', route.matched.at(-1))
})
</script>
<template>
    <component :is="Layout" :key="layoutName" />
    <LoadingComponent/>
    <!-- kalau mau animasi antar layout -->
    <!--
    <transition name="fade" mode="out-in">
        <component :is="Layout" :key="layoutName" />
    </transition>
    -->
</template>
<style>
.fade-enter-active,.fade-leave-active { transition: opacity .15s }
.fade-enter-from,.fade-leave-to { opacity: 0 }
</style>