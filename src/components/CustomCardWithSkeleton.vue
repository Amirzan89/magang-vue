<script setup lang="ts">
import { ref, useSlots, computed, type Component, watch } from 'vue'
import { breakpoints } from '@/composables/useScreenSize'
const slots = useSlots()
const props = defineProps<{
    isLoading?: boolean,
    inpVar?: Record<string, any>
    metaData: {
        wrapper?: (inpData: any) => Component,
        customTWTransition?: string,
        customCSSTransition?: string,
        pagination?: {
            rowsPerPage: number,
            lazyLoading?: false,
            preRenderPage?: number,
        } 
    }
    inpData?: Record<string, any>[]
    paralelRender: number
    serverSide?: boolean,
}>()
const emit = defineEmits(['lazy-data'])
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const rowCountPagination = 2
const pagedData = computed(() => {
    if (props.serverSide) return props.inpData
    return props.inpData?.slice(first.value, first.value + (rows.value ?? 0)) ?? []
})
const skeletonRefs: any = ref([])
const cardRefs: any = ref([])
const queue: number[] = []
const active = new Set<number>()
const parallelLimit = ref(props.paralelRender ?? 1)
const first = ref(0)
const rows = ref(props.metaData.pagination?.rowsPerPage)
const resizePaginationTimer = ref<any>(null)
const total = computed(() => props.inpData?.length)
const hasData = computed(() => {
    return props.metaData.pagination ? (pagedData && pagedData.value!.length > 0) : (props.inpData && props.inpData!.length > 0)
})
const renderCards = (cond: 'v-for' | 'item') => {
    if(cond == 'v-for'){
        const base = props.metaData.pagination ? pagedData.value!.length : props.inpData!.length
        return  base + (slots['placeholder-card'] ? 1 : 0)
    }else if(cond == 'item'){
        return props.metaData.pagination ? pagedData.value : props.inpData
    }
}
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
const runAnimation = async (index: number) => {
    active.add(index)
    await delay(10)
    skeletonRefs.value[index]?.classList.add("opacity-0")
    await delay(100)
    skeletonRefs.value[index]?.remove()
    cardRefs.value[index]?.classList.remove("opacity-0")
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
const parseGridCols = (classStr: string) => {
    const regex = /([a-z0-9]*:)?grid-cols-(\d+)/g
    const cols: Record<string, number> = {}
    let match
    while((match = regex.exec(classStr)) !== null) {
        const bp = match[1]?.replace(':', '') || 'base'
        cols[bp] = parseInt(match[2], 10)
    }
    return cols
}
const parsedCols = computed(() => parseGridCols(props.metaData.customTWTransition ?? ''))
const colCount = computed(() => {
    if(breakpoints['2xl'].value) return parsedCols.value['2xl']
    if(breakpoints.lg.value) return parsedCols.value.lg
    if(breakpoints.md.value) return parsedCols.value.md
    if(breakpoints.phone.value) return parsedCols.value.phone
    return parsedCols.value.base ?? 1
})
const handlePage = (e: any) => {
    first.value = e.first
    rows.value = e.rows
    if(props.metaData.pagination?.lazyLoading && (((e.page + 1) + (props.metaData.pagination.preRenderPage ?? 0)) >= e.pageCount)){
        emit('lazy-data', e)
    }
}
watch([() => props.inpData, colCount], () => {
    if (resizePaginationTimer.value) clearTimeout(resizePaginationTimer.value)
    resizePaginationTimer.value = setTimeout(() => {
        if(props.inpData && props.inpData.length > 0 && props.metaData.pagination){
            const baseRows = props.metaData.pagination.rowsPerPage ?? rowCountPagination
            rows.value = colCount.value * baseRows
            first.value = 0
        }
    }, 10)
})
</script>
<template>
    <div>
        <div :class="metaData.customTWTransition" :style="metaData.customCSSTransition">
            <template v-if="!props.isLoading && hasData" v-for="indexPar in renderCards('v-for')" :key="'ifCard' + indexPar + Date.now()">
                <component v-if="metaData.wrapper" :is="metaData.wrapper(renderCards('item')[indexPar - 1])">
                    <slot :name="slotSkeleton(indexPar)" :index="indexPar" :skeletonRefs="skeletonRefs"/>
                    <slot :name="slotCard(indexPar)" :index="indexPar" :inpData="renderCards('item')[indexPar - 1]" :toggleSkeleton="handleToggleSkeleton" :cardRefs="cardRefs"/>
                </component>
            </template>
            <!-- <template v-if="!props.isLoading && pagedData && pagedData.length > 0" v-for="indexPar in pagedData.length + (slots['placeholder-card'] ? 1 : 0)" :key="'ifCard' + indexPar">
                <component v-if="metaData.wrapper" :is="metaData.wrapper(pagedData[indexPar - 1])">
                    <slot :name="slotSkeleton(indexPar)" :index="indexPar" :skeletonRefs="skeletonRefs"/>
                    <slot :name="slotCard(indexPar)" :index="indexPar" :inpData="pagedData[indexPar - 1]" :toggleSkeleton="handleToggleSkeleton" :cardRefs="cardRefs"/>
                </component>
            </template> -->
            <template v-else v-for="indexPar in colCount" :key="'elseCard' + indexPar">
                <slot/>
            </template>
        </div>
        <Paginator v-if="!props.isLoading && pagedData && pagedData.length > 0 && metaData.pagination" class="mt-6 flex justify-center" :first="first" :rows="rows" :totalRecords="total" @page="handlePage"/>
    </div>
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