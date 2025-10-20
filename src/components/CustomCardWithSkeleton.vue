<script setup lang="ts">
import { ref, shallowRef, useSlots, computed, type Component, watch, onBeforeMount, onMounted, markRaw, watchEffect } from 'vue'
import { breakpoints } from '@/composables/useScreenSize'
const slots = useSlots()
const props = defineProps<{
    isLoading?: boolean,
    inpVar?: Record<string, any>
    metaData: {
        wrapper?: (inpData: any) => Component
        customTWGrand?: string
        customTWTransition?: string
        customCSSTransition?: string
        snapshots?: Partial<Record<keyof typeof breakpoints | 'base', number>>
        pagination?: {
            customTWPaginator?: string
            item_id: string
            lazyLoading?: boolean
            preRenderPage?: number
        }
    }
    inpData?: Record<string, any>[]
    paralelRender?: number
    serverSide?: boolean
}>()
const emit = defineEmits(['lazy-data'])
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const wrapperCache = new Map()
const skeletonRefs: any = shallowRef<HTMLElement[]>([])
const cardRefs: any = shallowRef<HTMLElement[]>([])
const queue = markRaw([] as number[])
const active = new Set<number>()
const parallelLimit = ref(props.paralelRender ?? 1)
const first = ref(0)
const total = computed(() => props.inpData?.length)
const maxRenderItemTest: number = Infinity
let counterSkeletonTest = 0
let lastDataLength = 0
const breakpointsFn = (inp: Partial<Record<keyof typeof breakpoints | 'base', number>>) => {
    const active = (Object.keys(breakpoints) as (keyof typeof breakpoints)[]).reverse().find(bp => {
        const val = breakpoints[bp]
        return typeof val === 'object' && 'value' in val && val.value && bp in inp
    })
    return (active ? (inp[active] as number) : (inp.base as number)) ?? 1
}
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
const useTotalItems = () => {
    const snaps = props.metaData.snapshots
    return breakpointsFn(parsedCols.value) * ((snaps && typeof snaps === 'object') ? breakpointsFn(snaps) : 1)
}
const isEmitting = ref(false)
const prevRows = ref(0)
const rows = ref(useTotalItems())
const totalItems = computed(() => useTotalItems())
const pagedData = computed(() => {
    if(props.serverSide) return props.inpData
    if(first.value == 0){
        return props.inpData?.slice(0, useTotalItems()) ?? []
    }
    return props.inpData?.slice(first.value, first.value + (rows.value ?? 0)) ?? []
})
const hasData = computed(() => {
    return props.inpData && props.inpData!.length > 0
})
const renderItems = computed<any | null>(() => {
    const base = props.inpData ?? []
    const extra = slots['placeholder-card'] ? [null] : []
    return [...base, ...extra]
})
const getWrapper = (inpData: any) => {
    const key = inpData?.wrapperKey || inpData?.event_id || 'default'////////must_revision////////////////////
    if(!wrapperCache.has(key)){
        wrapperCache.set(key, props.metaData.wrapper!(inpData))
    }
    return wrapperCache.get(key)
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
    const pos = queue.indexOf(index)
    if(pos !== -1) queue.splice(pos, 1)
    processQueue()
}
const processQueue = () => {
    if(queue.length === 0) return
    while(active.size < parallelLimit.value && queue.length > 0){
        if(counterSkeletonTest >= maxRenderItemTest){
            break
        }
        const index = queue.shift()!
        runAnimation(index)
        counterSkeletonTest++
    }
}
const handleToggleSkeleton = (index: number) => {
    const isInCurrentPage = index >= first.value && index < first.value + rows.value
    if(isInCurrentPage){
        queue.unshift(index)
    }else{
        queue.push(index)
    }
    processQueue()
}
const handlePage = (e: any) => {
    first.value = e.first
    rows.value = e.rows
    if(props.metaData.pagination?.lazyLoading && (((e.page + 1) + (props.metaData.pagination.preRenderPage ?? 0)) >= e.pageCount)){
        emit('lazy-data', e)
    }
}
watch([() => props.inpData?.length, totalItems],  ([newLen]) => {
    if(isEmitting.value && (newLen ?? 0) > lastDataLength){
        isEmitting.value = false
        lastDataLength = newLen ?? 0
        return
    }
    if(totalItems.value !== rows.value || totalItems.value !== 0){
        prevRows.value = rows.value
        first.value = Math.floor(first.value / rows.value) * totalItems.value
        rows.value = totalItems.value
        if(props.metaData.pagination){
            if(props.metaData.pagination?.lazyLoading && (first.value + rows.value >= (props.inpData?.length ?? 0))){
                isEmitting.value = true
                lastDataLength = newLen ?? 0
                emit('lazy-data', null)
            }
            const startIndex = first.value
            const endIndex = first.value + rows.value
            active.forEach(id => {
                if((id - 1) < startIndex || (id - 1) >= endIndex){
                    active.delete(id)
                }
            })
            queue.sort((a, b) => {
                const aIn = (a - 1) >= startIndex && (a - 1) < endIndex
                const bIn = (b - 1) >= startIndex && (b - 1) < endIndex
                return (bIn ? 1 : 0) - (aIn ? 1 : 0)
            })
            processQueue()
        }
    }
})
onBeforeMount(() => {
    if(props.metaData.pagination && props.metaData.pagination?.lazyLoading && (first.value + rows.value >= (props.inpData?.length ?? 0))){
        emit('lazy-data', null)
    }
})
</script>
<template>
    <div v-if="!props.isLoading" :class="metaData.customTWGrand">
        <div :class="metaData.customTWTransition" :style="metaData.customCSSTransition">
            <component v-if="hasData" v-for="(item, indexPar) in renderItems" :key="indexPar <= props.inpData!.length ? item?.[props.metaData.pagination?.item_id!] : `card-${indexPar}-${props.inpData?.length}`" v-show="indexPar >= first && indexPar < (first + rows)" :is="getWrapper(item)">
                <template v-if="item && (indexPar < props.inpData!.length)">
                    <slot name="skeleton" :index="indexPar" :skeletonRefs="skeletonRefs"/>
                    <slot name="card" :index="indexPar" :inpData="item" :toggleSkeleton="(i: number) => handleToggleSkeleton(i)" :cardRefs="cardRefs"/>
                </template>
                <slot v-else name="placeholder-card"/>
            </component>
        </div>
        <Paginator v-if="metaData.pagination && pagedData && pagedData.length > 0" class="flex justify-center" :class="metaData.pagination.customTWPaginator" :first="first" :rows="rows" :totalRecords="total" @page="handlePage"/>
    </div>
    <div v-else :class="metaData.customTWTransition" :style="metaData.customCSSTransition">
        <slot v-for="indexPar in totalItems" :key="`loadingCard-${indexPar}`"/>
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