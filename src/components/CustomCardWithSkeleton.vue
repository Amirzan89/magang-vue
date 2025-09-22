<script setup lang="ts">
import { ref, useSlots, type Component } from 'vue'
const slots = useSlots()
const props = defineProps<{
    inpVar?: Record<string, any>
    metaData: {
        wrapper: (inpData: any) => Component,
        customTWTransition?: string,
        customCSSTransition?: string,
    }
    inpData?: Record<string, any>[]
    paralelRender: number
}>()
const slotSkeleton = (indexPar: number) => {
    if(indexPar <= props.inpData!.length){
        return 'skeleton'
    }else if(slots['placeholder-skeleton']){
        return 'placeholder-skeleton'
    }
    return undefined
}
const slotCard = (indexPar: number) => {
    if(indexPar <= props.inpData!.length){
        return 'card'
    }else if(slots['placeholder-card']){
        return 'placeholder-card'
    }
    return undefined
}
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const skeletonRefs: any = ref([])
const cardRefs: any = ref([])
const queue: number[] = []
const active = new Set<number>()
const parallelLimit = ref(props.paralelRender ?? 1)
const runAnimation = async (index: number) => {
    active.add(index)
    await delay(10)
    skeletonRefs.value[index]!.style.opacity = "0"
    await delay(100)
    skeletonRefs.value[index]?.remove()
    cardRefs.value[index]!.style.opacity = "1"
    await delay(100)
    active.delete(index)
    processQueue()
}
const processQueue = () => {
    if (queue.length === 0) return
    while (active.size < parallelLimit.value && queue.length > 0) {
        const index = queue.shift()!
        runAnimation(index)
    }
}
const handleToggleSkeleton = (index: number) => {
    queue.push(index)
    processQueue()
}
</script>
<template>
    <TransitionGroup v-if="props.inpData && props.inpData.length > 0" tag="div" name="fade" mode="out-in" key="annn" :class="metaData.customTWTransition" :style="metaData.customCSSTransition">
        <template v-for="indexPar in props.inpData.length + (slots['placeholder-card'] ? 1 : 0)" :key="indexPar">
            <component :is="metaData.wrapper(props.inpData[indexPar - 1])">
                <slot :name="slotSkeleton(indexPar)" :index="indexPar" :skeletonRefs="skeletonRefs"/>
                <slot :name="slotCard(indexPar)" :index="indexPar" :inpData="props.inpData[indexPar - 1]" :toggleSkeleton="handleToggleSkeleton" :cardRefs="cardRefs"/>
            </component>
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