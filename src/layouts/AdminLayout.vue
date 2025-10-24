<script setup>
import { useLayout } from './composables/layout'
import { computed, ref, watch } from 'vue'
import FooterAdmin from './FooterAdmin.vue'
import Sidebar from './Sidebar.vue'
import HeaderAdmin from './HeaderAdmin.vue'
import Loading from '@/components/Loading.vue'
const { layoutConfig, layoutState, isSidebarActive } = useLayout()
const outsideClickListener = ref(null)
watch(isSidebarActive, (newVal) => {
    if(newVal){
        bindOutsideClickListener()
    }else{
        unbindOutsideClickListener()
    }
})
const containerClass = computed(() => {
    return {
        'layout-overlay': layoutConfig.menuMode === 'overlay',
        'layout-static': layoutConfig.menuMode === 'static',
        'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive,
        'layout-mobile-active': layoutState.staticMenuMobileActive
    }
})
const bindOutsideClickListener = () => {
    if(!outsideClickListener.value){
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                layoutState.overlayMenuActive = false
                layoutState.staticMenuMobileActive = false
                layoutState.menuHoverActive = false
            }
        }
        document.addEventListener('click', outsideClickListener.value)
    }
}
const unbindOutsideClickListener = () => {
    if(outsideClickListener.value){
        document.removeEventListener('click', outsideClickListener)
        outsideClickListener.value = null
    }
}
const isOutsideClicked = (event) => {
    const sidebarEl = document.querySelector('.layout-sidebar')
    const topbarEl = document.querySelector('.layout-menu-button')
    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target))
}
</script>
<template>
    <div class="layout-wrapper" :class="containerClass">
        <HeaderAdmin/>
        <Sidebar/>
        <div class="layout-main-container relative overflow-x-clip overflow-y-clip">
            <img src="@/assets/images/cele-3.png" alt="" class="absolute bottom-0 md:-bottom-5 -right-13 sm:-right-23 md:-right-32 lg:-right-35 xl:-right-35 2xl:-right-37 h-57 xs:h-62 phone:h-65 sm:h-90 md:h-130 lg:h-132 xl:h-137 2xl:h-145 -z-1 object-contain opacity-30 scale-300 sm:scale-270 md:scale-250"/>
            <main class="layout-main">
                <router-view></router-view>
            </main>
            <FooterAdmin/>
        </div>
        <div class="layout-mask animate-fadein"></div>
    </div>
    <Loading/>
    <Toast position="bottom-right" />
</template>