<script setup lang="ts">
import type { Swiper as SwiperType } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Thumbs, Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import "swiper/css/thumbs"
import 'swiper/css/autoplay'
import { reactive, ref, computed, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import useAxios from '@/composables/api/axios'
import { useToast } from 'primevue/usetoast'
import { breakpoints } from '@/composables/useScreenSize'
import EventDetailComponent from '@/components/EventDetail.vue'
import EventBookingComponent from '@/components/EventBooking.vue'
import I_VLeft from '@/assets/icons/vector-left.svg?component'
import I_VRight from '@/assets/icons/vector-right.svg?component'
import I_Location from '@/assets/icons/detail_event/location.svg?component'
import I_Date from '@/assets/icons/detail_event/date.svg?component'
import I_Ticket from '@/assets/icons/detail_event/ticket.svg?component'
const { reqData } = useAxios()
const toast = useToast()
const route = useRoute()
const local = reactive({
    detail_event: {} as Record<string, any>,
    all_events: null as any,
    inpSearch: '',
    eventID: '',
})
const thumbsSwiper = ref<SwiperType | null>(null)
const mainSwiper = ref<SwiperType | null>(null);
const onMainSwiper = (swiper: SwiperType) => {
    mainSwiper.value = swiper
    swiper.on("slideChange", () => {
        if(thumbsSwiper.value){
            thumbsSwiper.value.slideTo(swiper.realIndex);
        }
    });
}
const handleMouseEnter = () => {
    if(mainSwiper.value?.autoplay){
        mainSwiper.value.autoplay.stop()
    }
}
const handleMouseLeave = () => {
    if(mainSwiper.value?.autoplay){
        mainSwiper.value.autoplay.start()
    }
}
const slidePerView = computed(() => {
    if(breakpoints.greater('lg').value){
        return 5
    }
    return 3
})
const cleanImg = (img: any) => img.replaceAll('"', '').trim()
watch(() => route.path, async() => {
    if(route.params.id == local.eventID) return
    local.eventID = typeof route.params.id == 'string' ? route.params.id : route.params.id[0]
    const res = await reqData({
        url: '/api' + route.path,
        method: 'POST',
        reqType: 'Json',
    })
    if(res.status == 'error'){
        toast.add({ severity: 'error', summary: 'Gagal Ambil Data Halaman', detail: res.message, life: 3000 })
        return
    }
    local.detail_event = res.data.detail_event
    local.all_events = res.data.all_events
}, { immediate: true })
const activeComponent = computed(() =>
    route.path.startsWith('/event') ? EventDetailComponent : EventBookingComponent
)
</script>
<template>
    <img v-show="route.path.startsWith('/event')" src="@/assets/images/cele-3.png" alt="" class="absolute bottom-0 -right-[29.5%] w-[75%] h-[75%] -z-1 object-cover opacity-30"/>
    <section class="w-[90%] lg:w-[95%] mt-3 sm:mt-3 lg:mt-5 mx-auto flex flex-col md:flex-row gap-1 md:gap-5">
        <div class="relative md:w-[50%] lg:w-[45%] xl:w-[45%]">
            <div v-if="local.detail_event && local.detail_event.img && local.detail_event.img.length > 0">
                <Swiper :modules="[Navigation, Thumbs, Autoplay]" :thumbs="{ swiper: thumbsSwiper }" :space-between="10" :navigation="{ nextEl: '.btn-next', prevEl: '.btn-prev' }" :loop="true" :autoplay="{ delay: 30000, disableOnInteraction: false }" @swiper="onMainSwiper" class="relative  !h-[200px] phone:!h-[250px] sm:!h-[300px] md:!h-[350px] lg:!h-[400px] xl:h-[450px] mb-3 group" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
                    <template v-for="(img, i) in local.detail_event.img.filter((x: any) => x && x !== '-')" :key="i">
                        <SwiperSlide>
                            <img v-if="img && (img !== '-')" :src="img" class="w-full h-full object-cover" />
                        </SwiperSlide>
                    </template>
                    <div class="absolute z-2 inset-0 flex justify-between items-center px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <I_VLeft class="btn-prev size-8 text-black-500">prev</I_VLeft>
                        <I_VRight class="btn-next size-8 text-black-500">next</I_VRight>
                    </div>
                </Swiper>
                <Swiper :modules="[Navigation, Thumbs, Autoplay]" @Swiper="(swiper) => (thumbsSwiper = swiper)" :space-between="0" :slides-per-view="slidePerView" centered-slides watch-slides-progress class="w-[63%] xs:w-[54%] phone:w-[60%] sm:w-[45%] md:w-[73%] lg:w-[78%] xl:w-4/5 h-[65px] xs:h-[70px] phone:h-[80px] sm:h-[90px] md:h-[95px] lg:h-[102px] xl:h-[110px] 2xl:h-[120px]">
                    <SwiperSlide v-for="(img, i) in local.detail_event.img" :key="i" class="w-fit">
                        <img v-if="cleanImg(img) !== '-'" :src="cleanImg(img)" class="h-full object-contain" />
                    </SwiperSlide>
                </Swiper>
            </div>
            <div v-else>
                <Skeleton :pt="{ root: { class: ['!h-[200px] phone:!h-[250px] sm:!h-[300px] md:!h-[350px] lg:!h-[400px] xl:!h-[450px] !rounded-lg mb-3'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                <div class="w-[63%] xs:w-[54%] phone:w-[60%] sm:w-[45%] lg:w-[78%] xl:w-4/5 h-[65px] xs:h-[70px] phone:h-[80px] sm:h-[90px] md:h-[95px] lg:h-[102px] xl:h-[110px] 2xl:h-[120px] mx-auto flex gap-5">
                    <template v-for="i in slidePerView">
                        <Skeleton :pt="{ root: { class: ['flex-1 !h-full !rounded-sm ]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                    </template>
                </div>
            </div>
        </div>
        <div class="flex-1 h-fit">
            <h3 class="w-fit !m-0 phone:!mt-1 sm:!mt-3 lg:!mt-5 !text-lg sm:!text-xl lg:!text-2xl xl:!text-3xl font-medium md:font-semibold text-[#242565]">About Events</h3>
            <p class="!m-0 !text-base sm:!text-lg lg:!text-xl xl:!text-2xl">{{ local.detail_event.event_detail }}</p>
            <div class="w-[95%] ml-[2%] grid grid-cols-[auto_auto_auto_1fr] gap-x-2 gap-y-1 !text-base sm:!text-lg lg:!text-xl xl:!text-2xl items-start">
                <I_Location class="size-4 sm:size-4.75 lg:size-5.5 xl:size-6.75 mt-[2.25px] xl:mt-[2.5px] text-black justify-self-center"/>
                <p class="!m-0">Location</p>
                <span class="text-center w-2">:</span>
                <p class="!m-0">{{ local.detail_event.nama_lokasi ?? '-' }}</p>

                <I_Date class="size-4.5 sm:size-5.25 lg:size-6 xl:size-7.25 mt-[1.75px] lg:mt-[1.5px] xl:mt-[1.75px] text-black"/>
                <p class="!m-0">Date</p>
                <span class="text-center w-2">:</span>
                <p class="!m-0">{{ local.detail_event.start_date ?? '-' }}</p>

                <I_Ticket class="size-4.75 sm:size-5.5 lg:size-6.25 xl:size-7.5 mt-[1.5px] sm:mt-[2px] xl:mt-[2.75px] text-black"/>
                <p class="!m-0">Entry</p>
                <span class="text-center w-2">:</span>
                <p class="!m-0">{{ local.detail_event.price ?? '-' }}</p>
            </div>
            <div class="w-fit relative left-1/2 -translate-x-1/2 mt-5 flex items-center gap-5">
                <Button v-if="route.path.startsWith('/event')" variant="outlined" :as="RouterLink" :to="'/booking/' + route.params.id" class="w-fit !px-2 lg:!px-3 !py-1 lg:!py-1.5 !text-[#3D37F1] hover:!text-white !border-[#3D37F1] hover:!bg-[#3D37F1] !text-sm sm:!text-base lg:!text-lg xl:!text-xl">Book Event</Button>
                <Button v-if="route.path.startsWith('/booking')" variant="outlined" :as="RouterLink" :to="'/event/' + route.params.id" class="w-fit !px-2 lg:!px-3 !py-1 lg:!py-1.5 !text-[#3D37F1] hover:!text-white !border-[#3D37F1] hover:!bg-[#3D37F1] !text-sm sm:!text-base lg:!text-lg xl:!text-xl">Detail Event</Button>
                <Button variant="outlined" as="a" :href="local.detail_event?.event_detail ?? ''" target="_blank" rel="noopener noreferrer" class="w-fit !px-2 lg:!px-3 !py-1 lg:!py-1.5 !text-[#3D37F1] hover:!text-white !border-[#3D37F1] hover:!bg-[#3D37F1] !text-sm sm:!text-base lg:!text-lg xl:!text-xl">Learn More</Button>
            </div>
        </div>
    </section>
    <component :is="activeComponent" keep-alive :all_events="local.all_events ?? []" :detail_event="local.detail_event"></component>
</template>
<style scoped>  
:deep(.swiper-slide-thumb-active img) {
    border: 2px solid #3b82f6;
    border-radius: 0.375rem;
}
</style>