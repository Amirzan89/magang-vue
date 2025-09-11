<script setup lang="ts">
import { reactive, onBeforeMount } from 'vue'
interface componentItem{
    name?: string,
    render: CallableFunction
}
const props = defineProps<{
    componentUI: componentItem[]
    inpData?: Record<string, any>
}>()
const inpData: any = reactive({})
const componentVar: any = reactive([])
onBeforeMount(() => {
    props.componentUI.forEach((item) => {
        if(item.name) componentVar.push({[item.name]: {} })
    });
    Object.assign(inpData, props.inpData)
})
defineExpose({ inpData });
</script>
<template>
    <TransitionGroup name="fade" mode="out-in">
        <template v-for="(item, index) in componentUI" :key="index">
            <component :is="item.render(inpData)"></component>
        </template>
    </TransitionGroup>
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