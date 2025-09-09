<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useConfig } from '@/composables/useConfig'
const navOpen = ref(false)
const routeItems = reactive([
    {
        'label': 'Events',
        'link': '/events',
    },
    {
        'label': 'About',
        'link': '/about',
    },
    {
        'label': 'Blog',
        'link': '/blog',
    },
    {
        'label': 'Contact',
        'link': '/contact',
    },
])
</script>
<template>
    <!-- header -->
    <header class="bg-black fixed w-full z-20 top-0 start-0 border-b">
        <div class="w-[95%] flex flex-wrap items-center justify-between mx-auto p-4">
            <RouterLink to="/" class="">
                <img src="@/assets/icons/logowhite.png" alt="Uni Events Logo" class="h-12 w-auto" />
            </RouterLink>
            <div class="items-center justify-between gap-5 w-full md:flex md:w-auto md:order-1" :class="navOpen ? 'block' : 'hidden'">
                <ul class="flex flex-col p-4 mt-4 font-medium rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 border-white border-3">
                    <template v-for="(item, index) in routeItems" :key="index">
                        <li><RouterLink :to=item.link class="block text-white">{{ item.label }}</RouterLink></li>
                    </template>
                </ul>
                <RouterLink to="/login" class="pl-5 pr-5 pt-2 pb-2 block rounded-2xl border-white border-2 font-semibold text-white">Login</RouterLink>
            </div>
        </div>
    </header>
</template>
<style scoped lang="scss">
</style>