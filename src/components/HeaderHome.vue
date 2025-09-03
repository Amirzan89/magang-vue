<template>
    <header class="tw-w-full tw-h-[70px] tw-sticky tw-top-0 tw-pointer-events-auto tw-flex tw-items-center tw-bg-palBg dark:tw-bg-dark_bg" style="box-shadow: 0px 1px 10px 0px rgba(149,157,165,0.7); -webkit-box-shadow: 0px 1px 10px 0px rgba(149,157,165,0.7); -moz-box-shadow: 0px 1px 10px 0px rgba(149,157,165,0.7);">
        <div class="tw-ml-[3%] tw-flex tw-items-center tw-gap-2">
            <img src="~/assets/images/logo.png" alt="logo" class="tw-w-14"/>
            <h1 class="tw-m-0 tw-p-0 tw-text-base 3xs:tw-text-2xl xl:tw-text-3xl 2xl:tw-text-4xl tw-text-primary dark:tw-text-primary_dark_text tw-font-semibold">{{ publicConfig.appName }}</h1>
        </div>
        <input id="menu-toggle" type="checkbox"/>
        <label class='menu-button-container tw-relative tw-right-5 tw-ml-auto' for="menu-toggle">
            <div class='menu-button'></div>
        </label>
        <ul class="tw-w-max tw-ml-20 tw-p-0 tw-flex tw-justify-between tw-items-center 3xs:tw-gap-0 md:tw-gap-4 lg:tw-gap-5 xl:tw-gap-7 tw-text-palText menu">
            <template v-for="(item, index) in routeItems" :key="index">
                <NuxtLink :href="item.link" class="tw-w-max tw-relative tw-text-xs 3xs:tw-text-sm sm:tw-text-base md:tw-text-lg lg:tw-text-xl xl:tw-text-2xl 3xs:tw-font-normal xl:tw-font-medium" :class="route.hash == item.link ? 'tw-text-pal1' : 'tw-text-palText'">
                    <span> {{ item.label  }}</span>
                </NuxtLink>
            </template>
            <Button class="md:tw-w-25 lg:tw-w-30 xl:tw-w-35 md:tw-h-[60%] 2xl:tw-h-[63%] tw-absolute tw-right-[2%] tw-ml-auto tw-p-0">
                <NuxtLink to="/masuk" class="tw-text-palBg tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center 3xs:tw-text-sm sm:tw-text-base md:tw-text-xl lg:tw-text-2xl xl:tw-text-3xl tw-font-medium">Masuk</NuxtLink>
            </Button>
        </ul>
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