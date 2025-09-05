<template>
    <header class="bg-white fixed w-full z-20 top-0 start-0 border-b border-gray-200">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <RouterLink to="/" class="flex items-center space-x-3 rtl:space-x-reverse">
                <img src="@/assets/images/logowhite.png" alt="Uni Events Logo" class="h-8 w-auto" />
            </RouterLink>
            <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center">Login</button>
                <button type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="navbar-sticky" :aria-expanded="navOpen.toString()" @click="navOpen = !navOpen">
                <span class="sr-only">Open main menu</span>
                <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M1 1h15M1 7h15M1 13h15" />
                </svg>
                </button>
            </div>
            <div id="navbar-sticky"
                class="items-center justify-between w-full md:flex md:w-auto md:order-1" :class="navOpen ? 'block' : 'hidden'">
                <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
                    <template v-for="(item, index) in routeItems" :key="index">
                        <li><RouterLink :to=item.link class="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0">Home</RouterLink></li>
                    </template>
                    <li><RouterLink to="/about" class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0">About</RouterLink></li>
                    <li><RouterLink to="/services" class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0">Services</RouterLink></li>
                    <li><RouterLink to="/contact" class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0">Contact</RouterLink></li>
                </ul>
            </div>
        </div>
    </header>
</template>
<style scoped lang="scss">
</style>
<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useConfig } from '@/composables/useConfig'
const publicConfig = useConfig()
const route = useRoute()
const routeItems = reactive([
    {
        'label': 'Beranda',
        'link': '#beranda',
    },
    {
        'label': 'Tentang Kami',
        'link': '#tentang-kami',
    },
    {
        'label': 'Kategori',
        'link': '#kategori',
    },
    {
        'label': 'Dokumentasi',
        'link': '#dokumentasi',
    },
]);
let header: any = null;
onMounted(() => {
});
</script>