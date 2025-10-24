<script setup>
import { RouterLink } from 'vue-router'
import { useLayout } from './composables/layout'
import { useFetchDataStore } from '@/stores/FetchData'
const { toggleMenu } = useLayout()
const fetchDataS = useFetchDataStore()
import Im_DefaultBoy from '@/assets/images/default_boy.jpg'
import Im_DefaultGirl from '@/assets/images/default_girl.png'
const renderImgFallback = () => {
    if(!fetchDataS.cacheAuth) return Im_DefaultBoy
    return fetchDataS.cacheAuth.jenis_kelamin == 'laki-laki' ? Im_DefaultBoy : Im_DefaultGirl
}
</script>
<template>
    <div class="layout-topbar h-full">
        <div ref="bgLayer" class="absolute top-0 left-0 w-full h-full -z-1">
            <img src="@/assets/images/header.png" alt="" class="w-full h-full object-cover" />
            <div class="absolute top-0 left-0 w-full h-full opacity-90 bg-red-500" style="background: #ED4690; background: linear-gradient(145deg,rgba(237, 70, 144, 1) 0%, rgba(85, 34, 204, 1) 100%)"></div>
        </div>
        <div class="layout-topbar-logo-container h-full">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button>
            <RouterLink to="/" class="layout-topbar-logo h-full">
                <img src="@/assets/icons/logowhite.png" alt="Uni Events Logo" class="w-auto" style="height: calc(100% - 10px);"/>
            </RouterLink>
        </div>
        <div class="layout-topbar-actions">
            <button class="layout-topbar-menu-button layout-topbar-action" v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }">
                <i class="pi pi-ellipsis-v"></i>
            </button>
            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <RouterLink to="/profile" class="layout-topbar-action hover:!bg-transparent">
                        <img v-if="fetchDataS.imgUrl" :src="fetchDataS.imgUrl" @error="renderImgFallback" alt="Foto Profil" class="rounded-full object-cover"/>
                        <img v-else :src="renderImgFallback" alt="Default" class="rounded-full object-cover"/>
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>
