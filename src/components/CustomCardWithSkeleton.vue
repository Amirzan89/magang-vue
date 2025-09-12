<script setup lang="ts">
import { reactive, onBeforeMount, watch, type VNode } from 'vue'
interface ComponentItem{
    name?: string,
    render: (componentVar: any, inpData: any) => VNode
}
const props = defineProps<{
    customTW?: string,
    customCSS?: string,
    componentUI: { skeleton: (index: string) => ComponentItem; card: (index: string) => ComponentItem }
    inpData?: Record<string, any>
}>()
const inpData: any = reactive({})
const componentVar: any = reactive([])
onBeforeMount(() => {
})
watch(() => props.inpData, (newData) => {
    if(!newData) return
    newData.forEach((item: any, index: number) => {
        Object.values(props.componentUI).forEach((element: any) => {
            const name = typeof element === 'function' ? element(index).name : element.name
            if(name) componentVar.push({ [name]: {} })
        });
    });
    Object.assign(inpData, newData)
}, { immediate:true })
defineExpose({ inpData });
</script>
<template>
    <TransitionGroup v-if="props.inpData && props.inpData.length" tag="div" name="fade" mode="out-in" key="annn" :class="customTW" :style="customCSS">
        <template v-for="(item, index) in props.inpData" :key="item.id">
            <!-- <component :is="componentUI.skeleton(index).render(componentVar, item)" /> -->
            <component :is="componentUI.card(index).render(componentVar, item)" />
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