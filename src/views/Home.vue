<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { ref, reactive, onBeforeMount, markRaw, h, useSlots, defineComponent, type ComponentPublicInstance, nextTick, onMounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { useConfig } from '@/composables/useConfig'
import { breakpoints } from '@/composables/useScreenSize'
import { eventBus } from '@/eventBus'
import { useFetchDataStore } from '@/stores/FetchData'
import { getImgURL } from '@/utils/global'
import CustomCardWithSkeletonComponent from '@/components/CustomCardWithSkeleton.vue'
import I_VLeft from '@/assets/icons/vector-left.svg?component'
import I_VRight from '@/assets/icons/vector-right.svg?component'
import I_music from '@/assets/icons/hero_home/music_note.svg?component'
import I_conferences from '@/assets/icons/hero_home/conferences.svg?component'
import I_celebration from '@/assets/icons/hero_home/celebration.svg?component'
import I_games from '@/assets/icons/hero_home/games.svg?component'
import I_FullStar from '@/assets/icons/reviews/full-star.svg?component'
import I_HalfStar from '@/assets/icons/reviews/half-star.svg?component'
import I_EmptyStar from '@/assets/icons/reviews/empty-star.svg?component'
import I_Plus from '@/assets/icons/reviews/plus.svg?component'
import freeTag from '@/assets/images/free-tag.png';
import defaultBoy from '@/assets/images/default_boy.jpg'
import defaultGirl from '@/assets/images/default_girl.png'
const publicConfig = useConfig()
const fetchDataS = useFetchDataStore()
const hoverCar = ref<boolean>(false)
const local = reactive({
    upcoming_events: null as any,
    past_events: null as any,
    reviews: null as any,
})
// const sliceDate = (inp = [], key: string) => {
//     return inp.map((item: any) => {
//         if(item[key]){
//             const match = item[key].match(/^(\d{1,2})\s+([A-Za-zÀ-ž]+)\s+(\d{4})$/)
//             if(match){
//                 item.tanggal = match[1]
//                 item.bulan   = match[2]
//                 item.tahun   = match[3]
//             }
//         }
//         return item
//     });
// };
onBeforeMount(async() =>{
    const res = await fetchDataS.fetchPage(useRoute().path, {})
    if(res ==  undefined || res.status == 'error'){
        return
    }
    console.log('enttokk dataa ', res.data)
    local.upcoming_events = res.data.upcoming_events
    local.past_events = res.data.past_events
    local.reviews = res.data.reviews
    eventBus.emit('tHeader')
})
const activeIndex = ref(0)
const onSlideChange = (swiper: any) => {
    activeIndex.value = swiper.realIndex
}
const onHoverCar = (value: boolean) => {
    hoverCar.value = value
}
const catHero = reactive([
    {
        'name': 'Music Events',
        'icon': markRaw(I_music),
    },
    {
        'name': 'Conferences',
        'icon': markRaw(I_conferences),
    },
    {
        'name': 'Celebration',
        'icon': markRaw(I_celebration),
    },
    {
        'name': 'Games',
        'icon': markRaw(I_games),
    },
])
const metaDataUpcoming = {
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
    customTWTransition: 'grid grid-cols-1 phone:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4',
    snapshots: {
        base: 3,
        sm: 2,
        md: 2,
        xl: 1,
    },
}
const metaDataPast = {
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
    customTWTransition: 'grid grid-cols-1 phone:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5',
    snapshots: {
        base: 3,
        sm: 2,
        md: 2,
        xl: 1,
    },
}
const metaDataEventLoading = {
    customTWTransition: 'flex-1 grid grid-cols-1 phone:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2 lg:gap-4',
    snapshots: {
        base: 3,
        sm: 2,
        md: 2,
        xl: 1,
    },
}

const metaDataReviews = {
    wrapper: () => defineComponent({
        setup(){
            const slots = useSlots()
            return () => {
                return h('div', { class: 'relative h-full' }, {
                    default: () => slots.default ? slots.default() : null
                });
            }
        }
    }),
    customTWTransition: 'h-full mt-5 grid grid-cols-1 phone:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 [grid-auto-rows:8rem] phone:[grid-auto-rows:11rem] md:[grid-auto-rows:10.75rem] lg:[grid-auto-rows:12.5rem] xl:[grid-auto-rows:14rem] 2xl:[grid-auto-rows:15.5rem] gap-2 md:gap-4',
    snapshots: {
        base: 5,
        sm: 3,
        md: 3,
        xl: 2,
    },
}
const metaDataReviewLoading = {
    customTWTransition: 'flex-1 grid grid-cols-1 phone:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 [grid-auto-rows:8rem] phone:[grid-auto-rows:11rem] md:[grid-auto-rows:10.75rem] lg:[grid-auto-rows:12.5rem] xl:[grid-auto-rows:14rem] 2xl:[grid-auto-rows:15.5rem] gap-2 lg:gap-4',
    snapshots: {
        base: 5,
        sm: 5,
        md: 3,
        xl: 1,
    },
}
</script>
<template>
    <section class="relative h-screen pt-[calc(4rem+10px)] sm:pt-[calc(4rem+10px)] lg:pt-[calc(4rem+15px)] pb-35 sm:pb-25 lg:pb-30 flex flex-col lg:block">
        <div class="absolute top-0 left-0 w-full h-full -z-1">
            <img src="@/assets/images/party-1.png" alt="" class="w-full h-full object-cover" />
            <div class="absolute top-0 left-0 w-full h-full opacity-90" style="background: #ED4690; background: linear-gradient(145deg,rgba(237, 70, 144, 1) 0%, rgba(85, 34, 204, 1) 100%)"/>
        </div>
        <div class="relative flex-1 h-full w-full flex flex-col items-center gap-5 phone:gap-7 sm:gap-10 md:gap-12 lg:gap-15 !text-white">
            <Swiper v-if="local.upcoming_events && local.upcoming_events.length > 0" :modules="[Navigation, Pagination, Autoplay]" :slides-per-view="1" :space-between="20" :loop="true" :autoplay="{ delay: 3000 }" :pagination="{ clickable: true }" :allow-touch-move="false" :simulate-touch="false" :keyboard="{ enabled: false }" :mousewheel="{ enabled: false }" :navigation="{ nextEl: '.btn-next', prevEl: '.btn-prev' }" class="w-[87%] lg:w-[92%] aspect-video rounded-xl"  @slideChange="onSlideChange" @mouseenter="hoverCar = true" @mouseleave="hoverCar = false">
                <template v-for="(item, index) in local.upcoming_events" :key="index">
                    <SwiperSlide><img :src="item.img" alt="" class="w-full object-contain" loading="lazy"></SwiperSlide>
                </template>
                <div class="absolute z-2 w-full h-full top-0 left-0 backdrop-blur-[1px]">
                    <div class="absolute z-3 w-full h-full top-0 left-0 opacity-70" style="background: #5420B4; background: linear-gradient(45deg,rgba(84, 32, 180, 1) 100%, rgba(0, 0, 0, 1) 13%);"></div>
                    <div class="w-[92%] md:w-[90%] lg:w-[87%] xl:w-[85%] h-[77%] lg:h-[60%] relative z-4 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex transition-opacity duration-500 ease-in-out" :class="breakpoints.smaller('md').value || hoverCar ? 'opacity-100' : 'opacity-0 pointer-events-none'">
                        <div class="flex-1 flex flex-col md:flex-row justify-center md:justify-between items-center">
                            <div class="w-full md:w-auto md:min-w-fit md:max-w-1/2 lg:max-w-[45%] xl:max-w-[80%] 2xl:max-w-[57%] h-fit flex justify-around items-center gap-1 md:gap-0.75 lg:gap-1.25">
                                <I_VLeft class="btn-prev size-5 xs:size-6 phone:size-7 sm:size-8 md:size-7 lg:size-8 xl:size-8" :class="breakpoints.smaller('md').value || hoverCar ? 'opacity-100' : 'opacity-0 pointer-events-none'"/>
                                <div class="flex-1 w-full sm:w-[90%] flex flex-col gap-0.5 phone:gap-1 sm:gap-1.25 md:gap-0.75 lg:gap-2">
                                    <h4 class="!m-0 !text-sm phone:!text-base sm:!text-lg lg:!text-xl xl:!text-3xl !text-white">{{ local.upcoming_events[activeIndex].event_name }}</h4>
                                    <a :href="'/event/' + local.upcoming_events[activeIndex]!.event_id" class="w-fit h-fit px-2 py-1.5 sm:px-2.5 sm:py-2 md:px-2 md:py-1.75 lg:px-2.5 lg:py-2 text-white border border-0.5 sm:border-1 lg:border-1.5 xl:border-2 border-white rounded-md sm:rounded-lg md:rounded-md flex justify-center items-center hover:bg-white text-xs phone:text-sm sm:text-base md:text-sm lg:text-base xl:text-xl hover:text-black" style="box-shadow: 0px 18px 47px 0px rgba(0, 0, 0, 0.1);">Learn More</a>
                                </div>
                                <I_VRight class="btn-next size-5 xs:size-6 phone:size-7 sm:size-8 md:size-7 lg:size-8 xl:size-8" :class="breakpoints.smaller('md').value || hoverCar ? 'opacity-100' : 'opacity-0 pointer-events-none'"/>
                            </div>
                            <div class="hidden md:block md:w-1/2 lg:w-[44%] xl:w-[40%] 2xl:w-[30%] h-fit">
                                <h4 class="!m-0 md:!mb-0.25 md:!text-3xl lg:text-4xl xl:!text-5xl !text-white">Uni Events</h4>
                                <p class="!m-0 md:text-base lg:text-lg xl:text-xl">Stay updated with the latest academic talks, workshops, and social gatherings across Sri Lankan universities. Whether you're here to network, learn, or have fun, there’s something for everyone!</p>
                                <RouterLink to="/about" class="w-fit h-fit md:px-2 md:py-1.75 lg:px-2.5 lg:py-2 md:mt-2.5 lg:mt-5 xl:mt-6 text-white border border-0.5 sm:border-1 lg:border-1.5 xl:border-2 border-white md:rounded-md flex justify-center items-center hover:bg-white text-xs md:text-base lg:text-lg xl:text-xl 2l:text-xl hover:!text-black" style="box-shadow: 0px 18px 47px 0px rgba(0, 0, 0, 0.1);">Load More</RouterLink>
                            </div>
                        </div>
                    </div>
                </div>
            </Swiper>
            <Skeleton v-else :pt="{ root: { class: ['!w-[85%] lg:!w-[92%] aspect-video lg:aspect-auto !h-3/4 !rounded-xl xl:!rounded-4xl'], style: 'background-color: rgba(255,255,255, 0.18)'}}"></Skeleton>
            <ul class="phone:w-[75%] sm:w-fit h-fit grid grid-cols-2 gap-2.5 phone:flex phone:justify-around phone:gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-20 text-white">
                <li v-for="(item, index) in catHero" :key="index" class="flex flex-col items-center gap-1 xl:gap-2">
                    <div class="bg-white inline-flex justify-center items-center rounded-full w-fit">
                        <component :is="item.icon" class="size-7 xs:size-8 phone:size-9 sm:size-10 lg:size-13 xl:size-10 2xl:size-12 m-2.75 sm:m-3.5 lg:m-4 xl:m-5"></component>
                    </div>
                    <span class="block text-center text-sm xs:text-base phone:text-lg sm:text-xl lg:text-2xl xl:text-3xl font-medium">{{ item.name }}</span>
                </li>
            </ul>
        </div>
    </section>
    <!-- CARDS / UPCOMING -->
    <section class="relative flex flex-col overflow-x-clip pt-5">
        <img src="@/assets/images/cele-3.png" alt="" class="absolute bottom-0 -right-[29.5%] w-[75%] h-[75%] -z-1 object-cover opacity-30" />
        <div class="w-[90%] sm:w-[92%] lg:w-[95%] xl:w-[97%] mx-auto h-fit">
            <h2 class="w-fit mt-5 !mb-1.25 phone:!mb-1.75 sm:!mb-2 lg:mb-3 mx-auto !text-lg phone:!text-xl md:!text-2xl lg:!text-3xl xl:!text-4xl font-semibold text-[#242565]">All Events</h2>
            <!-- <p></p> -->
            <CustomCardWithSkeletonComponent v-if="local.upcoming_events" :metaData="metaDataUpcoming" :inpData="local.upcoming_events" :paralelRender="2">
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
            <CustomCardWithSkeletonComponent v-else :metaData="metaDataEventLoading" :paralelRender="Infinity" :isLoading="true">
                <div class="skeleton-wrapper flex-1 flex flex-col items-center">
                    <Skeleton :pt="{ root: { class: ['!w-[103%] sm:!w-[102.5%] !h-[123px] phone:!h-[172px] lg:!h-[200px] !rounded-lg relative -left-[0.25%] -top-[1%]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                    <div class="w-full p-3.75 lg:p-4.75 xl:px-6.75 xl:py-4.75 mx-auto flex flex-col">
                        <Skeleton :pt="{ root: { class: ['!h-[13px] sm:!h-[16.75px] lg:!h-[17px] xl:!h-[18px] 2xl:!h-[20px] !rounded-[3px] sm:!rounded-[4px] lg:!rounded-[5px]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                        <Skeleton :pt="{ root: { class: ['!h-[13px] sm:!h-[16.75px] lg:!h-[17px] xl:!h-[18px] 2xl:!h-[20px] mt-1 lg:mt-1.5 !rounded-[3px] sm:!rounded-[4px] lg:!rounded-[5px]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                        <Skeleton :pt="{ root: { class: ['!w-[92px] xs:!w-[92px] phone:!w-[110px] sm:!w-[112px] lg:!w-[127px] xl:!w-[157px] 2xl:!w-[160px] !h-[14px] sm:!h-[15.5px] lg:!h-[18px] xl:!h-[18px] 2xl:!h-[20px] mt-1.5 sm:mt-1 lg:mt-2 !rounded-[3px] sm:!rounded-[4px] lg:!rounded-[5px]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                    </div>
                </div>
            </CustomCardWithSkeletonComponent>
            <RouterLink to="/event" class="relative left-1/2 -translate-x-1/2 w-fit h-fit mt-5 lg:mt-10 px-3 py-2 sm:px-3.25 sm:py-2.25 lg:px-3.5 lg:py-2.5 text-[#3D37F1] border border-0.5 sm:border-1 lg:border-1.5 xl:border-2 border-[#3D37F1] rounded-lg md:rounded-xl flex justify-center items-center hover:bg-[#3D37F1] text-sm sm:text-base lg:text-lg xl:text-lg hover:text-white font-semibold" style="box-shadow: 0px 18px 47px 0px rgba(0, 0, 0, 0.1);">See All Events</RouterLink>
        </div>
        <div class="h-16 xs:h-16.25 phone:h-21 sm:h-25 md:h-35 lg:h-41 xl:h-51 2xl:h-58 mt-17 xs:mt-20 phone:mt-25 sm:mt-30 md:mt-37 lg:mt-42 xl:mt-47 2xl:mt-55 bg-purple-500">
            <div class="w-[94%] xs:w-[86%] sm:w-[80%] md:w-[83%] lg:w-[80%] 2xl:w-[70%] h-full relative left-1/2 -translate-x-1/2 flex justify-between items-end overflow-y-visible">
                <img src="@/assets/images/image-3.png" alt="" class="h-30 xs:h-32 phone:h-43 sm:h-52 md:h-70 lg:h-80 xl:h-97 2xl:h-110">
                <div class="w-fit lg:max-w-[26rem] xl:max-w-[33rem] h-fit self-center flex flex-col items-center text-white text-center lg:text-start">
                    <h3 class="!m-0 !text-base phone:!text-lg sm:!text-xl md:!text-2xl lg:!text-3xl xl:!text-3xl !text-white !font-medium md:!font-semibold">Add Your Loving Event</h3>
                    <p class="hidden lg:!block lg:w-[85%] xl:w-[70%] !text-sm sm:!text-base lg:!text-lg xl:!text-xl text-center line-clamp-2">Want more people to know about your campus event ? Add it to UniEvents now.</p>
                    <RouterLink to="/" class="mt-1 sm:mt-3 lg:mt-1 px-2 lg:px-4 py-1 lg:py-2 rounded-sm lg:rounded-md text-xs sm:text-sm lg:text-base xl:text-lg !font-normal" style="background-color:#F5167E">View all events</RouterLink>
                </div>
            </div>
        </div>
    </section>
    <section class="relative mt-10 mb-15 lg:mb-20">
        <img src="@/assets/images/cele-2.png" alt="" class="absolute top-1/2 -translate-y-1/2 -left-[29.5%] w-[75%] h-[75%] -z-1 object-cover opacity-30"/>
        <div class="w-[94%] mx-auto">
            <h2 class="w-fit mt-5 !mb-1.25 phone:!mb-1.75 sm:!mb-2 lg:mb-3 mx-auto lg:mx-0 !text-lg phone:!text-xl md:!text-2xl lg:!text-3xl xl:!text-4xl font-semibold text-[#242565]">Past Events</h2>
            <CustomCardWithSkeletonComponent v-if="local.past_events" :metaData="metaDataPast" :inpData="local.past_events" :paralelRender="2">
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
            <CustomCardWithSkeletonComponent v-else :metaData="metaDataEventLoading" :paralelRender="Infinity" :isLoading="true">
                <div class="skeleton-wrapper flex-1 flex flex-col items-center">
                    <Skeleton :pt="{ root: { class: ['!w-[103%] sm:!w-[102.5%] !h-[123px] phone:!h-[172px] lg:!h-[200px] !rounded-lg relative -left-[0.25%] -top-[1%]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                    <div class="w-full p-3.75 lg:p-4.75 xl:px-6.75 xl:py-4.75 mx-auto flex flex-col">
                        <Skeleton :pt="{ root: { class: ['!h-[13px] sm:!h-[16.75px] lg:!h-[17px] xl:!h-[18px] 2xl:!h-[20px] !rounded-[3px] sm:!rounded-[4px] lg:!rounded-[5px]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                        <Skeleton :pt="{ root: { class: ['!h-[13px] sm:!h-[16.75px] lg:!h-[17px] xl:!h-[18px] 2xl:!h-[20px] mt-1 lg:mt-1.5 !rounded-[3px] sm:!rounded-[4px] lg:!rounded-[5px]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                        <Skeleton :pt="{ root: { class: ['!w-[92px] xs:!w-[92px] phone:!w-[110px] sm:!w-[112px] lg:!w-[127px] xl:!w-[157px] 2xl:!w-[160px] !h-[14px] sm:!h-[15.5px] lg:!h-[18px] xl:!h-[18px] 2xl:!h-[20px] mt-1.5 sm:mt-1 lg:mt-2 !rounded-[3px] sm:!rounded-[4px] lg:!rounded-[5px]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                    </div>
                </div>
            </CustomCardWithSkeletonComponent>
            <RouterLink to="/event" class="relative left-1/2 -translate-x-1/2 w-fit h-fit mt-5 lg:mt-10 px-3 py-2 sm:px-3.25 sm:py-2.25 lg:px-3.5 lg:py-2.5 text-[#3D37F1] border border-0.5 sm:border-1 lg:border-1.5 xl:border-2 border-[#3D37F1] rounded-lg md:rounded-xl flex justify-center items-center hover:bg-[#3D37F1] text-sm sm:text-base lg:text-lg xl:text-lg hover:text-white font-semibold" style="box-shadow: 0px 18px 47px 0px rgba(0, 0, 0, 0.1);">Load More</RouterLink>
        </div>
        <div class="w-[97%] lg:w-[95%] xl:w-[97%] mx-auto mt-20 lg:mt-50">
            <h2 class="w-fit !m-0 mx-auto !text-lg phone:!text-xl md:!text-2xl lg:!text-3xl xl:!text-4xl font-semibold text-[#242565]">Reviews About Us</h2>
            <p class="w-fit mx-auto text-sm sm:text-text-base md:text-lg lg:text-xl xl:text-2xl text-center text-[#242565]">See what our amazing customers have to say about us!</p>
            <CustomCardWithSkeletonComponent v-if="local.reviews" :metaData="metaDataReviews" :inpData="local.reviews" :paralelRender="1">
                <template #skeleton="{ index, skeletonRefs }">
                    <div :ref="el => skeletonRefs[index] = el" class="skeleton-wrapper absolute z-10 top-0 left-0 w-full h-full p-3 lg:p-4 xl:p-5 flex flex-col gap-0.75 xs:gap-2 phone:gap-1.5 sm:gap-0.25 lg:gap-1.25 xl:gap-3.25 2xl:gap-4 transition-opacity duration-100 pointer-events-none">
                        <div class="w-full h-13 xs:h-14 phone:h-15 sm:h-19 md:h-20 lg:h-21 xl:h-22 flex gap-1 phone:gap-1.5 sm:gap-1 md:gap-1.75 lg:gap-1.5 xl:gap-1">
                            <Skeleton shape="circle" :pt="{ root: { class: ['relative top-[42%] xs:top-[52.5%] sm:top-[48.5%] xl:top-[51%] 2xl:top-[52%] -translate-y-1/2 !w-11.5 phone:!w-14 sm:!w-15 md:!w-16 lg:!w-17 xl:!w-18 !h-11 phone:!h-14 sm:!h-15 md:!h-16 lg:!h-17 xl:!h-18'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                            <div class="flex-1 self-center h-full flex flex-col">
                                <Skeleton :pt="{ root: { class: ['!w-[71px] xs:!w-[70px] phone:!w-[75px] sm:!w-[92px] md:!w-[90px] lg:!w-[110px] xl:!w-[128px] 2xl:!w-[135px] !h-[14px] xs:!h-[15.5px] sm:!h-[17px] md:!h-[17.75px] lg:!h-[19.5px] xl:!h-[23px] 2xl:!h-[24.2px] !rounded-[3px] sm:!rounded-[4px] lg:!rounded-[5px]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                                <Skeleton :pt="{ root: { class: ['!h-[13.75px] xs:!h-[18px] sm:!h-[19px] md:!h-[19.25px] lg:!h-[20.75px] xl:!h-[22px] 2xl:!h-[22.5px] mt-0.5 xs:mt-1 phone:mt-0.75 sm:mt-1 lg:mt-1.25 2xl:mt-1.5 !rounded-[3px]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                                <Skeleton :pt="{ root: { class: ['!w-[92px] xs:!w-[110px] phone:!w-[110px] sm:!w-[125px] md:!w-[123px] lg:!w-[137px] xl:!w-[157px] 2xl:!w-[160px] !h-[13.75px] xs:!h-[14px] sm:!h-[15px] md:!h-[15.5px] lg:!h-[17.75px] xl:!h-[19.5px] 2xl:!h-[20.2px] mt-1 sm:mt-1.5 md:mt-1.25 !rounded-[3px] sm:!rounded-[4px] lg:!rounded-[5px]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                            </div>
                        </div>
                        <Skeleton :pt="{ root: { class: ['flex-1'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                    </div>
                </template>
                <template #card="{ index, inpData, toggleSkeleton, cardRefs }">
                    <Card :ref="el => cardRefs[index] =  (el as ComponentPublicInstance)?.$el" :pt="{ root: { class: ['relative !h-full opacity-0 transition-opacity duration-100 rounded-xl flex flex-col gap-2'], style: 'box-shadow: 0px 18px 47px 0px rgba(0, 0, 0, 0.1);' }, body: { class: ['!p-3 lg:!p-4 xl:!p-5']}}">
                        <template #content>
                            <div class="flex items-center gap-1.25 phone:gap-1.5 md:gap-1.75 xl:gap-2">
                                <div class="relative right-0 w-11 phone:w-14 sm:w-15 md:w-16 lg:w-17 xl:w-18 h-11 phone:h-14 sm:h-15 md:h-16 lg:h-17 xl:h-18 wrounded-full pointer-events-none">
                                    <img :src="inpData.photo ? publicConfig.baseURL + inpData.photo : [defaultBoy, defaultGirl][Math.floor(Math.random() * 2)]" alt="" class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-full h-full object-cover" style="clip-path: circle();" :ref="((el: any) => {
                                        if(el?.complete && el.naturalWidth !== 0 && !inpData.imgLoad) toggleSkeleton(index)
                                    })"
                                    @load="() => {
                                        inpData.imgLoad = true
                                        toggleSkeleton(index)
                                    }" @error="(e: Event) => {
                                        const imgEl = e.target as HTMLImageElement
                                        imgEl.src = [defaultBoy, defaultGirl][Math.floor(Math.random() * 2)]
                                        toggleSkeleton(index)
                                    }">
                                </div>
                                <div class="flex flex-col gap-0">
                                    <div class="flex">
                                        <template v-for="i in 5" :key="i">
                                            <I_FullStar v-if="i <= Math.floor(inpData.rating)" class="size-4 xs:size-4.25 sm:size-5 lg:size-6 xl:size-7 2xl:size-7.5 text-yellow-500"/>
                                            <I_HalfStar v-else-if="i === Math.ceil(inpData.rating) && inpData.rating % 1 >= 0.5" class="size-[13.4px] xs:size-[14.25px] sm:size-[16.5px] lg:size-[19.75px] xl:size-[23.25px] 2xl:size-[25.2px] text-yellow-500"/>
                                            <I_EmptyStar v-else class="size-4 xs:size-4.25 sm:size-5 lg:size-6 xl:size-7 2xl:size-7.5 text-yellow-500"/>
                                        </template>
                                    </div>
                                    <span class=" !m-0 !text-sm xs:!text-base phone:!text-base sm:!text-lg lg:!text-xl xl:!text-2xl font-semibold" style="text-transform: capitalize;">{{ inpData.name }}</span>
                                    <span class="text-xs xs:text-sm phone:text-sm sm:text-base lg:text-lg xl:text-xl">{{ inpData.date_review }}</span>
                                </div>
                            </div>
                            <p class="!mt-0.5 xs:!mt-0.5 sm:!mt-1 md:!mt-1.5 lg:!mt-2 xl:!mt-3 text-xs xs:text-sm phone:text-sm sm:text-base lg:text-lg xl:text-xl">{{ inpData.comment }}</p>
                        </template>
                    </Card>
                </template>
                <template #placeholder-card>
                    <Card style="box-shadow: 0px 18px 47px 0px rgba(0, 0, 0, 0.1);" :pt="{ root: { class: ['!h-full']}, body: { class:['!h-full'] }, content: { class: ['relative !h-full rounded-xl aspect-video lg:aspect-auto flex flex-col justify-center items-center gap-1 lg:gap-2']}}">
                        <template #content>
                            <I_Plus class="size-7 phone:size-6 sm:size-9 lg:size-11 xl:size-13"/>
                            <p class="text-base sm:text-lg lg:text-xl xl:text-2xl font-medium">Add Yours</p>
                        </template>
                    </Card>
                </template>
            </CustomCardWithSkeletonComponent>
            <CustomCardWithSkeletonComponent v-else :metaData="metaDataReviewLoading" :paralelRender="Infinity" :isLoading="true">
                <div class="skeleton-wrapper flex-1 h-full p-3 lg:p-4 xl:p-5 flex flex-col gap-0.75 xs:gap-2 phone:gap-1.5 sm:gap-0.25 lg:gap-1.25 xl:gap-3.25 2xl:gap-4 transition-opacity duration-100">
                    <div class="w-full h-13 xs:h-14 phone:h-15 sm:h-19 md:h-20 lg:h-21 xl:h-22 flex gap-1 phone:gap-1.5 sm:gap-1 md:gap-1.75 lg:gap-1.5 xl:gap-1">
                        <Skeleton shape="circle" :pt="{ root: { class: ['relative top-[42%] xs:top-[52.5%] sm:top-[48.5%] xl:top-[51%] 2xl:top-[52%] -translate-y-1/2 !w-11.5 phone:!w-14 sm:!w-15 md:!w-16 lg:!w-17 xl:!w-18 !h-11 phone:!h-14 sm:!h-15 md:!h-16 lg:!h-17 xl:!h-18'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                        <div class="flex-1 self-center h-full flex flex-col">
                            <Skeleton :pt="{ root: { class: ['!w-[71px] xs:!w-[70px] phone:!w-[75px] sm:!w-[92px] md:!w-[90px] lg:!w-[110px] xl:!w-[128px] 2xl:!w-[135px] !h-[14px] xs:!h-[15.5px] sm:!h-[17px] md:!h-[17.75px] lg:!h-[19.5px] xl:!h-[23px] 2xl:!h-[24.2px] !rounded-[3px] sm:!rounded-[4px] lg:!rounded-[5px]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                            <Skeleton :pt="{ root: { class: ['!h-[13.75px] xs:!h-[18px] sm:!h-[19px] md:!h-[19.25px] lg:!h-[20.75px] xl:!h-[22px] 2xl:!h-[22.5px] mt-0.5 xs:mt-1 phone:mt-0.75 sm:mt-1 lg:mt-1.25 2xl:mt-1.5 !rounded-[3px]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                            <Skeleton :pt="{ root: { class: ['!w-[92px] xs:!w-[110px] phone:!w-[110px] sm:!w-[125px] md:!w-[123px] lg:!w-[137px] xl:!w-[157px] 2xl:!w-[160px] !h-[13.75px] xs:!h-[14px] sm:!h-[15px] md:!h-[15.5px] lg:!h-[17.75px] xl:!h-[19.5px] 2xl:!h-[20.2px] mt-1 sm:mt-1.5 md:mt-1.25 !rounded-[3px] sm:!rounded-[4px] lg:!rounded-[5px]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                        </div>
                    </div>
                    <Skeleton :pt="{ root: { class: ['flex-1'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                </div>
            </CustomCardWithSkeletonComponent>
        </div>
    </section>
</template>