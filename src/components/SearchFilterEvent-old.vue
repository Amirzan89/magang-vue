<script setup lang="ts">
import { RangeCalendarRoot, useDateFormatter, type DateRange } from "reka-ui"
import { Calendar, ChevronLeft, ChevronRight} from "lucide-vue-next"
import { createMonth, toDate, type Grid } from "reka-ui/date"
import { CalendarDate, getLocalTimeZone, isEqualMonth, today, type DateValue } from "@internationalized/date"
import { ref, reactive, watch, type Ref } from 'vue'
import { cn } from "@/utils/shadcn-vue"
import { formatTgl } from "@/utils/global"
import { useConfig } from '@/composables/useConfig'
import useAxios from '@/composables/api/axios'
import encryption from '@/composables/encryption'
import Label from './ui/label/Label.vue'
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectValue } from '@/components/ui/select'
import { Button, buttonVariants } from '@/components/ui/button'
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
const publicConfig = useConfig()
const { axiosJson, fetchCsrfToken } = useAxios()
const { encryptReq, decryptRes } = encryption()
const props = defineProps({
    searchKeyword: null,
})
const emit = defineEmits(['eventsData'])
const input = reactive({
    search: '',
    popular: '' as any,
    university: '',
    category: '',
    range_date: '',
    pay: '',
});
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
            return emit('eventsData', decRes)
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
watch(() => props.searchKeyword, async() => {
    input.search = props.searchKeyword
    console.log('watchh submitt ', input.search)
    formSearchFilter()
})
</script>
<template>
    <form class="w-150 h-full rounded-xl pt-3 pb-5 pl-5 pr-5" style="box-shadow: 0px 18px 47px 0px rgba(0, 0, 0, 0.1);">
        <!-- <div>
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
        </div> -->
        <!-- <div>
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
        </div> -->
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
</template>