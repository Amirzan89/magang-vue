<script setup>
import { RouterLink } from 'vue-router';
import { useLayout } from './composables/layout';
const { toggleMenu } = useLayout();
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
            <router-link to="/" class="layout-topbar-logo h-full">
                <img src="@/assets/icons/logowhite.png" alt="Uni Events Logo" class="w-auto" style="height: calc(100% - 10px);"/>
            </router-link>
        </div>
        <div class="layout-topbar-actions">
            <button class="layout-topbar-menu-button layout-topbar-action" v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }">
                <i class="pi pi-ellipsis-v"></i>
            </button>
            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <RouterLink to="/profile" class="layout-topbar-action">
                        <i class="pi pi-user"></i>
                        <span>Profile</span>
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>
