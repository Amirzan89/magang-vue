<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref, reactive, computed, watch, onBeforeMount, onMounted, h, useSlots, defineComponent, nextTick, Teleport, type Ref, type ComponentPublicInstance } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { formatTgl } from "@/utils/global"
import useAxios from '@/composables/api/axios'
import useEncryption from '@/composables/encryption'
import { width, isMobile, isDesktop } from '@/composables/useScreenSize'
import { useFetchDataStore } from '@/stores/FetchData'
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
const fetchDataS = useFetchDataStore()
const SideFilterRef = ref(null)
const DialogContentRef = ref(null)
const local = reactive({
    fetchData: [] as any,
    past_events: null as any,
    reviews: null as any,
    isLoading: false,
})
const filterRules = {
    pay: ["pay", "free", "all"] as const,
    category: ["tech", "design", "games", "olahraga", "seni"] as const,
} as const
type FilterKey = keyof typeof filterRules
type FilterValues = {
    [K in FilterKey]: K extends "category" ? (typeof filterRules[K][number])[] : typeof filterRules[K][number] | ""
}
type InputForm = FilterValues & {
    search: string
}
const itemsCategoryFilter = [
    { label: 'Tech', value: 'tech' },
    { label: 'Design', value: 'design' },
    { label: 'Games', value: 'games' },
    { label: 'Olahraga', value: 'olahraga' },
    { label: 'Seni', value: 'seni' },
]
const oldInput = reactive<InputForm>({
    search: '',
    // popular: '' as any,
    // university: '',
    category: [],
    pay: '' as 'pay' | 'free' | 'all',
})
const currentInput = reactive<InputForm>({
    search: '',
    // popular: '' as any,
    // university: '',
    category: [],
    pay: '' as 'pay' | 'free' | 'all',
})
const isDialogOpen = ref(false)
const teleportTarget = ref(null)
watch([isDialogOpen, isDesktop], async () => {
    await nextTick()
    if(isDesktop.value){
        teleportTarget.value = SideFilterRef.value
    }else if(isMobile.value && isDialogOpen.value){
        teleportTarget.value = DialogContentRef.value
    }else{
        teleportTarget.value = null
    }
}, { immediate: true })
let abortFormController: AbortController | null = null
let debounceTimer: ReturnType<typeof setTimeout> | null = null
watch(() => currentInput.category, () => {
    if(debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(async () => {
        await formSearchFilter()
    }, 500)
}, { deep: true })
const keyword = ref('')
const inpTanggal = ref({
    start: undefined,
    end: undefined,
}) as Ref<DateRange>
const sanitizeQuery = <T extends FilterKey>(key: T, value: unknown): InputForm[T] | null => {
    const allowed = filterRules[key] as readonly string[]
    if(typeof value === "string"){
        return (allowed.includes(value) ? [value] : []) as InputForm[T]
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
        pay: rawQuery.f_pay
    }
    const clean: any = {}
    clean.search = Array.isArray(query.search) ? query.search[0] : (query.search as string) ?? ""
    for(const key of Object.keys(filterRules) as FilterKey[]){
        const value = query[key]
        clean[key] = sanitizeQuery(key, value) ?? (key === "category" ? [] : "")
    }
    return clean as InputForm
}
const queryParamHandler = (inp: Record<string, any>) => {
    const queryParams: Record<string, any> = {
        find: inp.search || null,
        f_category: Array.isArray(inp.category) && inp.category.length > 0 ? inp.category : null,
        f_pay: inp.pay || null,
        f_sr_date: inpTanggal.value.start ? inpTanggal.value.start.toString() : null,
        f_er_date: inpTanggal.value.end ? inpTanggal.value.end.toString() : null,
    }
    const filteredParams: Record<string, any> = {}
    for(const key in queryParams){
        const value = queryParams[key]
        if(value){
            filteredParams[key] = value
        }
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
    const res = await fetchDataS.fetchPage(route.path, newQuery, {})
    if(res ==  undefined || res.status == 'error'){
        return
    }
    local.fetchData = res.data
})
const locale = ref("en-US")
const formatter = useDateFormatter(locale.value)
const RTPlaceholder = ref(today("Asia/Jakarta")) as Ref<DateValue>
const secondMonthPlaceholder = ref(today("Asia/Jakarta").add({ months: 1 })) as Ref<DateValue>
const firstMonth = ref(
    createMonth({
        dateObj: RTPlaceholder.value,
        locale: locale.value,
        fixedWeeks: true,
        weekStartsOn: 0,
    }),
) as Ref<Grid<DateValue>>
const secondMonth = ref(
    createMonth({
        dateObj: secondMonthPlaceholder.value,
        locale: locale.value,
        fixedWeeks: true,
        weekStartsOn: 0,
    }),
) as Ref<Grid<DateValue>>
const updateMonth = (reference: "first" | "second", months: number) => {
    if(reference === "first"){
        RTPlaceholder.value = RTPlaceholder.value.add({ months })
    }
    else {
        secondMonthPlaceholder.value = secondMonthPlaceholder.value.add({
        months,
        })
    }
}
watch(RTPlaceholder, (_placeholder) => {
    firstMonth.value = createMonth({
        dateObj: _placeholder,
        weekStartsOn: 0,
        fixedWeeks: false,
        locale: locale.value,
    })
    if(isEqualMonth(secondMonthPlaceholder.value, _placeholder)){
        secondMonthPlaceholder.value = secondMonthPlaceholder.value.add({ months: 1 })
    }
})
watch(secondMonthPlaceholder, (_secondMonthPlaceholder) => {
    secondMonth.value = createMonth({
        dateObj: _secondMonthPlaceholder,
        weekStartsOn: 0,
        fixedWeeks: false,
        locale: locale.value,
    })
    if (isEqualMonth(_secondMonthPlaceholder, RTPlaceholder.value)) RTPlaceholder.value = RTPlaceholder.value.subtract({ months: 1 })
})
const formSearchFilter = async() => {
    if(abortFormController) abortFormController.abort()
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
    customTWTransition: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 lg:gap-4',
}
watch(width, () => {
    if(!isMobile.value && isDialogOpen.value){
        isDialogOpen.value = false
    }
})
</script>
<template>
    <Teleport v-if="teleportTarget" :to="teleportTarget" defer>
        <!-- <div>
            <Label>Pilih Populer</Label>
            <Select v-model="currentInput.popular" @update:model-value="formSearchFilter()">
                <SelectTrigger class="w-[180px]">
                    <SelectValue RTPlaceholder="Select a Popularity" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="/">None</SelectItem>
                        <SelectItem value="banana">Populer</SelectItem>
                        <SelectItem value="blueberry">Blueberry</SelectItem>
                        <SelectItem value="grapes">Grapes</SelectItem>
                        <SelectItem value="pineapple">Pineapple</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div> -->
        <!-- <div>
            <Label>Pilih Kategori</Label>
            <Select v-model="currentInput.category" @update:model-value="formSearchFilter()">
                <SelectTrigger class="w-[180px]">
                    <SelectValue RTPlaceholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>None</SelectLabel>
                        <SelectItem value="apple">Seni</SelectItem>
                        <SelectItem value="banana">Budaya</SelectItem>
                        <SelectItem value="blueberry">Agama</SelectItem>
                        <SelectItem value="grapes">Olahraga</SelectItem>
                        <SelectItem value="pineapple">Games</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div> -->
        <div>
            <Label>Pilih Kategori</Label>
            <CheckboxGroupRoot v-model="currentInput.category" class="flex flex-col gap-2.5">
                <div v-for="(item, index) in itemsCategoryFilter" :key="item.value" class="flex items-center gap-3">
                    <CheckboxRoot :id="`cat-${index}`" :value="item.value" class="shadow-blackA7 hover:bg-green3 flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-md bg-white shadow-[0_2px_10px] outline-none focus-within:shadow-[0_0_0_2px_black]">
                        <CheckboxIndicator class="bg-white h-full w-full rounded flex items-center justify-center">
                        <Icon icon="radix-icons:check" class="h-5 w-5 text-grass11"/>
                        </CheckboxIndicator>
                    </CheckboxRoot>
                    <label :for="`cat-${index}`" class="flex flex-row gap-4 items-center">
                        <span class="select-none dark:text-white">{{ item.label }}</span>
                    </label>
                </div>
            </CheckboxGroupRoot>
        </div>
        <div>
            <Label>Pilih Rentang Tanggal</Label>
            <Popover>
                <PopoverTrigger class="cursor-pointer" as-child>
                    <Button variant="outline" :class="cn('w-fit pl-2 pr-2 justify-start text-left font-normal', !inpTanggal && 'text-muted-foreground')">
                        <Calendar class="mr-2 h-4 w-4" />
                        <template v-if="inpTanggal.start">
                            <template v-if="inpTanggal.end">{{ formatTgl(toDate(inpTanggal.start)) }} - {{ formatTgl(toDate(inpTanggal.end)) }}</template>
                            <template v-else>{{ formatTgl(toDate(inpTanggal.start)) }}</template>
                        </template>
                        <template v-else>Pick a date</template>
                    </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0">
                    <RangeCalendarRoot v-slot="{ weekDays }" v-model="inpTanggal" v-model:RTPlaceholder="RTPlaceholder" @update:modelValue="formSearchFilter()" class="p-3">
                        <div class="flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
                            <div class="flex flex-col gap-4">
                                <div class="flex items-center justify-between">
                                <!-- <button :class="cn(buttonVariants({ variant: 'outline' }), 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',)" @click="updateMonth('first', -1)">
                                    <ChevronLeft class="h-4 w-4" />
                                </button>
                                <div :class="cn('text-sm font-medium')"> {{ formatter.fullMonthAndYear(toDate(firstMonth.value))}}</div>
                                <button :class="cn(buttonVariants({ variant: 'outline' }),'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',)" @click="updateMonth('first', 1)">
                                    <ChevronRight class="h-4 w-4" />
                                </button> -->
                                </div>
                                <RangeCalendarGrid>
                                    <RangeCalendarGridHead>
                                        <RangeCalendarGridRow>
                                            <RangeCalendarHeadCell v-for="day in weekDays" :key="day" class="w-full">{{ day }}</RangeCalendarHeadCell>
                                        </RangeCalendarGridRow>
                                    </RangeCalendarGridHead>
                                    <RangeCalendarGridBody>
                                        <RangeCalendarGridRow v-for="(weekDates, index) in firstMonth.rows" :key="`weekDate-${index}`" class="mt-2 w-full">
                                            <RangeCalendarCell v-for="weekDate in weekDates" :key="weekDate.toString()" :date="weekDate">
                                                <RangeCalendarCellTrigger :day="weekDate" :month="firstMonth.value"/>
                                            </RangeCalendarCell>
                                        </RangeCalendarGridRow>
                                    </RangeCalendarGridBody>
                                </RangeCalendarGrid>
                            </div>
                            <div class="flex flex-col gap-4">
                                <div class="flex items-center justify-between">
                                    <button :class="cn(buttonVariants({ variant: 'outline' }), 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',)" @click="updateMonth('second', -1)">
                                        <ChevronLeft class="h-4 w-4" />
                                    </button>
                                    <div :class="cn('text-sm font-medium')">{{ formatter.fullMonthAndYear(toDate(secondMonth.value)) }}</div>
                                    <button :class="cn(buttonVariants({ variant: 'outline' }),'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',)" @click="updateMonth('second', 1)">
                                        <ChevronRight class="h-4 w-4" />
                                    </button>
                                </div>
                                <RangeCalendarGrid>
                                    <RangeCalendarGridHead>
                                        <RangeCalendarGridRow>
                                            <RangeCalendarHeadCell v-for="day in weekDays" :key="day" class="w-full">{{ day }}</RangeCalendarHeadCell>
                                        </RangeCalendarGridRow>
                                    </RangeCalendarGridHead>
                                    <RangeCalendarGridBody>
                                        <RangeCalendarGridRow v-for="(weekDates, index) in secondMonth.rows" :key="`weekDate-${index}`" class="mt-2 w-full">
                                            <RangeCalendarCell v-for="weekDate in weekDates" :key="weekDate.toString()" :date="weekDate">
                                                <RangeCalendarCellTrigger :day="weekDate" :month="secondMonth.value"/>
                                            </RangeCalendarCell>
                                        </RangeCalendarGridRow>
                                    </RangeCalendarGridBody>
                                </RangeCalendarGrid>
                            </div>
                        </div>
                    </RangeCalendarRoot>
                </PopoverContent>
            </Popover>
        </div>
        <div>
            <Label>free ?</Label>
            <Select v-model="currentInput.pay" @update:model-value="formSearchFilter()">
                <SelectTrigger class="w-[180px]">
                    <SelectValue RTPlaceholder="Select a Popularity" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="/">None</SelectItem>
                        <SelectItem value="free">free</SelectItem>
                        <SelectItem value="all">all</SelectItem>
                        <SelectItem value="pay">bayar</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    </Teleport>
    <section class="relative flex flex-col">
        <Dialog  v-model:open="isDialogOpen">
            <DialogTrigger v-if="isMobile && local.fetchData.length > 0">Filters</DialogTrigger>
            <div class="w-[97%] mx-auto mt-7">
                <div class="relative flex items-center justify-between">
                    <h2 class="w-fit text-4xl">Search Events</h2>
                    <div class="flex gap-5">
                        <Input id="email" type="email" class="w-50" placeholder="Cari Event" v-model="currentInput.search" @keyup.enter="formSearchFilter()"/>
                        <Button @click="formSearchFilter()">Search</Button>
                    </div>
                </div>
                <div class="relative">
                    <p v-if="local.fetchData.length > 0">Menampilkan Event "{{ keyword }}" menemukan {{ local.fetchData.length }}</p>
                    <div class="relative flex gap-3">
                        <Transition name="sidefilter" appear>
                            <form v-if="isDesktop" ref="SideFilterRef" class="sticky w-110 h-full rounded-xl pt-3 pb-5 pl-5 pr-5" style="box-shadow: 0px 18px 47px 0px rgba(0, 0, 0, 0.1); top: calc(var(--paddTop) + 10px);"/>
                        </Transition>
                        <CustomCardWithSkeletonComponent :metaData="metaDataSearch" :inpData="local.fetchData" :paralelRender="Infinity">
                            <template #skeleton="{ index, skeletonRefs }">
                                <div :ref="el => skeletonRefs[index] = el" class="skeleton-wrapper absolute z-10 top-0 left-0 flex flex-col w-full h-full transition-opacity duration-100">
                                    <Skeleton class="w-full h-[65%] rounded-lg"/>
                                    <div class="w-[97%] mt-1.5 mx-auto">
                                        <Skeleton class="w-full h-6 rounded-sm"/>
                                        <Skeleton class="w-full h-6 mt-1.5 rounded-md"/>
                                        <Skeleton class="w-full h-11 mt-2 rounded-lg"/>
                                    </div>
                                </div>
                            </template>
                            <template #card="{ index, inpData, toggleSkeleton, cardRefs }">
                                <Card :ref="el => cardRefs[index] =  (el as ComponentPublicInstance)?.$el" class="h-full pt-0 pb-0 rounded-md lg:rounded-[20px] overflow-hidden opacity-0 transition-opacity duration-100" style="box-shadow: 0px 18px 47px 0px rgba(0, 0, 0, 0.1);">
                                    <CardContent class="relative pl-0 pr-0 h-full">
                                        <img :src="getImgURL(inpData.img)" alt="" class="w-full h-[64%] lg:object-cover" :ref="((el: any) => {
                                                if(el?.complete && el.naturalWidth !== 0 && !inpData.imgLoad) toggleSkeleton(index)
                                            })"
                                            @load="() => {
                                                inpData.imgLoad = true
                                                toggleSkeleton(index)
                                        }" @error="() => toggleSkeleton(index)"/>
                                        <img :src="freeTag" alt="" class="absolute -top-[2%] -right-[2%] z-9 h-[20%] 2xl:h-[15%]">
                                        <div class="w-[87%] mx-auto flex flex-col mt-2">
                                            <div class="flex flex-col text-black">
                                                <!-- <div class="flex flex-col">
                                                    <span class="text-[#3D37F1] font-bold text-base">May</span>
                                                    <span class="text-black text-xl">11</span>
                                                </div> -->
                                                <RouterLink :to="'/events/' + inpData.event_id" class="text-base sm:text-lg font-medium">{{ inpData.event_name }}</RouterLink>
                                                <span class="text-sm sm:text-lg">{{ inpData.start_date }}</span>
                                            </div>
                                            <div class="flex justify-between items-center mt-3">
                                                <a :href="inpData.link_lokasi" target="_blank" rel="noopener noreferrer"><I_Location class="w-5 h-5 sm:w-8 sm:h-8 text-black"/></a>
                                                <span class="text-base">{{ inpData.nama_lokasi }}</span>
                                                <I_Bookmark class="w-5 h-5 sm:w-8 sm:h-8 text-black" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </template>
                        </CustomCardWithSkeletonComponent>
                    </div>
                </div>
            </div>
            <DialogContent class="duration-200">
                <form ref="DialogContentRef"/>
                <VisuallyHidden>
                    <DialogHeader>
                        <DialogTitle>Edit Filters</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>Make changes to your filters here. Click save when you're done.</DialogDescription>
                </VisuallyHidden>
            </DialogContent>
        </Dialog>
    </section>
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