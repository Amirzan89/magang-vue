<script setup lang="ts">
import { ref, reactive, computed, watch, onBeforeMount, h, useSlots, defineComponent, Fragment, inject, Teleport, type Ref, type VNodeRef, type ComputedRef } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { RangeCalendarRoot, useDateFormatter, Viewport, VisuallyHidden, type DateRange } from "reka-ui"
import { Calendar, ChevronLeft, ChevronRight} from "lucide-vue-next"
import { createMonth, toDate, type Grid } from "reka-ui/date"
import { CalendarDate, getLocalTimeZone, isEqualMonth, today, type DateValue } from "@internationalized/date"
import { cn } from "@/utils/shadcn-vue"
import { formatTgl } from "@/utils/global"
import { useConfig } from '@/composables/useConfig'
import useAxios from '@/composables/api/axios'
import useEncryption from '@/composables/encryption'
import { useFetchDataStore } from '@/stores/FetchData'
import { Card, CardContent } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import Input from '@/components/ui/input/Input.vue'
import Dialog from '@/components/ui/dialog/Dialog.vue'
import DialogTrigger from '@/components/ui/dialog/DialogTrigger.vue'
import DialogContent from '@/components/ui/dialog/DialogContent.vue'
import DialogHeader from '@/components/ui/dialog/DialogHeader.vue'
import DialogTitle from '@/components/ui/dialog/DialogTitle.vue'
import DialogDescription from '@/components/ui/dialog/DialogDescription.vue'
import Label from "@/components/ui/label/Label.vue"
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectValue } from '@/components/ui/select'
import Popover from '@/components/ui/popover/Popover.vue'
import PopoverTrigger from '@/components/ui/popover/PopoverTrigger.vue'
import PopoverContent from '@/components/ui/popover/PopoverContent.vue'
import RangeCalendarCell from '@/components/ui/range-calendar/RangeCalendarCell.vue'
import RangeCalendarCellTrigger from '@/components/ui/range-calendar/RangeCalendarCellTrigger.vue'
import RangeCalendarGrid from '@/components/ui/range-calendar/RangeCalendarGrid.vue'
import RangeCalendarGridBody from '@/components/ui/range-calendar/RangeCalendarGridBody.vue'
import RangeCalendarGridHead from '@/components/ui/range-calendar/RangeCalendarGridHead.vue'
import RangeCalendarGridRow from '@/components/ui/range-calendar/RangeCalendarGridRow.vue'
import RangeCalendarHeadCell from '@/components/ui/range-calendar/RangeCalendarHeadCell.vue'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import CustomCardWithSkeletonComponent from '@/components/CustomCardWithSkeleton.vue'
import I_free from '@/assets/icons/card_events/free-tag.svg?component'
import I_DRight from '@/assets/icons/card_events/double-right.svg?component'
import I_Location from '@/assets/icons/card_events/location.svg?component'
import I_Bookmark from '@/assets/icons/card_events/bookmark.svg?component'
const publicConfig = useConfig()
const { axiosJson, fetchCsrfToken } = useAxios()
const { encryptReq, decryptRes } = useEncryption()
interface Viewport {
    isMobile: ComputedRef<boolean>
    isTablet: ComputedRef<boolean>
    isDesktop: ComputedRef<boolean>
}
const viewPortCus = inject<Viewport>('viewport')
const input = reactive({
    search: '',
    popular: '' as any,
    university: '',
    category: '',
    range_date: '',
    pay: '',
})
console.log('entok view ', viewPortCus)
const fetchDataS = useFetchDataStore()
const local = reactive({
    fetchData: [] as any,
    past_events: null as any,
    reviews: null as any,
    inpSearch: '',
    keyword: ''
})
onBeforeMount(async() => {
    console.log('current ', useRoute().path)
    const res = await fetchDataS.fetchPage(useRoute().path, useRoute().query, {})
    if(res ==  undefined || res.status == 'error'){
        return
    }
    console.log('enttokk dataa ', res.data)
    local.fetchData = res.data
})
const posFilter = computed(() => {
    if(viewPortCus?.isDesktop.value){
        return '#filterSide'
    }else if (viewPortCus?.isMobile.value && isDialogOpen.value){
        return '#reka-dialog-content-v-0'
    }
    return null
})
const isDialogOpen = ref(false)
const inpTanggal = ref({
    start: today(getLocalTimeZone()).subtract({ days: 10 }),
    end: today(getLocalTimeZone()).add({ days: 10 }),
}) as Ref<DateRange>
const locale = ref("en-US")
const formatter = useDateFormatter(locale.value)
const RTPlaceholder = ref(inpTanggal.value.start) as Ref<DateValue>
const secondMonthPlaceholder = ref(inpTanggal.value.end) as Ref<DateValue>
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
    console.log('')
    console.log('tanggal', inpTanggal.value.start?.toString())
    console.log('tanggal', inpTanggal.value.end?.toString())
    console.log('gannttiii')
    console.log('')
    let retryCount = 0
    const searchFilterAPI = async() => {
        try{
            const params = {
                search: input.search || null,
                // f_pop: input.popular || null,
                // f_univ: input.university || null,
                f_category: input.category || null,
                f_pay: input.pay || null,
                f_sr_date: inpTanggal.value.start ? inpTanggal.value.start.toString() : null,
                f_er_date: inpTanggal.value.end ? inpTanggal.value.end.toString() : null,
            }
            const encr = await encryptReq({})
            const res = await(await axiosJson()).post('/search', {
                uniqueid: encr.iv,
                cipher: encr.data,
                mac: encr.mac,
            }, { params: { ...params, _: Date.now() }, headers: { 'X-Merseal': sessionStorage.merseal }})
            const decRes = decryptRes(res.data, encr.iv)
            console.log(decRes)
        }catch(err: any){
            if (err.response){
                let cusRedirect: string | null = null
                if(err.response.status === 404){
                    return { status:'error', message: 'not found', code: 404 }
                }
                if([419, 429].includes(err.response.status)){
                    if(retryCount <= 3){
                        retryCount++
                        await fetchCsrfToken()
                        return searchFilterAPI()
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
                console.log('anotherr', err.response.data.message)
                // return toast
                return { status:'error', message: err.response.data.message, code: err.response.status, data: { redirect: cusRedirect }}
            }
            console.log('errror', err)
            // return toast
            return { status:'error', message: err }
        }
    }
    searchFilterAPI()
}
const doSearch = () => {
    console.log('clickckk btnn searchh', local.inpSearch)
    local.keyword = local.inpSearch
    console.log('updatee keywrod btnn', local.keyword)
}
const skeletonSearch = (index: number) => {
    return {
        name: `skeletonSearch${index}`,
        render: () => {
            return h('div', { class: 'skeleton-wrapper absolute top-0 left-0 flex flex-col w-full h-full bg-red-500' }, {
                default: () => {
                    return [
                        h(Skeleton, { class: 'h-12 w-12 rounded-full', }),
                        h('div', { class: 'space-y-2' }, {
                            default: () => [
                                h(Skeleton, { class: 'h-4 w-[250px]' }),
                                h(Skeleton, { class: 'h-4 w-[200px]' }),
                                h(Skeleton, { class: 'h-4 w-[150px]' }),
                            ]
                        })
                    ]}
                }
            )
        }
    }
}
const cardSearch = (index: number) => {
    return {
        render: (inpData: any) => defineComponent({
            emits: ['toggleSkeleton'],
            setup(_, { emit }){
                let imgLoad = false
                const handleLoad = () => {
                    imgLoad = true
                    emit('toggleSkeleton', { name: `skeletonSearch${index}`, showSkeleton: false })
                }
                const handleComplete = () => emit('toggleSkeleton', { name: `skeletonSearch${index}`, showSkeleton: false })
                const handleError = () => emit('toggleSkeleton', { name: `skeletonSearch${index}`, showSkeleton: false })
                return () => h(Card, { class: 'w-fit h-fit', style: 'box-shadow: 0px 18px 47px 0px rgba(0, 0, 0, 0.1);' }, {
                    default: () => h(CardContent, { class: 'relative rounded-xl' }, {
                        default: () => h(Fragment, null, [
                            h('div', { class: 'relative' }, [
                                h('img', {
                                    src: inpData.img,
                                    alt: '',
                                    class: ['object-contain', inpData.img === '' ? 'hidden' : ''],
                                    style: 'height: 197px',
                                    ref: ((el: HTMLImageElement | null) => {
                                        if (el?.complete && el.naturalWidth !== 0 && !imgLoad) handleComplete()
                                    }) as VNodeRef,
                                    onLoad: () => handleLoad(),
                                    onError: () => handleError(),
                                }),
                                inpData.isFree ? h(I_free, { class: 'absolute top-0 right-0' }) : null
                            ]),
                            h('div', { class: 'w-[90%] mx-auto flex flex-col' }, [
                                h('div', { class: 'flex gap-5' }, [
                                    h('div', { class: 'flex flex-col' }, [
                                        h('span', { class: 'text-[#3D37F1] font-bold' }, ['May']),
                                        h('span', { class: 'text-black' }, ['11'])
                                    ]),
                                    h('div', { class: 'flex flex-col text-xl text-black' }, [
                                        h('span', { class: '' }, ['Civil Padura']),
                                        h('span', { class: '' }, ['By Civil Engineering Department'])
                                    ]),
                                ]),
                                h('div', { class: 'flex flex-col text-xl' }, [
                                    h('div', { class: 'flex gap-2 items-center' }, [
                                        h(I_DRight, { class: 'w-5 h-5 text-red-500' }),
                                        h('span', null, ['Musical Event']),
                                    ]),
                                    h('div', { class: 'flex gap-2 items-center' }, [
                                        h(I_DRight, { class: 'w-5 h-5 text-red-500' }),
                                        h('span', null, ['All Universities students can join']),
                                    ]),
                                ]),
                                h('div', { class: 'flex justify-between items-center mt-3' }, [
                                    h(I_Location, { class: 'w-8 h-8 text-red-500' }),
                                    h('span', { class: 'text-xl font-medium' }, ['University of Morotuwa']),
                                    h(I_Bookmark, { class: 'w-8 h-8 text-blue-500' }),
                                ]),
                            ]),
                        ])
                    })
                })
            }
        })
    }
}
const componentUISearch = {
    skeleton: skeletonSearch,
    card: cardSearch,
}
const metaDataSearch = {
    wrapper: (inpData: any) => defineComponent({
        setup(){
            const slots = useSlots()
            return () => {
                return h(RouterLink, { to: inpData.event_id, class: 'relative w-fit' }, {
                    default: () => slots.default ? slots.default() : null
                })
            }
        }
    }),
    totalItems: 6,
    customTWTransition: 'h-full mt-5',
    customCSSTransition: 'display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1.5rem;',
}
</script>
<template>
    <Teleport v-if="posFilter" :to="posFilter" defer>
        <form class="w-150 h-full rounded-xl pt-3 pb-5 pl-5 pr-5" style="box-shadow: 0px 18px 47px 0px rgba(0, 0, 0, 0.1);">
            <div>
                <Label>Pilih Populer</Label>
                <Select v-model="input.popular" @update:model-value="formSearchFilter()">
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
            </div>
            <div>
                <Label>Pilih Kategori</Label>
                <Select v-model="input.category" @update:model-value="formSearchFilter()">
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
                                    <button :class="cn(buttonVariants({ variant: 'outline' }), 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',)" @click="updateMonth('first', -1)">
                                        <ChevronLeft class="h-4 w-4" />
                                    </button>
                                    <div :class="cn('text-sm font-medium')"> {{ formatter.fullMonthAndYear(toDate(firstMonth.value),)}}</div>
                                    <button :class="cn(buttonVariants({ variant: 'outline' }),'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',)" @click="updateMonth('first', 1)">
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
                                        <div :class="cn('text-sm font-medium')">{{ formatter.fullMonthAndYear(toDate(secondMonth.value),) }}</div>
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
                <Select v-model="input.pay" @update:model-value="formSearchFilter()">
                    <SelectTrigger class="w-[180px]">
                        <SelectValue RTPlaceholder="Select a Popularity" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="/">None</SelectItem>
                            <SelectItem value="free">free</SelectItem>
                            <SelectItem value="all">all</SelectItem>
                            <SelectItem value="bayar">bayar</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </form>
    </Teleport>
    <section class="relative h-screen flex flex-col">
        <Dialog  v-model:open="isDialogOpen">
            <DialogTrigger v-if="viewPortCus?.isMobile.value">Filters</DialogTrigger>
            <div class="w-[95%] mx-auto mt-7">
                <div class="relative flex items-center justify-between">
                    <h2 class="w-fit text-4xl">Search Events</h2>
                    <div class="flex gap-5">
                        <Input id="email" type="email" class="w-50" placeholder="Cari Event" v-model="local.inpSearch"/>
                        <Button @click="doSearch()">Search</Button>
                    </div>
                </div>
                <div class="relative h-full">
                    <p>Menampilkan Event "{{ local.keyword }}" menemukan {{ local.fetchData.length }}</p>
                    <div class="flex gap-5">
                        <div id="filterSide"/>
                        <div class="w-full bg-green-500">ikiii</div>
                        <CustomCardWithSkeletonComponent :metaData="metaDataSearch" :componentUI="componentUISearch" :inpData="local.fetchData"/>
                    </div>
                </div>
            </div>
            <DialogContent v-if="viewPortCus?.isMobile.value">
                <VisuallyHidden>
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </VisuallyHidden>
            </DialogContent>
        </Dialog>
    </section>
</template>
<style scoped>
</style>