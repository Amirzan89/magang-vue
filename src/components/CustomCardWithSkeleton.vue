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
        snapshots?: Partial<Record<keyof typeof breakpoints | 'base', number>>
        pagination?: {
            rowsPerPage: number,
            lazyLoading?: boolean,
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
const wrapperCache = new Map()
const skeletonRefs: any = ref([])
const cardRefs: any = ref([])
const queue: number[] = []
const active = new Set<number>()
const parallelLimit = ref(props.paralelRender ?? 1)
const first = ref(0)
const rows = ref(props.metaData.pagination?.rowsPerPage)
const resizePaginationTimer = ref<any>(null)
const total = computed(() => props.inpData?.length)
const breakpointsFn = (inp: Partial<Record<keyof typeof breakpoints | 'base', number>>) => {
    const active = (Object.keys(breakpoints) as (keyof typeof breakpoints)[]).reverse().find(bp => {
        const val = breakpoints[bp]
        return typeof val === 'object' && 'value' in val && val.value && bp in inp
    })
    return (active ? (inp[active] as number) : (inp.base as number)) ?? 1
}
const pSnapshots = computed<number>(() => {
    const snaps = props.metaData.snapshots
    if(!snaps || typeof snaps !== 'object') return 1
    return breakpointsFn(snaps)
})
const parseGridCols = (classStr: string) => {
    const regex = /([a-z0-9]*:)?grid-cols-(\d+)/g
    const cols: Record<string, number> = {}
    let match
    while((match = regex.exec(classStr)) !== null){
        const bp = match[1]?.replace(':', '') || 'base'
        cols[bp] = parseInt(match[2], 10)
    }
    return cols
}
const parsedCols = computed(() => parseGridCols(props.metaData.customTWTransition ?? ''))
const colCount = computed(() => {
    return breakpointsFn(parsedCols.value)
})
const pagedData = computed(() => {
    if(props.serverSide) return props.inpData
    if(props.metaData.snapshots) return props.inpData?.slice(0, (colCount.value) * pSnapshots.value) ?? []
    return props.inpData?.slice(first.value, first.value + (rows.value ?? 0)) ?? []
})
const hasData = computed(() => {
    return props.metaData.pagination ? (pagedData && pagedData.value!.length > 0) : (props.inpData && props.inpData!.length > 0)
})
const renderForCards = computed(() => {
    return ((props.metaData.snapshots || props.metaData.pagination) ? pagedData.value!.length : props.inpData!.length) + (slots['placeholder-card'] ? 1 : 0)
})
const renderItemCards = computed(() => {
    return props.metaData.pagination ? pagedData.value : props.inpData
})
const loadingItems = computed(() => {
    return props.metaData.snapshots ? colCount.value * pSnapshots.value : colCount.value
})
const getWrapper = (inpData: any) => {
    const key = inpData?.wrapperKey || inpData?.event_id || 'default'
    if(!wrapperCache.has(key)){
        wrapperCache.set(key, props.metaData.wrapper!(inpData))
    }
    return wrapperCache.get(key)
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
            <component v-if="!props.isLoading && hasData" v-for="indexPar in renderForCards" :key="`card-${indexPar}`" :is="getWrapper(renderItemCards?.[indexPar - 1])">
                <slot :name="slotSkeleton(indexPar)" :index="indexPar" :skeletonRefs="skeletonRefs"/>
                <slot :name="slotCard(indexPar)" :index="indexPar" :inpData="renderItemCards![indexPar - 1]" :toggleSkeleton="handleToggleSkeleton" :cardRefs="cardRefs"/>
            </component>
            <slot v-else v-for="indexPar in loadingItems" :key="`elseCard-${indexPar}`"/>
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