<script setup lang="ts">
import { Form, FormField } from '@primevue/forms'
import { ref, reactive, computed, watch, onBeforeMount, onMounted, h, useSlots, defineComponent, nextTick, Teleport, type Ref, type ComponentPublicInstance } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { formatTgl } from "@/utils/global"
import useAxios from '@/composables/api/axios'
import useEncryption from '@/composables/encryption'
import { width, isMobile, isDesktop } from '@/composables/useScreenSize'
import { getImgURL } from '@/utils/global'
import CustomCardWithSkeletonComponent from '@/components/CustomCardWithSkeleton.vue'
import I_DRight from '@/assets/icons/card_events/double-right.svg?component'
import I_Location from '@/assets/icons/card_events/location.svg?component'
import I_Bookmark from '@/assets/icons/card_events/bookmark.svg?component'
import freeTag from '@/assets/images/free-tag.png';
import router from '@/router'
const route = useRoute()
const { axiosJson, fetchCsrfToken } = useAxios()
const { encryptReq, decryptRes } = useEncryption()
const SideFilterRef = ref(null)
const DialogContentRef = ref(null)
const local = reactive({
    fetchData: [] as any,
    past_events: null as any,
    reviews: null as any,
    isLoading: false,
    isFirstLoad: true,
})
// const itemsPopularFilter = ref([
//     { name: 'None', value: '' },
//     { name: 'Free', value: 'free' },
//     { name: 'All', value: 'all' },
//     { name: 'Pay', value: 'pay' },
// ])
const itemsCategoryFilter = [
    { label: 'Tech', value: 'tech' },
    { label: 'Design', value: 'design' },
    { label: 'Games', value: 'games' },
    { label: 'Olahraga', value: 'olahraga' },
    { label: 'Seni', value: 'seni' },
]
const itemsPaysFilter = ref([
    { name: 'Free', value: 'free' },
    { name: 'All', value: 'all' },
    { name: 'Pay', value: 'pay' },
])
const filterRules = {
    pay: ["pay", "free", "all"] as const,
    category: ["tech", "design", "games", "olahraga", "seni"] as const,
    dates: null as Date[] | null,
} as const
type FilterKey = keyof typeof filterRules
type FilterValues = {
    [K in FilterKey]:
        K extends "category" ? (typeof filterRules[K][number])[]
        : K extends "pay" ? typeof filterRules[K][number] | ""
        : K extends "dates" ? Date[] | null
        : never
}
type InputForm = FilterValues & {
    search: string
}
const oldInput = reactive<InputForm>({
    search: '',
    // popular: '' as any,
    // university: '',
    category: [],
    pay: '' as 'pay' | 'free' | 'all',
    dates: null,
})
const currentInput = reactive<InputForm>({
    search: '',
    // popular: '' as any,
    // university: '',
    category: [],
    pay: '' as 'pay' | 'free' | 'all',
    dates: null,
})
const isDialogOpen = ref(false)
const teleportTarget = ref(null)
let abortFormController: AbortController | null = null
let debounceTimer: ReturnType<typeof setTimeout> | null = null
watch(width, () => {
    if(!isMobile.value && isDialogOpen.value){
        isDialogOpen.value = false
    }
})
const teleportTargetFn = async() => {
    await nextTick()
    if(isDesktop.value){
        teleportTarget.value = SideFilterRef.value
    }else if(isMobile.value && isDialogOpen.value){
        teleportTarget.value = DialogContentRef.value
    }else{
        teleportTarget.value = null
    }
    console.log('targett ', teleportTarget.value)
}
watch([isDialogOpen, isDesktop], teleportTargetFn, { immediate: true })
watch(() => currentInput, async (newVal, oldVal) => {
    if(local.isFirstLoad){
        local.isFirstLoad = false
        return
    }

    if(newVal.category !== oldVal.category){
        console.log("entok category", newVal.category)
        if(debounceTimer) clearTimeout(debounceTimer)
        debounceTimer = setTimeout(async () => {
            console.log("akuu1")
            await formSearchFilter()
        }, 500)
    }

    if(newVal.dates !== oldVal.dates){
        if(newVal.dates && newVal.dates.length === 2){
            const [d1, d2] = newVal.dates
            if (d1 && d2 && d1 > d2) {
                currentInput.dates = [d2, d1]
            }
        }
        if(debounceTimer) clearTimeout(debounceTimer)
        debounceTimer = setTimeout(async () => {
            await formSearchFilter()
        }, 750)
    }

    if(newVal.pay !== oldVal.pay){
        if(debounceTimer) clearTimeout(debounceTimer)
        debounceTimer = setTimeout(async() => {
            await formSearchFilter()
        }, 500)
    }
},{ deep: true })
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
        category: rawQuery.f_category,
        pay: rawQuery.f_pay,
        start_date: rawQuery.f_sr_date,
        end_date: rawQuery.f_er_date,
    }
    const clean: any = {}
    clean.search = Array.isArray(query.search) ? query.search[0] : (query.search as string) ?? ""
    for(const key of Object.keys(filterRules) as FilterKey[]){
        if(key === "dates"){
            const start = query.start_date ? new Date(query.start_date as string) : null
            const end = query.end_date ? new Date(query.end_date as string) : null
            clean.dates = start && end ? [start, end] : null
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
        f_sr_date: inp.dates?.[0] ? formatDate(inp.dates[0]) : null,
        f_er_date: inp.dates?.[1] ? formatDate(inp.dates[1]) : null,
    }
    const filteredParams: Record<string, any> = {}
    for(const key in queryParams){
        const value = queryParams[key]
        if(value) filteredParams[key] = value
    }
    return filteredParams
}
onBeforeMount(async() => {
    if(!route.query || Object.keys(route.query).length === 0){
        console.log('Tidak ada query parameter. Hentikan eksekusi.')
        return
    }
    const sanitized = sanitizeAllQuery(route.query)
    const newQuery = queryParamHandler(sanitized)
    if(Object.keys(newQuery).length > 0){
        router.replace({ query: newQuery }).catch(() => {})
    }
    if(Object.keys(newQuery).length === 0){
        console.log("Tidak ada query parameter. Hentikan eksekusi.")
        return
    }
    Object.assign(oldInput, {
        ...sanitized,
        category: sanitized.category ? [...sanitized.category] : []
    })
    Object.assign(currentInput, {
        ...sanitized,
        category: sanitized.category ? [...sanitized.category] : []
    })
    console.log('isiii')
    await formSearchFilter()
    local.isFirstLoad = false
    // await nextTick()
    // keyword.value = currentInput.search
})
const formSearchFilter = async() => {
    if(abortFormController) abortFormController.abort()
    if(!local.isFirstLoad){
        let isUpdated = false
        const isEqual = (a: unknown, b: unknown): boolean => {
            if(Array.isArray(a) && Array.isArray(b)){
                if(a.length !== b.length) return false
                return a.every((val, idx) => val === b[idx])
            }
            return a === b
        }
        for(const key of Object.keys(oldInput) as (keyof typeof oldInput)[]){
            if(!isEqual(oldInput[key], currentInput[key])){
                isUpdated = true
                break
            }
        }
        if(!isUpdated) return
    }
    console.log('laporaannn23232')
    abortFormController = new AbortController()
    let retryCount = 0
    const searchFilterAPI = async(signal: AbortSignal) => {
        local.isLoading = true
        try{
            router.push({
                query: queryParamHandler(currentInput)
            })
            const encr = await encryptReq({})
            const res = (await(await axiosJson()).post('/search', {
                uniqueid: encr.iv,
                cipher: encr.data,
                mac: encr.mac,
            }, { params: { ...route.query, _: Date.now() }, signal, headers: { 'X-Merseal': sessionStorage.merseal }})).data
            if(!signal.aborted){
                const decRes = decryptRes(res.data, encr.iv)
                console.log('desccc ress', decRes)
                local.fetchData = decRes
                keyword.value = currentInput.search
                oldInput.search = currentInput.search
                oldInput.category = [ ...currentInput.category ]
                oldInput.pay = currentInput.pay
                await nextTick()
            }
        }catch(err: any){
            if(err.name === "CanceledError"){
                console.log("Request dibatalkan")
                return
            }else if(err.response){
                let cusRedirect: string | null = null
                if(err.response.status === 404){
                    return { status:'error', message: 'not found', code: 404 }
                }
                if([419, 429].includes(err.response.status)){
                    if(retryCount <= 3){
                        retryCount++
                        await fetchCsrfToken()
                        return searchFilterAPI(signal)
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
            local.isLoading = false
            await teleportTargetFn()
        }
    }
    searchFilterAPI(abortFormController.signal)
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
    customTWTransition: 'flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 lg:gap-4',
}
const metaDataLoading = {
    customTWTransition: 'flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 grid-rows-[repeat(auto-fit,20rem)] gap-2 lg:gap-4',
}
</script>
<template>
    <Teleport v-if="teleportTarget" :to="teleportTarget" defer>
        <!-- <div>
            <label>Pilih Populer</label>
            <Select v-model:model-value="currentInput.popular" :options="itemsPopularFilter" optionLabel="name" placeholder="Select event popular" class="w-full md:w-56"/>
            itemsPopularFilter
        </div> -->
        <FormField class="flex flex-col">
            <label>Pilih Kategori</label>
            <CheckboxGroup name="ingredient" class="flex flex-col gap-4" v-model:model-value="currentInput.category">
                <div v-for="(item, index) in itemsCategoryFilter" :key="item.value" class="flex items-center gap-2">
                    <Checkbox :inputId="'cat' + index" :value="item.value" />
                    <label :for="'cat' + index">{{ item.label }}</label>
                </div>
            </CheckboxGroup>
        </FormField>
        <FormField class="flex flex-col">
            <label>Pilih Rentang Tanggal</label>
            <DatePicker v-model="currentInput.dates" selectionMode="range" dateFormat="dd/mm/yy"/>
        </FormField>
        <FormField class="flex flex-col">
            <label>free ?</label>
            <Select v-model:model-value="currentInput.pay" :options="itemsPaysFilter" optionLabel="name" optionValue="value" placeholder="Select event fee" class="w-full md:w-56"/>
        </FormField>
    </Teleport>
    <section class="relative min-h-screen flex flex-col overflow-x-hidden">
        <img src="@/assets/images/cele-3.png" alt="" class="absolute bottom-0 -right-[30%] w-[75%] h-[75%] -z-1 object-cover opacity-30" />
        <div class="w-[97%] mx-auto mt-7 flex flex-col">
            <div class="relative flex items-center justify-between">
                <h2 class="w-fit text-4xl">Search Events</h2>
                <div class="flex gap-2 lg:gap-3">
                    <InputText id="email" type="email" class="w-50" placeholder="Cari Event" v-model="currentInput.search" @keyup.enter="formSearchFilter()"/>
                    <Button @click="formSearchFilter()">Search</Button>
                    <Button v-if="isMobile" @click="isDialogOpen = true">Filters</Button>
                </div>
            </div>
            <div class="">
                <p>Menampilkan Event "{{ keyword }}" menemukan {{ local.fetchData.length }}</p>
                <div class="relative flex gap-3">
                    <Transition name="sidefilter" appear>
                        <Form v-if="isDesktop" :ref="el => SideFilterRef =  (el as ComponentPublicInstance)?.$el" class="sticky w-75 h-full rounded-xl flex flex-col gap-2 pt-3 pb-5 pl-5 pr-5" style="box-shadow: 0px 18px 47px 0px rgba(0, 0, 0, 0.1); top: calc(var(--paddTop) + 10px);"/>
                    </Transition>
                    <CustomCardWithSkeletonComponent v-if="local.fetchData.length > 0 && !local.isLoading" :metaData="metaDataSearch" :inpData="local.fetchData" :paralelRender="2">
                        <template #skeleton="{ index, skeletonRefs }">
                            <div :ref="el => skeletonRefs[index] = el" class="skeleton-wrapper absolute z-10 -top-[2%] left-0 w-full h-[102%] flex flex-col items-center transition-opacity duration-100">
                                <Skeleton :pt="{ root: { class: ['!w-[104%] !h-[57%] lg:h-[65%] !rounded-lg ]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                                <div class="w-[97%] mt-3.5 lg:mt-1.5 mx-auto">
                                    <Skeleton :pt="{ root: { class: ['!h-4 lg:h-6 !rounded-sm ]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                                    <Skeleton :pt="{ root: { class: ['!h-4 lg:h-6 mt-1 lg:mt-1.5 !rounded-md ]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                                    <Skeleton :pt="{ root: { class: ['!h-6.5 lg:h-11 mt-1.5 lg:mt-2 !rounded-lg ]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                                </div>
                            </div>
                        </template>
                        <template #card="{ index, inpData, toggleSkeleton, cardRefs }">
                            <Card :ref="el => cardRefs[index] =  (el as ComponentPublicInstance)?.$el" :pt="{ root: { class: ['h-full pt-0 pb-0 rounded-md lg:rounded-[20px] overflow-hidden opacity-0 transition-opacity duration-100'], style: 'box-shadow: 0px 18px 47px 0px rgba(0, 0, 0, 0.1);' }, body: { class: ['!gap-1'] }, caption: { class: ['!gap-0'] }, title: { class: ['!text-sm phone:text-base'] }, subtitle: { class: ['!text-xs'] }, footer: { class: 'flex justify-between items-center' }}">
                                <template #header>
                                    <img :src="getImgURL(inpData.img)" alt="" class="w-full h-[120px] phone:h-[170px] lg:h-[197px] object-cover" :ref="((el: any) => {
                                            if(el?.complete && el.naturalWidth !== 0 && !inpData.imgLoad) toggleSkeleton(index)
                                        })"
                                        @load="() => {
                                            inpData.imgLoad = true
                                            toggleSkeleton(index)
                                        }" @error="() => toggleSkeleton(index)"/>
                                    <img :src="freeTag" alt="" class="absolute -top-1 -right-1 z-9 h-[17%] lg:h-[20%]">
                                </template>
                                <template #title>{{ inpData.event_name }}</template>
                                <template #subtitle>{{ inpData.start_date }}</template>
                                <template #footer>
                                    <a :href="inpData.link_lokasi" target="_blank" rel="noopener noreferrer"><I_Location class="w-5 h-5 sm:w-8 sm:h-8 text-green-500"/></a>
                                    <span class="text-sm">{{ inpData.nama_lokasi }}</span>
                                    <I_Bookmark class="w-5 h-5 sm:w-8 sm:h-8 text-green-500"/>
                                </template>
                            </Card>
                        </template>
                    </CustomCardWithSkeletonComponent>
                    <div v-if="local.fetchData.length == 0 && !local.isLoading" class="flex-1">
                        <div class="w-[60%] flex justify-between items-center mx-auto">
                            <img src="@/assets/images/notfound.png" alt="" class="w-[40%] object-cover" />
                            <h3 class="text-5xl text-red-500">Event Tidak Ditemukan</h3>
                        </div>
                    </div>
                    <CustomCardWithSkeletonComponent v-show="local.isLoading" :metaData="metaDataLoading" :paralelRender="Infinity" :isLoading="true">
                        <div class="skeleton-wrapper flex-1 flex flex-col items-center">
                            <Skeleton :pt="{ root: { class: ['flex-1 !rounded-lg ]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                            <div class="w-[97%] mt-3.5 lg:mt-1.5 mx-auto">
                                <Skeleton :pt="{ root: { class: ['!h-4 lg:h-6 !rounded-sm ]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                                <Skeleton :pt="{ root: { class: ['!h-4 lg:h-6 mt-1 lg:mt-1.5 !rounded-md ]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                                <Skeleton :pt="{ root: { class: ['!h-6.5 lg:h-11 mt-1.5 lg:mt-2 !rounded-lg ]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                            </div>
                        </div>
                    </CustomCardWithSkeletonComponent>
                </div>
            </div>
        </div>
    </section>
    <Dialog v-model:visible="isDialogOpen" modal dismissableMask pt:mask:class="backdrop-blur-sm">
        <template #container>
            <Form :ref="el => DialogContentRef =  (el as ComponentPublicInstance)?.$el"/>
        </template>
    </Dialog>
</template>
<style scoped>
.sidefilter-enter-active,
.sidefilter-leave-active{
    transition: transform 0.3s ease;
}
.sidefilter-enter-from,
.sidefilter-leave-to{
    transform: translateX(-100%);
}
.sidefilter-enter-to,
.sidefilter-leave-from{
    transform: translateX(0);
}
</style>