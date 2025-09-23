<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
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
    <header class="sticky w-full z-20 top-0 start-0 bg-black">
        <div class="w-[95%] h-full flex flex-wrap items-center justify-between mx-auto">
            <RouterLink to="/" class="">
                <img src="@/assets/icons/logowhite.png" alt="Uni Events Logo" class="w-auto" />
            </RouterLink>
            <div class="items-center justify-between gap-5 w-full md:flex md:w-auto md:order-1" :class="navOpen ? 'block' : 'hidden'">
                <ul class="flex flex-col p-4 mt-4 font-medium gap-5 md:flex-row md:mt-0">
                    <template v-for="(item, index) in routeItems" :key="index">
                        <li><RouterLink :to=item.link class="block xl:text-xl text-white">{{ item.label }}</RouterLink></li>
                    </template>
                </ul>
                <RouterLink to="/login" class="xl:px-4 xl:py-1.75 block rounded-xl border-white border-2 text-xl font-semibold text-white">Login</RouterLink>
            </div>
        </div>
    </header>
</template>
<style scoped lang="scss">
header{
    z-index: 999;
    height: var(--paddTop);
    scroll-padding-top: var(--paddTop);
}
header img{
    height: calc(var(--paddTop) - 15px);
}
</style>