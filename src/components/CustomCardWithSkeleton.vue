<script setup lang="ts">
import { reactive, type VNode, type Component } from 'vue'
interface ComponentItem{
    name?: string,
    render: (inpData: any) => Component
}
const props = defineProps<{
    metaData: {
        wrapper: (inpData: any) => Component,
        totalItems: number
        customTWTransition?: string,
        customCSSTransition?: string,
    }
    placeholderItems?: {
        skeleton?: VNode
        card: VNode
    },
    componentUI: { skeleton: (index: number) => ComponentItem; card: (index: number) => ComponentItem }
    inpData?: Record<string, any>[]
}>()
const toggleSkeleton: any = reactive({})
const handleToggleSkeleton = (data: { name: string, showSkeleton: boolean }) => {
    const { name, ...restValues } = data
    const prev = toggleSkeleton[name] || {}
    const next = { ...prev, ...restValues }
    if (JSON.stringify(prev) === JSON.stringify(next)) return
    toggleSkeleton[name] = next
}
</script>
<template>
    <TransitionGroup v-if="props.inpData && props.inpData.length > 0" tag="div" name="fade" mode="out-in" key="annn" :class="metaData.customTWTransition" :style="metaData.customCSSTransition">
        <template v-for="indexPar in Math.min(metaData.totalItems, props.inpData.length + 1)" :key="indexPar">
            <template v-if="indexPar <= (props.inpData.length + (props.placeholderItems ? 1 : 0))">
                <component :is="metaData.wrapper(props.inpData[indexPar - 1])">
                    <template v-if="(toggleSkeleton[componentUI.skeleton(indexPar - 1).name!]?.showSkeleton ?? true) && (componentUI.skeleton || placeholderItems)">
                        <component v-if="indexPar <= props.inpData.length" :is="componentUI.skeleton(indexPar - 1).render(props.inpData[indexPar - 1])" />
                        <component v-else-if="placeholderItems" :is="placeholderItems.skeleton"/>
                    </template>
                    <template v-if="componentUI.card || placeholderItems">
                        <component v-if="indexPar <= props.inpData.length" :is="componentUI.card(indexPar - 1).render(props.inpData[indexPar - 1])" @toggleSkeleton="handleToggleSkeleton" />
                        <component v-else-if="placeholderItems" :is="placeholderItems.card" @toggleSkeleton="handleToggleSkeleton" />
                    </template>
                </component>
            </template>
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