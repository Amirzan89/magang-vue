<script setup lang="ts">
import { ref, reactive, type Component } from 'vue'
const props = defineProps<{
    skeleton: Component
    card: Component
    inpVar?: Record<string, any>
}>()
const inpVar: any = reactive({});
const imgLoaded = ref(false)
const imgFailed = ref(false)

function handleImgLoad(){
    imgLoaded.value = true
}
function handleImgError(){
    imgFailed.value = true
}
defineExpose({ inpVar });
</script>
<template>
    <transition name="fade" mode="out-in">
        <component :is="skeleton"></component>
        <component :is="card"></component>
    </transition>
</template>
<style scoped>
    .shimmer{
        position: relative;
        overflow: hidden;
    }
    .shimmer::after{
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        height: 100%;
        width: 100%;
        background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0) 100%
        );
        animation: shimmer 1.2s infinite;
    }
    @keyframes shimmer{
        0% {
            left: -100%;
        }
        100% {
            left: 100%;
        }
    }
    /* Fade transition */
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.3s ease;
    }
    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
</style>