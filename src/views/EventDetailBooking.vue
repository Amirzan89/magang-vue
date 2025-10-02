<script setup lang="ts">
import type { Swiper as SwiperType } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Thumbs, Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import "swiper/css/thumbs"
import 'swiper/css/autoplay'
import { reactive, onBeforeMount, defineComponent, useSlots, h, type ComponentPublicInstance, ref, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { breakpoints } from '@/composables/useScreenSize'
import { useFetchDataStore } from '@/stores/FetchData'
import EventDetailComponent from '@/components/EventDetail.vue'
import EventBookingComponent from '@/components/EventBooking.vue'
import I_VLeft from '@/assets/icons/vector-left.svg?component'
import I_VRight from '@/assets/icons/vector-right.svg?component'
import I_Location from '@/assets/icons/detail_event/location.svg?component'
import I_Date from '@/assets/icons/detail_event/date.svg?component'
import I_Ticket from '@/assets/icons/detail_event/ticket.svg?component'
const fetchDataS = useFetchDataStore()
const local = reactive({
    detail_event: {} as Record<string, any>,
    all_events: null as any,
    inpSearch: '',
    isLoading: false,
})
const thumbsSwiper = ref<SwiperType | null>(null)
const mainSwiper = ref<SwiperType | null>(null);
const onMainSwiper = (swiper: SwiperType) => {
    mainSwiper.value = swiper;
    swiper.on("slideChange", () => {
        if(thumbsSwiper.value){
            thumbsSwiper.value.slideTo(swiper.realIndex);
        }
    });
}
const handleMouseEnter = () => {
    if(mainSwiper.value?.autoplay){
        mainSwiper.value.autoplay.stop();
    }
}
const handleMouseLeave = () => {
    if(mainSwiper.value?.autoplay){
        mainSwiper.value.autoplay.start();
    }
}
const slidePerView = computed(() => {
    if(breakpoints.greater('lg').value){
        return 5
    }
    return 3
})
const cleanImg = (img: any) => img.replaceAll('"', '').trim();
onBeforeMount(async() =>{
    const res = (await fetchDataS.fetchPage(useRoute().path, {}))
    if(res ==  undefined || res.status == 'error'){
        return
    }
    console.log('enttokk dataa ', res.data)
    local.detail_event = res.data.detail_event
    local.all_events = res.data.all_events
    // local.detail_event.img.forEach((val, i) => {
    //     console.log(i, JSON.stringify(val), val.charCodeAt(0))
    // })
})
</script>
<template>
    <section class="w-[90%] lg:w-[95%] mt-3 lg:mt-10 mx-auto flex flex-col md:flex-row gap-5">
        <div class="relative md:w-[50%] lg:w-[45%] xl:w-[45%]">
            <div v-if="local.detail_event && local.detail_event.img && local.detail_event.img.length > 0">
                <Swiper :modules="[Navigation, Thumbs, Autoplay]" :thumbs="{ swiper: thumbsSwiper }" :space-between="10" :navigation="{ nextEl: '.btn-next', prevEl: '.btn-prev' }" :loop="true" :autoplay="{ delay: 30000, disableOnInteraction: false }" @swiper="onMainSwiper" class="relative  h-[200px] phone:!h-[250px] sm:!h-[300px] md:!h-[350px] lg:!h-[400px] xl:h-[450px] mb-3 group" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
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
                <Swiper :modules="[Navigation, Thumbs, Autoplay]" @Swiper="(swiper) => (thumbsSwiper = swiper)" :space-between="0" :slides-per-view="slidePerView" centered-slides watch-slides-progress class="w-[63%] xs:w-[54%] phone:w-[60%] sm:w-[45%] lg:w-[78%] xl:w-4/5 h-[65px] xs:h-[70px] phone:h-[80px] sm:h-[90px] md:h-[95px] lg:h-[102px] xl:h-[110px] 2xl:h-[120px]"> 
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
            <h3 class="w-fit mt-1 sm:mt-3 lg:mt-5 text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-[#242565]">All Events</h3>
            <p class="xl:mt-5 text-base sm:text-lg lg:text-xl xl:text-2xl">Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, atque! Nihil consequuntur quasi perferendis neque facilis iusto dolore eaque. Ullam pariatur amet dicta voluptatum minima laudantium voluptates, rem quia ex.</p>
            <div class="w-[95%] ml-[5%] mt-5 flex">
                <div class="flex flex-col">
                    <I_Location class="size-5 xl:size- sm:w-8 sm:h-8 text-black"/>
                    <I_Date class="size-5 xl:size- sm:w-8 sm:h-8 text-black"/>
                    <I_Ticket class="size-5 xl:size- sm:w-8 sm:h-8 text-black"/>
                </div>
                <div class="ml-2 flex flex-col text-sm sm:text-base lg:text-lg xl:text-xl">
                    <p>Location</p>
                    <p>Date</p>
                    <p>Entry</p>
                </div>
                <div class="ml-3 flex flex-col text-sm sm:text-base lg:text-lg xl:text-xl">
                    <span>:</span>
                    <span>:</span>
                    <span>:</span>
                </div>
                <div class="ml-1 flex flex-col text-sm sm:text-base lg:text-lg xl:text-xl">
                    <!-- <p>{{ local.detail_event.nama_lokasi }}</p>
                    <p>{{ local.detail_event.start_date }}</p>
                    <p>{{ local.detail_event.price }}</p> -->
                </div>
            </div>
            <div class="w-fit relative left-1/2 -translate-x-1/2 mt-5 flex items-center gap-5">
                <Button variant="outlined" as="a" :href="local.detail_event?.link_event" target="_blank" rel="noopener noreferrer" class="w-fit !text-[#3D37F1] hover:!text-white !border-[#3D37F1] hover:!bg-[#3D37F1] !text-sm sm:!text-base lg:!text-lg xl:!text-xl">Book Event</Button>
                <Button variant="outlined" as="a" :href="local.detail_event?.event_detail" target="_blank" rel="noopener noreferrer" class="w-fit !text-[#3D37F1] hover:!text-white !border-[#3D37F1] hover:!bg-[#3D37F1] !text-sm sm:!text-base lg:!text-lg xl:!text-xl">Learn More</Button>
            </div>
        </div>
    </section>
    <EventDetailComponent v-if="useRoute().path == '/events'" :all_events="local.all_events" />
    <EventBookingComponent v-else :detail_event="local.detail_event" />
</template>
<style scoped>
:deep(.swiper-slide-thumb-active img) {
  border: 2px solid #3b82f6;
  border-radius: 0.375rem; /* rounded-md */
}
</style>