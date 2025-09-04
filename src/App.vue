<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const layouts = {
  default: () => import('@/layouts/DefaultLayout.vue'),
  auth: () => import('@/layouts/AuthLayout.vue'),
  empty: () => import('@/layouts/EmptyLayout.vue'),
}

const route = useRoute()
const layoutName = computed(() => (route.meta.layout as string) || 'default')
const Layout = computed(() => layouts[layoutName.value] ?? layouts.default)
</script>

<template>
  <component :is="Layout" :key="layoutName" />
  <!-- <transition name="fade" mode="out-in"> -->
  <!-- </transition> -->
</template>
<style>
.fade-enter-active,.fade-leave-active { transition: opacity .15s }
.fade-enter-from,.fade-leave-to { opacity: 0 }
</style>