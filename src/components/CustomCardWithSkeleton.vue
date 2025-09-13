<script setup lang="ts">
import { reactive, onBeforeMount, watch, type VNode } from 'vue'
import Card from './ui/card/Card.vue';
import CardContent from './ui/card/CardContent.vue';
interface ComponentItem{
    name?: string,
    render: (componentVar: any, inpData: any) => VNode
}
const props = defineProps<{
    metaData: {
        totalItems: number
        customTWTransition?: string,
        customTWCard?: string,
        customTWCardContent?: string,
        customCSSTransition?: string,
        customCSSCard?: string,
        customCSSCardContent?: string,
    }
    placeholderItems?: {
        skeleton?: VNode
        card: VNode
    },
    componentUI: { skeleton: (index: number) => ComponentItem; card: (index: number) => ComponentItem }
    inpData?: Record<string, any>[]
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
    <TransitionGroup v-if="props.inpData && props.inpData.length > 0" tag="div" name="fade" mode="out-in" key="annn" :class="metaData.customTWTransition" :style="metaData.customCSSTransition">
        <template v-for="indexPar in Math.min(metaData.totalItems, props.inpData.length + 1)" :key="indexPar">
            <template v-if="indexPar <= (props.inpData.length + 1)">
                <Card class="relative" :class="metaData.customTWCard" :style="metaData.customCSSCard">
                    <CardContent :class="metaData.customTWCardContent" :style="metaData.customCSSCardContent">
                        <template v-if="indexPar <= props.inpData.length">
                            <component :is="componentUI.card(indexPar - 1).render(componentVar, props.inpData[indexPar - 1])" />
                            <component :is="componentUI.skeleton(indexPar - 1).render(componentUI, props.inpData[indexPar - 1])" />
                        </template>
                        <template v-else-if="placeholderItems">
                            <component :is="placeholderItems.card" />
                            <component v-if="placeholderItems.skeleton" :is="placeholderItems.skeleton"/>
                        </template>
                    </CardContent>
                </Card>
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