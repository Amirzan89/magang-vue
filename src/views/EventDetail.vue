<script setup lang="ts">
import type { Swiper as SwiperType } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Thumbs, Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import "swiper/css/thumbs"
import 'swiper/css/autoplay'
import { reactive, onBeforeMount, defineComponent, useSlots, h, type ComponentPublicInstance, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { breakpoints } from '@/composables/useScreenSize'
import { useFetchDataStore } from '@/stores/FetchData'
import { getImgURL } from '@/utils/global'
import CustomCardWithSkeletonComponent from '@/components/CustomCardWithSkeleton.vue'
import I_VLeft from '@/assets/icons/vector-left.svg?component'
import I_VRight from '@/assets/icons/vector-right.svg?component'
import I_Location from '@/assets/icons/detail_event/location.svg?component'
import I_Date from '@/assets/icons/detail_event/date.svg?component'
import I_Ticket from '@/assets/icons/detail_event/ticket.svg?component'
import I_LocationCard from '@/assets/icons/card_events/location.svg?component'
import I_Bookmark from '@/assets/icons/card_events/bookmark.svg?component'
import freeTag from '@/assets/images/free-tag.png';
const fetchDataS = useFetchDataStore()
const local = reactive({
    detail_event: null as any,
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
};
const handleMouseEnter = () => {
    if(mainSwiper.value?.autoplay){
        mainSwiper.value.autoplay.stop();
    }
};
const handleMouseLeave = () => {
    if(mainSwiper.value?.autoplay){
        mainSwiper.value.autoplay.start();
    }
};
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
const metaDataPopuler = {
    wrapper: () => defineComponent({
        setup(){
            const slots = useSlots()
            return () => {
                return h('div', { class: 'relative' }, {
                    default: () => slots.default ? slots.default() : null
                });
            }
        }
    }),
    customTWTransition: 'lg:w-fit h-full mt-1.5 phone:mt-2.5 sm:mt-4 lg:mt-5 mx-auto grid grid-cols-1 phone:grid-cols-[repeat(2,_1fr)] md:grid-cols-[repeat(3,1fr)] lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4',
}
const metaDataLoading = {
    customTWTransition: 'lg:w-fit h-full mt-1.5 phone:mt-2.5 sm:mt-4 lg:mt-5 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 grid-rows-[repeat(auto-fit,20rem)] gap-2 lg:gap-4',
}
</script>
<template>
    <section class="w-[95%] mt-10 mx-auto flex flex-col sm:flex-row gap-5">
        <div class="relative sm:w-[50%] lg:w-[45%] xl:w-[40%]">
            <div v-if="local.detail_event && local.detail_event.img && local.detail_event.img.length > 0">
                <Swiper :modules="[Navigation, Thumbs, Autoplay]" :thumbs="{ swiper: thumbsSwiper }" :space-between="10" :navigation="{ nextEl: '.btn-next', prevEl: '.btn-prev' }" :loop="true" :autoplay="{ delay: 30000, disableOnInteraction: false }" @swiper="onMainSwiper" class="relative  h-[400px] mb-3 group" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
                    <template v-for="(img, i) in local.detail_event.img.filter(x => x && x !== '-')" :key="i">
                        <SwiperSlide>
                            <img v-if="img && (img !== '-')" :src="img" class="w-full h-full object-cover" />
                        </SwiperSlide>
                    </template>
                    <div class="absolute z-2 inset-0 flex justify-between items-center px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <I_VLeft class="btn-prev size-8 text-black-500">prev</I_VLeft>
                        <I_VRight class="btn-next size-8 text-black-500">next</I_VRight>
                    </div>
                </Swiper>
                <Swiper :modules="[Navigation, Thumbs, Autoplay]" @Swiper="(swiper) => (thumbsSwiper = swiper)" :space-between="0" :slides-per-view="3" centered-slides watch-slides-progress class="w-4/5 h-[100px]">
                    <SwiperSlide v-for="(img, i) in local.detail_event.img" :key="i" class="w-fit">
                        <img v-if="cleanImg(img) !== '-'" :src="cleanImg(img)" class="h-full object-contain" />
                    </SwiperSlide>
                </Swiper>
            </div>
            <div v-else>
                <Skeleton :pt="{ root: { class: ['!h-[400px] !rounded-lg mb-3'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                <div class="w-4/5 h-[100px] mx-auto flex gap-5">
                    <Skeleton :pt="{ root: { class: ['flex-1 !h-full !rounded-sm ]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                    <Skeleton :pt="{ root: { class: ['flex-1 !h-full !rounded-md ]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                    <Skeleton :pt="{ root: { class: ['flex-1 !h-full !rounded-lg ]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                </div>
            </div>
        </div>
        <div class="bg-amber-500 flex-1">
            <h3 class="w-fit mt-5 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-[#242565]">All Events</h3>
            <p class="mt-5 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, atque! Nihil consequuntur quasi perferendis neque facilis iusto dolore eaque. Ullam pariatur amet dicta voluptatum minima laudantium voluptates, rem quia ex.</p>
            <!-- <h3>{{ local.detail_event.name_event }}</h3> -->
            <!-- <h3>{{ local.detail_event.event_description }}</h3> -->
            <!-- <p>{{ local.detail_event.event_description }}</p> -->
            <div class="mt-5 flex">
                <div class="flex flex-col">
                    <I_Location class="w-5 h-5 sm:w-8 sm:h-8 text-black"/>
                    <I_Date class="w-5 h-5 sm:w-8 sm:h-8 text-black"/>
                    <I_Ticket class="w-5 h-5 sm:w-8 sm:h-8 text-black"/>
                </div>
                <div class="flex flex-col">
                    <p>Location</p>
                    <p>Date</p>
                    <p>Entry</p>
                </div>
                <div class="flex flex-col">
                    <span>:</span>
                    <span>:</span>
                    <span>:</span>
                </div>
                <div class="flex flex-col">
                    <!-- <p>{{ local.detail_event. }}</p>
                    <p>{{ local.detail_event. }}</p>
                    <p>{{ local.detail_event.price }}</p> -->
                </div>
            </div>
            <div>
                <a :href="local.detail_event?.link_event" target="_blank" rel="noopener noreferrer">Book Event</a>
                <a :href="local.detail_event?.event_detail" target="_blank" rel="noopener noreferrer">Learn More</a>
            </div>
        </div>
    </section>
    <section class="relative overflow-x-clip">
        <img src="@/assets/images/cele-3.png" alt="" class="absolute bottom-0 -right-[29.5%] w-[75%] h-[75%] -z-1 object-cover opacity-30"/>
        <div class="w-[80%] mt-5 mx-auto">
            <div>
                <h2 class="w-fit mt-5 mx-auto lg:mx-0 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-[#242565]">More Details</h2>
                <p class="w-[90%] mt-5 mx-auto text-sm sm:text-text-base md:text-lg lg:text-xl xl:text-2xl bg-green-500">
                    Whether you're a tech enthusiast, an aspiring innovator, or just curious about the future, ExMo 2025 is the place to be. Dive into a world of futuristic ideas, hands-on demonstrations, groundbreaking innovations, and inspiring tech talks — all under one roof.
                    🌟 What to Expect:
                    ⚙️ Live Demos & Showcases
                    🧠 Tech Talks & Expert Panels
                    🤖 Robotics, AI, IoT, and Beyond
                    🎮 Interactive Projects & Student Innovations
                    🌐 Networking Opportunities with Industry Experts
                    🏆 Fun Competitions & Giveaways
                    💡 Explore. Experience. Excel.
                    Join us to discover how technology is shaping the future — today!
                </p>
            </div>
            <div class="relative flex flex-col mt-40 mb-10 xl:mb-30">
                <div class="w-[95%] mx-auto">
                    <div class="mx-auto flex flex-col justify-center items-center">
                        <h2 class="w-fit mx-auto lg:mx-0 text-xl xl:text-3xl font-bold">Popular Events</h2>
                        <p>see other events</p>
                    </div>
                    <CustomCardWithSkeletonComponent v-if="local.all_events && local.all_events.length > 0" :metaData="metaDataPopuler" :inpData="local.all_events" :paralelRender="1">
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
                            <Card :ref="el => cardRefs[index] =  (el as ComponentPublicInstance)?.$el" :pt="{ root: { class: ['rounded-md lg:rounded-[20px] overflow-hidden opacity-0 transition-opacity duration-100'], style: 'box-shadow: 0px 18px 47px 0px rgba(0, 0, 0, 0.1);' }, body: { class: ['!gap-1 !p-4 lg:!p-5 xl:!px-7 xl:!py-5'] }}">
                                <template #header>
                                    <img :src="getImgURL(inpData.img)" alt="" class="w-full h-[120px] phone:h-[170px] lg:h-[197px] object-cover" :ref="((el: any) => {
                                            if(el?.complete && el.naturalWidth !== 0 && !inpData.imgLoad) toggleSkeleton(index)
                                        })"
                                        @load="() => {
                                            inpData.imgLoad = true
                                            toggleSkeleton(index)
                                        }" @error="() => toggleSkeleton(index)"/>
                                    <img :src="freeTag" alt="" class="absolute -top-0.5 -right-0.5 z-9 h-[17%] lg:h-[18%]">
                                </template>
                                <template #content>
                                    <div class="flex flex-col gap-0">
                                        <RouterLink :to="'/events/' + inpData.event_id" class="text-sm sm:text-base lg:text-lg xl:text-xl font:medium lg:font-semibold">{{ inpData.event_name }}</RouterLink>
                                        <span class="text-xs sm:text-sm lg:text-base xl:text-lg">{{ inpData.start_date }}</span>
                                    </div>
                                    <div class="mt-4 sm:mt-3 lg:mt-5 xl:mt-7 flex justify-between">
                                        <a :href="inpData.link_lokasi" target="_blank" rel="noopener noreferrer"><I_LocationCard class="size-5.5 phone:size-5 sm:size-5.5 lg:size-6.5 text-green-500"/></a>
                                        <span class="text-sm sm:text-base lg:text-lg xl:text-xl">{{ inpData.nama_lokasi }}</span>
                                        <I_Bookmark class="size-5.5 phone:size-5 sm:size-5.5 lg:size-6.5 text-green-500"/>
                                    </div>
                                </template>
                            </Card>
                        </template>
                    </CustomCardWithSkeletonComponent>
                    <CustomCardWithSkeletonComponent v-else :metaData="metaDataLoading" :paralelRender="Infinity" :isLoading="true">
                            <div class="skeleton-wrapper flex-1 flex flex-col items-center">
                                <Skeleton :pt="{ root: { class: ['flex-1 !rounded-lg ]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                                <div class="w-[97%] mt-3.5 lg:mt-1.5 mx-auto">
                                    <Skeleton :pt="{ root: { class: ['!h-4 lg:h-6 !rounded-sm ]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                                    <Skeleton :pt="{ root: { class: ['!h-4 lg:h-6 mt-1 lg:mt-1.5 !rounded-md ]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                                    <Skeleton :pt="{ root: { class: ['!h-6.5 lg:h-11 mt-1.5 lg:mt-2 !rounded-lg ]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                                </div>
                            </div>
                        </CustomCardWithSkeletonComponent>
                    <RouterLink to="/events" class="relative left-1/2 -translate-x-1/2 w-fit h-fit mt-3 sm:mt-5 lg:mt-7 px-3 py-2 sm:px-3.25 sm:py-2.25 lg:px-3.5 lg:py-2.5 text-[#3D37F1] border border-0.5 sm:border-1 lg:border-1.5 xl:border-2 border-[#3D37F1] rounded-lg md:rounded-xl flex justify-center items-center hover:bg-[#3D37F1] text-sm sm:text-base lg:text-lg xl:text-lg hover:text-white font-semibold" style="box-shadow: 0px 18px 47px 0px rgba(0, 0, 0, 0.1);">Load More</RouterLink>
                </div>
            </div>
        </div>
    </section>
</template>
<style scoped>
:deep(.swiper-slide-thumb-active img) {
  border: 2px solid #3b82f6;
  border-radius: 0.375rem; /* rounded-md */
}
</style>