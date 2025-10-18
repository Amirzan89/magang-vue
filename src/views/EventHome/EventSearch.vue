<script setup lang="ts">
import { Form, FormField } from '@primevue/forms'
import { ref, reactive, watch, onBeforeMount, h, useSlots, defineComponent, nextTick, Teleport, type Ref, type ComponentPublicInstance, computed, toRaw } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import useAxios from '@/composables/api/axios'
import useEncryption from '@/composables/encryption'
import { width, isMobile, isTablet, isDesktop } from '@/composables/useScreenSize'
import { getImgURL } from '@/utils/global'
import CustomCardWithSkeletonComponent from '@/components/CustomCardWithSkeleton.vue'
import freeTag from '@/assets/images/free-tag.png'
import router from '@/router'
const route = useRoute()
const { axiosJson, fetchCsrfToken } = useAxios()
const { encryptReq, decryptRes } = useEncryption()
const SideFilterRef = ref(null)
const DialogContentRef = ref(null)
interface EventData{
    event_id: string,
    event_name: string,
    img: string,
    imgLoad: boolean,
    start_date: string,
}
const local = reactive({
    fetchData: [] as EventData[],
    total_items: 0 as number,
    past_events: null as any,
    reviews: null as any,
    isFormLoading: false,
    isFirstLoad: true,
    next_cursor: null as string | null,
    has_more: false,
    hydratedSR: false as boolean,
    hydratedER: false as boolean,
})
const itemsCategoryFilter = ref<{ label: string, value: string }[]>([])
const itemsPaysFilter = ref([
    { name: 'Free', value: 'free' },
    { name: 'All', value: 'all' },
    { name: 'Pay', value: 'pay' },
])
let filterRules = {
    pay: ["pay", "free", "all"] as const,
    category: [] as any,
    dates: null as Date[] | null,
}
type FilterKey = keyof typeof filterRules
type FilterValues = {
    [K in FilterKey]:
        K extends "category" ? (typeof filterRules[K][number])[]
        : K extends "pay" ? typeof filterRules[K][number] | ""
        : K extends "dates" ? Date[] | null
        : never
}
type InputForm = FilterValues & {
    search: string,
}
type WatchedInput = Pick<InputForm, "category" | "dates" | "pay">
const oldInput = reactive<InputForm>({
    search: '',
    category: [],
    pay: '' as 'pay' | 'free' | 'all',
    dates: [new Date(), new Date()],
})
const currentInput = reactive<InputForm>({
    search: '',
    category: [],
    pay: '' as 'pay' | 'free' | 'all',
    dates: [new Date(), new Date()],
})
const isDialogOpen = ref(false)
const teleportTarget = ref(null)
const displayMode = computed(() => {
    if(local.isFirstLoad || local.isFormLoading) return 'loading'
    if(!local.isFirstLoad && local.fetchData.length === 0){
        isDialogOpen.value = false
        return 'empty'
    } 
    if(local.total_items > 0) return 'success'
    return 'initial'
})
const teleportTargetFn = async() => {
    await nextTick()
    if(isDesktop.value){
        teleportTarget.value = SideFilterRef.value
    }else if((isMobile.value || isTablet.value) && isDialogOpen.value){
        teleportTarget.value = DialogContentRef.value
    }
}
let categoryHydrationController: AbortController | null = null
let abortFormController: AbortController | null = null
let abortHydrationController: AbortController | null = null
let debounceTimers: Partial<Record<keyof WatchedInput, ReturnType<typeof setTimeout>>> = {}
watch(isDesktop, () => {
    if(isDesktop.value && isDialogOpen.value){
        isDialogOpen.value = false
    }
})
watch([isDialogOpen, isDesktop], teleportTargetFn, { immediate: true })
watch(() => ({ category: currentInput.category, dates: currentInput.dates, pay: currentInput.pay } as WatchedInput), async(newVal, oldVal) => {
    if(local.isFirstLoad) return
    const keys = Object.keys(newVal) as (keyof WatchedInput)[]
    const isDatesChanged = JSON.stringify(newVal.dates) !== JSON.stringify(oldVal.dates)
    if(isDatesChanged){
        if(!local.hydratedSR){
            local.hydratedSR = true
        }else if(!local.hydratedER){
            local.hydratedER = true
        }
    }
    for(const key of keys){
        if(JSON.stringify(newVal[key]) !== JSON.stringify(oldVal[key])){
            if(debounceTimers[key]) clearTimeout(debounceTimers[key])
            const delay = key === "dates" ? 750 : 500
            debounceTimers[key] = setTimeout(async() => {
                await formSearchFilter()
                if(key === "category"){
                    oldInput.category = [...currentInput.category]
                }else if(key === "pay"){
                    oldInput.pay = currentInput.pay
                }else if(key === "dates"){
                    oldInput.dates = currentInput.dates
                }
                await nextTick()
            }, delay)
        }
    }
}, { deep: true })
const keyword = ref('')
const sanitizeQuery = <T extends FilterKey>(key: T, value: unknown): InputForm[T] | null => {
    const allowed = filterRules[key] as readonly string[]
    if(typeof value === "string"){
        return (allowed.includes(value) ? value : "") as InputForm[T]
    }
    if(Array.isArray(value)){
        const filtered = value.filter((v) => typeof v === "string" && allowed.includes(v))
        return (filtered as InputForm[T]) ?? null
    }
    return null
}
const sanitizeAllQuery = (rawQuery: Record<string, unknown>): InputForm => {
    const query = {
        search: rawQuery.find,
        category: Array.isArray(rawQuery.f_category) ? rawQuery.f_category : rawQuery.f_category ? [rawQuery.f_category] : [],
        pay: rawQuery.f_pay,
        start_date: rawQuery.f_sr_date,
        end_date: rawQuery.f_er_date,
    }
    const clean: any = {}
    if(!local.isFirstLoad){
        clean.search = Array.isArray(query.search) ? query.search[0] : (query.search as string) ?? ""
    }
    local.hydratedSR = "f_sr_date" in rawQuery
    local.hydratedER = "f_er_date" in rawQuery
    for(const key of Object.keys(filterRules) as FilterKey[]){
        if(key === "dates"){
            let start: Date | null = query.start_date ? new Date(query.start_date as string) : null
            let end: Date | null = query.end_date ? new Date(query.end_date as string) : null
            if(start && !end) end = start
            if(!start && end) start = new Date()
            if(!start && !end){
                start = new Date()
                end = new Date()
            }
            clean.dates = [start, end]
            continue
        }
        const value = query[key]
        clean[key] = sanitizeQuery(key, value) ?? (key === "category" ? [] : key === "pay" ? "" : null)
    }
    return clean as InputForm
}
const queryParamHandler = (inp: InputForm) => {
    const formatDate = (d: Date) => {
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, "0")
        const day = String(d.getDate()).padStart(2, "0")
        return `${y}-${m}-${day}`
    }
    const queryParams: Record<string, any> = {
        find: inp.search || null,
        f_category: Array.isArray(inp.category) && inp.category.length > 0 ? inp.category : null,
        f_pay: inp.pay || null,
        f_sr_date: local.hydratedSR && inp.dates?.[0] ? formatDate(inp.dates[0]) : null,
        f_er_date: local.hydratedER && inp.dates?.[1] ? formatDate(inp.dates[1]) : null,
    }
    const filteredParams: Record<string, any> = {}
    for(const key in queryParams){
        const value = queryParams[key]
        if(value) filteredParams[key] = value
    }
    return filteredParams
}
const APIComposables = async(path: string, inpSignal: AbortSignal, headers: Record<string, any> = {}) => {
    let retryCount = 0
    const APIReq = async(signal: AbortSignal) => {
        try{
            const encr = await encryptReq({})
            const res = (await(await axiosJson()).post(path, {
                uniqueid: encr.iv,
                cipher: encr.data,
                mac: encr.mac,
            }, { params: { ...(path != '/event-categories' ? route.query :  {}), _: Date.now() }, signal, headers: { 'X-Merseal': sessionStorage.merseal, ...headers }})).data
            if(signal.aborted){
                return { status: 'error', message: 'Request dibatalkan' }
            }
            const decRes = decryptRes(res.message, encr.iv)
            return { status: 'success', data: decRes }
        }catch(err: any){
            if(err.name === "CanceledError"){
                console.log("Request dibatalkan")
                return { status: 'error', message: 'Request dibatalkan' }
            }else if(err.response){
                let cusRedirect: string | null = null
                if(err.response.status === 404){
                    return { status:'error', message: 'not found', code: 404 }
                }
                if([419, 429].includes(err.response.status)){
                    if(retryCount <= 3){
                        retryCount++
                        await fetchCsrfToken()
                        return APIReq(signal)
                    }else{
                        retryCount = 0
                        console.log('Request failed')
                        // return toast
                        return { status: 'error', message: 'Request failed' }
                    }
                }
                if(err.response.status === 500){
                    console.log('500', err.response.data.message)
                    // return toast
                    return { status: 'error', message: err.response.data.message }
                }
                console.log('err response', err.response.data.message)
                // return toast
                return { status:'error', message: err.response.data.message, code: err.response.status, data: { redirect: cusRedirect }}
            }
            console.log('errror', err)
            // return toast
            return { status:'error', message: err }
        }finally{
            if(path === '/search'){
                await teleportTargetFn()
            }
        }
    }
    return APIReq(inpSignal)
}
onBeforeMount(async() => {
    const newQuery: Record<string, any> = {}
    if(route.query.find){
        newQuery.find = Array.isArray(route.query.find) ? route.query.find[0] : (route.query.find as string)
        oldInput.search = newQuery.find
        currentInput.search = newQuery.find
    }
    categoryHydrationController = new AbortController()
    const resCategories = await APIComposables('/event-categories', categoryHydrationController.signal)
    if(resCategories.status == 'error'){
        return console.log('error')
    }
    resCategories.data.forEach((item: any, i: number) => {
        if((item['event_group_name'] && item['event_group']) && ((item['event_group_name'] != '') && (item['event_group'] != ''))){
            itemsCategoryFilter.value = [...itemsCategoryFilter.value, { label: item['event_group_name'], value: item['event_group'] }]
            filterRules.category = [...filterRules.category, item['event_group']]
        }
    })
    // if(!route.query || Object.keys(route.query).length === 0){
    //     console.log('Tidak ada query parameter. Hentikan eksekusi.')
    //     local.isFirstLoad = false
    //     return
    // }
    const sanitized = sanitizeAllQuery(route.query)
    Object.assign(newQuery, { ...queryParamHandler(sanitized)} )
    const{ next_page } = route.query
    if(route.query.find && route.query.find != ''){
        newQuery.limit = 15
    }
    const hyHeader: Record<string, any> = {}
    if(next_page && typeof next_page === 'string'){
        const nextPageNumber = parseInt(next_page.replace(/\D/g, ''), 10)
        if(next_page.length <= 100 && !isNaN(nextPageNumber)){
            hyHeader['X-Pagination-From'] = 'first-time'
            newQuery.next_page = next_page
        }
    }
    router.replace({ path: '/search', query: newQuery }).catch(() => {})
    // if(Object.keys(newQuery).length > 0){
    //     router.replace({ path: '/search', query: newQuery }).catch(() => {})
    // }
    // if(Object.keys(newQuery).length === 0){
    //     console.log("Tidak ada query parameter. Hentikan eksekusi.")
    //     return
    // }
    if(Object.keys(newQuery).length > 0){
        Object.assign(oldInput, {
            ...sanitized,
            category: sanitized.category ? [...sanitized.category] : []
        })
        Object.assign(currentInput, {
            ...sanitized,
            category: sanitized.category ? [...sanitized.category] : []
        })
    }
    abortHydrationController = new AbortController()
    const res = await APIComposables('/search', abortHydrationController.signal, hyHeader)
    if(res.status == 'error'){
        return console.log('error', res.message)
    }
    console.log('enttokk dataa ', res.data)
    local.fetchData = res.data.data
    local.total_items = res.data.total_items
    local.next_cursor = res.data.next_cursor
    local.has_more = res.data.has_more
    await nextTick()
    local.isFirstLoad = false
})
const formSearchFilter = async() => {
    if(abortFormController) abortFormController.abort()
    let isUpdated = false
    const isEqual = (a: unknown, b: unknown): boolean => {
        const rawA = toRaw(a)
        const rawB = toRaw(b)
        if(Array.isArray(rawA) && Array.isArray(rawB)){
            if(rawA.length !== rawB.length) return false
            if (rawA.every(v => v instanceof Date) && rawB.every(v => v instanceof Date)) {
                return rawA.every((v, i) => v.getTime() === rawB[i].getTime())
            }
            return rawA.every((val, idx) => val === rawB[idx])
        }
        return rawA === rawB
    }
    for(const key of Object.keys(oldInput) as (keyof typeof oldInput)[]){
        if(!isEqual(oldInput[key], currentInput[key])){
            isUpdated = true
            break
        }
    }
    if(!isUpdated) return
    local.total_items = 0
    abortFormController = new AbortController()
    const newQuery = queryParamHandler(currentInput)
    if(currentInput.search != ''){
        newQuery.limit = 15
    }
    router.push({ path: '/search', query: newQuery })
    local.isFormLoading = true
    oldInput.search = currentInput.search
    const res = await APIComposables('/search', abortFormController.signal)
    local.isFormLoading = false
    keyword.value = currentInput.search
    if(res.status == 'error'){
        return console.log('error', res.message)
    }
    console.log('form res',res.data)
    local.fetchData = res.data.data
    local.total_items = res.data.total_items
    local.has_more = res.data.has_more
    local.next_cursor = res.data.next_cursor
}
const lazyDataSearch = async() => {
    if(!local.has_more) return
    await router.replace({ path:'/search', query: { ...route.query, 'next_page': local.next_cursor,'limit': 15 }})
    abortHydrationController = new AbortController()
    const res = await APIComposables(route.path, abortHydrationController.signal)
    if(res.status == 'error'){
        return console.log('error lazy')
    }
    console.log('lazyy res',res.data.data)
    local.fetchData.push(...res.data.data)
    local.next_cursor = res.data.next_cursor
    local.has_more = res.data.has_more
}
const metaDataSearch = {
    wrapper: (inpData: any) => defineComponent({
        setup(){
            const slots = useSlots()
            return () => {
                return h(RouterLink, { to: inpData.event_id, class: 'relative' }, {
                    default: () => slots.default ? slots.default() : null
                })
            }
        }
    }),
    customTWGrand: 'flex-1',
    customTWTransition: 'grid grid-cols-1 phone:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5',
    pagination: {
        customTWPaginator: '!mt-3 !sm:mt-4 lg:!mt-5',
        lazyLoading: true,
        preRenderPage: 1,
        item_id: 'event_id',
    },
    snapshots: {
        base: 5,
        md: 4,
        xl: 3,
    },
}
const metaDataLoading = {
    customTWTransition: 'flex-1 grid grid-cols-1 phone:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5',
    snapshots: {
        base: 5,    
        md: 4,
        xl: 3,
    },
}
</script>
<template>
    <Teleport v-if="teleportTarget" :to="teleportTarget" defer>
        <FormField class="flex flex-col" :class="{ 'pointer-events-none': local.isFirstLoad }">
            <label>Pilih Kategori</label>
            <CheckboxGroup name="ingredient" class="flex flex-col gap-4" v-model:model-value="currentInput.category">
                <div v-for="(item, index) in itemsCategoryFilter" :key="item.value" class="flex items-center gap-2">
                    <Checkbox :inputId="'cat' + index" :value="item.value"/>
                    <label :for="'cat' + index">{{ item.label }}</label>
                </div>
            </CheckboxGroup>
        </FormField>
        <FormField class="flex flex-col" :class="{ 'pointer-events-none': local.isFirstLoad }">
            <label class="ml-1">Pilih Rentang Tanggal</label>
            <DatePicker v-model="currentInput.dates" selectionMode="range" dateFormat="dd/mm/yy"/>
        </FormField>
        <FormField class="flex flex-col" :class="{ 'pointer-events-none': local.isFirstLoad }">
            <label class="ml-1">Free ?</label>
            <Select v-model:model-value="currentInput.pay" :options="itemsPaysFilter" optionLabel="name" optionValue="value" placeholder="Select event fee" class="w-full"/>
        </FormField>
    </Teleport>
    <img src="@/assets/images/cele-3.png" alt="" class="absolute bottom-0 md:-bottom-5 -right-13 sm:-right-23 md:-right-32 lg:-right-35 xl:-right-35 2xl:-right-37 h-57 xs:h-62 phone:h-65 sm:h-90 md:h-130 lg:h-132 xl:h-137 2xl:h-145 -z-1 object-contain opacity-30 scale-300 sm:scale-270 md:scale-250"/>
    <section class="relative pb-5 sm:pb-7 md:pb-10 lg:pb-12 flex flex-col">
        <div class="w-[93%] phone:w-[96%] md:w-[97%] xl:w-[98%] mx-auto flex flex-col">
            <div class="relative">
                <div class="flex items-center justify-end sm:justify-between">
                    <h2 class="!m-0 w-fit hidden sm:block text-4xl">Search Events</h2>
                    <div class="flex-1 phone:flex-initial flex gap-2 lg:gap-3">
                        <InputText id="email" type="email" class="flex-1 sm:flex-initial sm:w-55 md:w-60 lg:w-[calc(0.25rem*65)] xl:w-70" :class="{ 'pointer-events-none': local.isFirstLoad }" placeholder="Cari Event" v-model="currentInput.search" @keyup.enter="formSearchFilter()"/>
                        <Button class="!px-1.75 rounded-md" @click="formSearchFilter()">Search</Button>
                        <Button v-if="isMobile || isTablet" class="!px-1.75 rounded-md" :class="{ 'pointer-events-none': (displayMode != 'loading' && oldInput.search == '') || displayMode == 'empty' }" @click="isDialogOpen = true">Filters</Button>
                    </div>
                </div>
                <p class="!m-0" v-if="(displayMode == 'initial' || displayMode == 'loading' || displayMode == 'success') && oldInput.search != ''">
                    <template v-if="displayMode == 'initial' || displayMode == 'loading'">
                        Sedang mencari event "{{ oldInput.search }}"...
                    </template>
                    <template v-else-if="displayMode == 'success'">
                        Menampilkan Event "{{ oldInput.search }}" menemukan {{ local.total_items }}
                    </template>
                </p>
            </div>
            <div class="flex gap-3 mt-1 lg:mt-2 xl:mt-3">
                <Transition name="sidefilter" appear>
                    <Form v-if="isDesktop" v-show="displayMode == 'initial' || displayMode == 'loading' || displayMode == 'success'" :ref="el => SideFilterRef =  (el as ComponentPublicInstance)?.$el" class="sticky w-70 h-fit rounded-xl flex flex-col gap-2 pt-3 pb-5 pl-5 pr-5" style="background-color: #fff; box-shadow: 0px 18px 47px 0px rgba(0, 0, 0, 0.1); top: calc(var(--paddTop) + 10px);"/>
                </Transition>
                <CustomCardWithSkeletonComponent v-show="displayMode == 'success'" :metaData="metaDataSearch" :inpData="local.fetchData" :paralelRender="4" @lazy-data="lazyDataSearch">
                    <template #skeleton="{ index, skeletonRefs }">
                        <div :ref="el => skeletonRefs[index] = el" class="skeleton-wrapper absolute z-10 left-0 w-full h-full flex flex-col items-center transition-opacity duration-100 pointer-events-none">
                            <Skeleton :pt="{ root: { class: ['!w-[103%] sm:!w-[102.5%] !h-[123px] phone:!h-[172px] lg:!h-[200px] !rounded-lg relative -left-[0.25%] -top-[1%]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                            <div class="w-full p-3.75 lg:p-4.75 xl:px-6.75 xl:py-4.75 mx-auto flex flex-col">
                                <Skeleton :pt="{ root: { class: ['!h-[13px] sm:!h-[16.75px] lg:!h-[17px] xl:!h-[18px] 2xl:!h-[20px] !rounded-[3px] sm:!rounded-[4px] lg:!rounded-[5px]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                                <Skeleton :pt="{ root: { class: ['!h-[13px] sm:!h-[16.75px] lg:!h-[17px] xl:!h-[18px] 2xl:!h-[20px] mt-1 lg:mt-1.5 !rounded-[3px] sm:!rounded-[4px] lg:!rounded-[5px]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                                <Skeleton :pt="{ root: { class: ['!w-[92px] xs:!w-[92px] phone:!w-[110px] sm:!w-[112px] lg:!w-[127px] xl:!w-[157px] 2xl:!w-[160px] !h-[14px] sm:!h-[15.5px] lg:!h-[18px] xl:!h-[18px] 2xl:!h-[20px] mt-1.5 sm:mt-1 lg:mt-2 !rounded-[3px] sm:!rounded-[4px] lg:!rounded-[5px]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                            </div>
                        </div>
                    </template>
                    <template #card="{ index, inpData, toggleSkeleton, cardRefs }">
                        <Card :ref="el => cardRefs[index] =  (el as ComponentPublicInstance)?.$el" :pt="{ root: { class: ['!h-full rounded-md lg:rounded-[20px] overflow-hidden opacity-0 transition-opacity duration-100'], style: 'box-shadow: 0px 18px 47px 0px rgba(0, 0, 0, 0.1);' }, body: { class: ['!p-4 lg:!p-5 xl:!px-7 xl:!py-5'] }}">
                            <template #header>
                                <img :src="getImgURL(inpData.img)" alt="" class="w-full h-[120px] phone:h-[170px] lg:h-[197px] object-cover" :ref="((el: any) => {
                                        if(el?.complete && el.naturalWidth !== 0 && !inpData.imgLoad) toggleSkeleton(index)
                                    })" 
                                    @load="() => {
                                        inpData.imgLoad = true
                                        toggleSkeleton(index)
                                    }" @error="() => toggleSkeleton(index)"/>
                                <img :src="freeTag" alt="" class="absolute -top-0.5 -right-0.5 z-9 h-[17%] lg:h-[20%]">
                            </template>
                            <template #content>
                                <div class="flex flex-col gap-0">
                                    <RouterLink :to="'/event/' + inpData.event_id" class="min-h-[3em] text-sm sm:text-base lg:text-lg xl:text-xl font:medium line-clamp-2 leading-snug">{{ inpData.event_name }}</RouterLink>
                                    <span class="text-xs sm:text-sm lg:text-base xl:text-lg">{{ inpData.start_date }}</span>
                                </div>
                            </template>
                        </Card>
                    </template>
                </CustomCardWithSkeletonComponent>
                <CustomCardWithSkeletonComponent v-show="local.isFormLoading || local.isFirstLoad" :metaData="metaDataLoading" :paralelRender="Infinity" :isLoading="true">
                    <div class="skeleton-wrapper flex flex-col items-center">
                        <Skeleton :pt="{ root: { class: ['!w-[103%] sm:!w-[102.5%] !h-[123px] phone:!h-[172px] lg:!h-[200px] !rounded-lg relative -left-[0.25%] -top-[1%]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                        <div class="w-full p-3.75 lg:p-4.75 xl:px-6.75 xl:py-4.75 mx-auto flex flex-col">
                            <Skeleton :pt="{ root: { class: ['!h-[13px] sm:!h-[16.75px] lg:!h-[17px] xl:!h-[18px] 2xl:!h-[20px] !rounded-[3px] sm:!rounded-[4px] lg:!rounded-[5px]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                            <Skeleton :pt="{ root: { class: ['!h-[13px] sm:!h-[16.75px] lg:!h-[17px] xl:!h-[18px] 2xl:!h-[20px] mt-1 lg:mt-1.5 !rounded-[3px] sm:!rounded-[4px] lg:!rounded-[5px]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                            <Skeleton :pt="{ root: { class: ['!w-[92px] xs:!w-[92px] phone:!w-[110px] sm:!w-[112px] lg:!w-[127px] xl:!w-[157px] 2xl:!w-[160px] !h-[14px] sm:!h-[15.5px] lg:!h-[18px] xl:!h-[18px] 2xl:!h-[20px] mt-1.5 sm:mt-1 lg:mt-2 !rounded-[3px] sm:!rounded-[4px] lg:!rounded-[5px]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                        </div>
                    </div>
                </CustomCardWithSkeletonComponent>
                <div v-show="displayMode == 'empty'" class="flex-1 flex flex-col">
                    <div class="lg:w-[75%] xl:w-[65%] 2xlw-[60%] flex flex-col lg:flex-row justify-between items-center mx-auto my-auto gap-2.5 sm:gap-3 md:gap-5 lg:gap-0">
                        <img src="@/assets/images/notfound.png" alt="" class="w-[67%] xs:w-[57%] sm:w-[65%] md:w-[77%] lg:w-[65%] xl:w-[58%] 2xl:w-[55%] object-cover"/>
                        <h3 class="!m-0 !text-xl phone:!text-2xl sm:!text-3xl md:!text-4xl lg:!text-5xl 2xl:!text-6xl !text-center !text-red-500">Event Tidak Ditemukan</h3>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <Dialog v-model:visible="isDialogOpen" class="w-[70%] xs:w-[230px] phone:w-[300px]" header="Filter Details" pt:mask:class="backdrop-blur-sm" modal dismissableMask>
        <Form :ref="el => DialogContentRef =  (el as ComponentPublicInstance)?.$el" class="flex flex-col gap-3"/>
        <template #footer>
            <Button label="Close" icon="pi pi-times" text @click="isDialogOpen = false" />
        </template>
    </Dialog>
</template>
<style scoped>
.sidefilter-enter-active {
    transition: transform 0.3s ease;
}
.sidefilter-enter-from {
    transform: translateX(-100%);
}
.sidefilter-enter-to {
    transform: translateX(0);
}
.sidefilter-leave-active {
    transition: none !important;
}
.sidefilter-leave-from,
.sidefilter-leave-to {
    transform: translateX(0);
}
</style>