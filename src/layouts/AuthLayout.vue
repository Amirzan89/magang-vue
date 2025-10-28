<script setup>
import { onBeforeMount, reactive } from 'vue'
import Loading from '@/components/Loading.vue'
import FooterHome from '@/layouts/FooterHome.vue'
import { useGlobalStore } from '@/stores/Global'
const globalStore = useGlobalStore()
const local = reactive({
    isGoogle: false,
})
onBeforeMount(() => {
    if(globalStore.message){
        local.isGoogle = true
    }
})
</script>
<template>
    <main class="relative h-screen flex flex-col">
        <div class="relative w-full h-30 sm:h-[130px] md:h-35 lg:h-[150px] flex justify-center items-center">
            <img src="@/assets/images/logowhite.png" alt="" class="h-[44.5%] object-contain">
            <div class="absolute top-0 left-0 w-full h-full -z-1">
                <img src="@/assets/images/header.png" alt="" class="w-full h-full object-fill"/>
                <div class="absolute top-0 left-0 w-full h-full opacity-90" style="background: #ED4690; background: linear-gradient(145deg,rgba(237, 70, 144, 1) 0%, rgba(85, 34, 204, 1) 100%)"/>
            </div>
        </div>
        <router-view></router-view>
    </main>
    <FooterHome/>
    <Dialog v-model:visible="local.isGoogle" class="w-[70%] xs:w-[230px] phone:w-[300px]" :closable="false" pt:mask:class="backdrop-blur-sm" modal dismissableMask @after-hide="globalStore.reset()">{{ globalStore.message }}</Dialog>
    <Loading/>
    <Toast position="bottom-right" />
</template>