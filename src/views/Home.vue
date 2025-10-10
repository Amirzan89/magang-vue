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
    customTWTransition: 'grid grid-cols-1 phone:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-3 lg:gap-4',
    snapshots: {
        base: 3,
        sm: 2,
        md: 2,
        xl: 1,
    },
}
const metaDataEventLoading = {
    customTWTransition: 'grid grid-cols-1 phone:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2 lg:gap-4',
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
                return h('div', { class: 'relative' }, {
                    default: () => slots.default ? slots.default() : null
                });
            }
        }
    }),
    customTWTransition: 'h-full mt-5 grid grid-cols-1 phone:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4',
    snapshots: {
        base: 5,
        sm: 3,
        md: 3,
        xl: 2,
    },
}
const metaDataReviewLoading = {
    customTWTransition: 'flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 grid-rows-[repeat(auto-fit,20rem)] gap-2 lg:gap-4',
    snapshots: {
        base: 5,
        sm: 5,
        md: 3,
        xl: 2,
    },
}
</script>
<template>
    <section class="relative h-screen pt-[calc(4rem+10px)] sm:pt-[calc(4rem+10px)] lg:pt-[calc(4rem+15px)] pb-35 sm:pb-25 lg:pb-30 flex flex-col lg:block">
        <div class="absolute top-0 left-0 w-full h-full -z-1">
            <img src="@/assets/images/party-1.png" alt="" class="w-full h-full object-cover" />
            <div class="absolute top-0 left-0 w-full h-full opacity-90" style="background: #ED4690; background: linear-gradient(145deg,rgba(237, 70, 144, 1) 0%, rgba(85, 34, 204, 1) 100%)"/>
        </div>
        <div class="relative flex-1 h-full w-full flex flex-col justify-between items-center gap-15 !text-white">
            <Swiper v-if="local.upcoming_events && local.upcoming_events.length > 0" :modules="[Navigation, Pagination, Autoplay]" :slides-per-view="1" :space-between="20" :loop="true" :autoplay="{ delay: 3000 }" :pagination="{ clickable: true }" :allow-touch-move="false" :simulate-touch="false" :keyboard="{ enabled: false }" :mousewheel="{ enabled: false }" :navigation="{ nextEl: '.btn-next', prevEl: '.btn-prev' }" class="flex-1 lg:flex-initial w-[85%] lg:w-[92%] aspect-video rounded-xl"  @slideChange="onSlideChange">
                <template v-for="(item, index) in local.upcoming_events" :key="index">
                    <SwiperSlide><img :src="item.img" alt="" class="w-full object-contain" loading="lazy"></SwiperSlide>
                </template>
                <div class="absolute z-2 w-full h-full top-0 left-0 backdrop-blur-[1px]">
                    <div class="absolute z-3 w-full h-full top-0 left-0 opacity-70" style="background: #5420B4; background: linear-gradient(45deg,rgba(84, 32, 180, 1) 100%, rgba(0, 0, 0, 1) 13%);"></div>
                    <div class="w-[90%] lg:w-[75%] h-[77%] lg:h-[60%] relative z-4 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex sm:block">
                        <I_VLeft v-if="breakpoints.smaller('lg').value" class="btn-prev self-center size-8"/>
                        <div class="flex-1 flex flex-col sm:flex-row justify-between items-center gap-7">
                            <div class="w-full sm:w-[50%] lg:w-[40%] 2xl:w-[30%] min-h-[25%] sm:h-fit xl:h-[50%] flex justify-around lg:items-center" @mouseenter="hoverCar = true" @mouseleave="hoverCar = false">
                                <I_VLeft v-if="breakpoints.greater('lg').value" class="btn-prev size-8 transition-opacity duration-500 ease-in-out" :class="hoverCar ? 'opacity-100' : 'opacity-0 pointer-events-none'"/>
                                <div class="flex-1 w-full sm:w-[90%] flex flex-col items-start">
                                    <h4 class="flex-1 !text-base sm:!text-base lg:!text-lg xl:!text-xl !text-white">{{ local.upcoming_events[activeIndex].event_name }}</h4>
                                    <a :href="'/event/' + local.upcoming_events[activeIndex]!.event_id" class="w-fit h-fit px-3 py-2 sm:px-3.25 sm:py-2.25 lg:px-3.5 lg:py-2.5 text-[#fff] border border-0.5 sm:border-1 lg:border-1.5 xl:border-2 border-[#fff] rounded-lg md:rounded-xl flex justify-center items-center hover:bg-[#fff] text-xs sm:text-sm lg:text-base xl:text-lg hover:text-black md:font-semibold" style="box-shadow: 0px 18px 47px 0px rgba(0, 0, 0, 0.1);">Learn More</a>
                                </div>
                                <I_VRight v-if="breakpoints.greater('lg').value" class="btn-next size-8 transition-opacity duration-500 ease-in-out" :class="hoverCar ? 'opacity-100' : 'opacity-0 pointer-events-none'"/>
                            </div>
                            <div class="lg:w-[30%] 2xl:w-[30%] h-fit">
                                <h4 class="!m-0 sm:!mb-1 !text-base sm:!text-base lg:!text-lg xl:!text-xl !text-white">Uni Events</h4>
                                <p class="text-xs sm:text-sm lg:text-base xl:text-lg">Stay updated with the latest academic talks, workshops, and social gatherings across Sri Lankan universities. Whether you're here to network, learn, or have fun, there’s something for everyone!</p>
                                <RouterLink to="/about" class="w-fit h-fit px-3 py-2 sm:px-3.25 sm:py-2.25 lg:px-3.5 lg:py-2.5 text-[#fff] border border-0.5 sm:border-1 lg:border-1.5 xl:border-2 border-[#fff] rounded-lg md:rounded-xl flex justify-center items-center hover:bg-[#fff] text-xs sm:text-sm lg:text-base xl:text-lg hover:!text-black md:font-semibold" style="box-shadow: 0px 18px 47px 0px rgba(0, 0, 0, 0.1);">Load More</RouterLink>
                            </div>
                        </div>
                        <I_VRight v-if="breakpoints.smaller('lg').value" class="btn-next self-center size-8"/>
                    </div>
                </div>
            </Swiper>
            <Skeleton v-else :pt="{ root: { class: ['!w-[85%] lg:!w-[92%] aspect-video lg:aspect-auto !h-3/4 !rounded-xl xl:!rounded-4xl'], style: 'background-color: rgba(255,255,255, 0.18)'}}"></Skeleton>
            <ul class="phone:w-[75%] lg:w-fit h-fit grid grid-cols-2 gap-4 phone:flex phone:justify-around phone:gap-0 xl:gap-20 text-white">
                <li v-for="(item, index) in catHero" :key="index" class="flex flex-col items-center gap-1 xl:gap-2">
                    <div class="bg-white inline-flex justify-center items-center rounded-full w-fit">
                        <component :is="item.icon" class="size-7 phone:size-8 xl:size-10 2xl:size-12 m-2.75 phone:m-2.5 xl:m-5"></component>
                    </div>
                    <span class="block text-center text-sm xl:text-xl font-medium">{{ item.name }}</span>
                </li>
            </ul>
        </div>
    </section>
    <!-- CARDS / UPCOMING -->
    <section class="relative flex flex-col overflow-x-clip pt-5">
        <img src="@/assets/images/cele-3.png" alt="" class="absolute bottom-0 -right-[29.5%] w-[75%] h-[75%] -z-1 object-cover opacity-30" />
        <div class="w-[90%] sm:w-[92%] lg:w-[95%] xl:w-[97%] mx-auto h-fit">
            <h2 class="w-fit mt-5 !mb-1.25 phone:!mb-1.75 sm:!mb-2 lg:mb-3 mx-auto !text-lg sm:!text-xl md:!text-2xl lg:!text-3xl xl:!text-4xl font-semibold text-[#242565]">All Events</h2>
            <!-- <p></p> -->
            <CustomCardWithSkeletonComponent v-if="local.upcoming_events" :metaData="metaDataUpcoming" :inpData="local.upcoming_events" :paralelRender="2">
                <template #skeleton="{ index, skeletonRefs }">
                    <div :ref="el => skeletonRefs[index] = el" class="skeleton-wrapper absolute z-10 left-0 w-full h-full flex flex-col items-center transition-opacity duration-100">
                        <Skeleton :pt="{ root: { class: ['!w-[104%] !h-[57%] lg:h-[65%] !rounded-lg'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                        <div class="w-[97%] mt-3.5 lg:mt-1.5 mx-auto">
                            <Skeleton :pt="{ root: { class: ['!h-4 lg:h-6 !rounded-sm'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                            <Skeleton :pt="{ root: { class: ['!h-4 lg:h-6 mt-1 lg:mt-1.5 !rounded-md'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                            <Skeleton :pt="{ root: { class: ['!h-6.5 lg:h-11 mt-1.5 lg:mt-2 !rounded-lg'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
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
                                <RouterLink :to="'/event/' + inpData.event_id" class="text-sm sm:text-base lg:text-lg xl:text-xl font:medium lg:font-semibold">{{ inpData.event_name }}</RouterLink>
                                <span class="text-xs sm:text-sm lg:text-base xl:text-lg">{{ inpData.start_date }}</span>
                            </div>
                        </template>
                    </Card>
                </template>
            </CustomCardWithSkeletonComponent>
            <CustomCardWithSkeletonComponent v-else :metaData="metaDataEventLoading" :paralelRender="Infinity" :isLoading="true">
                <div class="skeleton-wrapper flex-1 flex flex-col items-center">
                    <Skeleton :pt="{ root: { class: ['!w-full !h-[120px] phone:!h-[170px] lg:!h-[197px] !rounded-lg'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                    <div class="w-[97%] mt-3.5 lg:mt-1.5 mx-auto">
                        <Skeleton :pt="{ root: { class: ['!h-4 lg:h-6 !rounded-sm'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                        <Skeleton :pt="{ root: { class: ['!h-4 lg:h-6 mt-1 lg:mt-1.5 !rounded-md'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                        <Skeleton :pt="{ root: { class: ['!h-6.5 lg:h-11 mt-1.5 lg:mt-2 !rounded-lg'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                    </div>
                </div>
            </CustomCardWithSkeletonComponent>
            <RouterLink to="/event" class="relative left-1/2 -translate-x-1/2 w-fit h-fit mt-5 lg:mt-10 px-3 py-2 sm:px-3.25 sm:py-2.25 lg:px-3.5 lg:py-2.5 text-[#3D37F1] border border-0.5 sm:border-1 lg:border-1.5 xl:border-2 border-[#3D37F1] rounded-lg md:rounded-xl flex justify-center items-center hover:bg-[#3D37F1] text-sm sm:text-base lg:text-lg xl:text-lg hover:text-white font-semibold" style="box-shadow: 0px 18px 47px 0px rgba(0, 0, 0, 0.1);">See All Events</RouterLink>
        </div>
        <div class="h-17 sm:h-55 xl:h-60 mt-17 lg:mt-50 bg-purple-500">
            <div class="w-[95%] lg:w-[90%] xl:w-[75%] h-full relative left-1/2 -translate-x-1/2 flex justify-between items-end overflow-y-visible">
                <img src="@/assets/images/image-3.png" alt="" class="h-30 lg:h-100 self-end">
                <div class="w-[40%] lg:w-fit h-fit self-center flex flex-col items-center text-white text-center lg:text-start">
                    <h2 class="!text-sm lg:!text-2xl xl:!text-2xl !text-white !m-0">Add Your Loving Event</h2>
                    <RouterLink to="/" class="sm:mt-3 px-2 lg:px-4 py-1 lg:py-2 rounded-sm lg:rounded-md text-xs sm:text-sm lg:text-base xl:text-lg" style="background-color:#F5167E">View all events</RouterLink>
                </div>
            </div>
        </div>
    </section>
    <section class="relative mt-10 mb-15 lg:mb-20">
        <img src="@/assets/images/cele-2.png" alt="" class="absolute top-1/2 -translate-y-1/2 -left-[29.5%] w-[75%] h-[75%] -z-1 object-cover opacity-30"/>
        <div class="w-[95%] mx-auto">
            <h2 class="w-fit mt-5 !mb-1.25 phone:!mb-1.75 sm:!mb-2 lg:mb-3 mx-auto lg:mx-0 !text-lg sm:!text-xl md:!text-2xl lg:!text-3xl xl:!text-4xl font-semibold text-[#242565]">Past Events</h2>
            <CustomCardWithSkeletonComponent v-if="local.past_events" :metaData="metaDataPast" :inpData="local.past_events" :paralelRender="2">
                <template #skeleton="{ index, skeletonRefs }">
                    <div :ref="el => skeletonRefs[index] = el" class="skeleton-wrapper absolute z-10 left-0 w-full h-full flex flex-col items-center transition-opacity duration-100">
                        <Skeleton :pt="{ root: { class: ['!w-full !h-[57%] lg:h-[65%] !rounded-lg'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                        <div class="w-[97%] mt-3.5 lg:mt-1.5 mx-auto">
                            <Skeleton :pt="{ root: { class: ['!h-4 lg:h-6 !rounded-sm'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                            <Skeleton :pt="{ root: { class: ['!h-4 lg:h-6 mt-1 lg:mt-1.5 !rounded-md'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                            <Skeleton :pt="{ root: { class: ['!h-6.5 lg:h-11 mt-1.5 lg:mt-2 !rounded-lg'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                        </div>
                    </div>
                </template>
                <template #card="{ index, inpData, toggleSkeleton, cardRefs }">
                    <Card :ref="el => cardRefs[index] =  (el as ComponentPublicInstance)?.$el" :pt="{ root: { class: ['!h-full rounded-md lg:rounded-[20px] overflow-hidden opacity-0 transition-opacity duration-100'], style: 'box-shadow: 0px 18px 47px 0px rgba(0, 0, 0, 0.1);' }, body: { class: ['!gap-1 !p-4 lg:!p-5 xl:!px-7 xl:!py-5'] }}">
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
                                <RouterLink :to="'/event/' + inpData.event_id" class="text-sm sm:text-base lg:text-lg xl:text-xl font:medium lg:font-semibold">{{ inpData.event_name }}</RouterLink>
                                <span class="text-xs sm:text-sm lg:text-base xl:text-lg">{{ inpData.start_date }}</span>
                            </div>
                        </template>
                    </Card>
                </template>
            </CustomCardWithSkeletonComponent>
            <CustomCardWithSkeletonComponent v-else :metaData="metaDataEventLoading" :paralelRender="Infinity" :isLoading="true">
                <div class="skeleton-wrapper flex-1 flex flex-col items-center">
                    <Skeleton :pt="{ root: { class: ['!w-full !h-[120px] phone:!h-[170px] lg:!h-[197px] flex-1 !rounded-lg'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                    <div class="w-[97%] mt-3.5 lg:mt-1.5 mx-auto">
                        <Skeleton :pt="{ root: { class: ['!h-4 lg:h-6 !rounded-sm'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                        <Skeleton :pt="{ root: { class: ['!h-4 lg:h-6 mt-1 lg:mt-1.5 !rounded-md'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                        <Skeleton :pt="{ root: { class: ['!h-6.5 lg:h-11 mt-1.5 lg:mt-2 !rounded-lg'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                    </div>
                </div>
            </CustomCardWithSkeletonComponent>
            <RouterLink to="/event" class="relative left-1/2 -translate-x-1/2 w-fit h-fit mt-5 lg:mt-10 px-3 py-2 sm:px-3.25 sm:py-2.25 lg:px-3.5 lg:py-2.5 text-[#3D37F1] border border-0.5 sm:border-1 lg:border-1.5 xl:border-2 border-[#3D37F1] rounded-lg md:rounded-xl flex justify-center items-center hover:bg-[#3D37F1] text-sm sm:text-base lg:text-lg xl:text-lg hover:text-white font-semibold" style="box-shadow: 0px 18px 47px 0px rgba(0, 0, 0, 0.1);">Load More</RouterLink>
        </div>
        <div class="w-[90%] lg:w-[95%] xl:w-[97%] mx-auto mt-20 lg:mt-50">
            <h2 class="w-fit !m-0 mx-auto !text-lg sm:!text-xl md:!text-2xl lg:!text-3xl xl:!text-4xl font-semibold text-[#242565]">Reviews About Us</h2>
            <p class="w-fit mx-auto text-sm sm:text-text-base md:text-lg lg:text-xl xl:text-2xl text-center text-[#242565]">See what our amazing customers have to say about us!</p>
            <CustomCardWithSkeletonComponent v-if="local.reviews" :metaData="metaDataReviews" :inpData="local.reviews" :paralelRender="1">
                <template #skeleton="{ index, skeletonRefs }">
                    <div :ref="el => skeletonRefs[index] = el" class="skeleton-wrapper absolute z-10 top-0 left-0 flex flex-col w-full h-full transition-opacity duration-100">
                        <Skeleton :pt="{ root: { class: ['!h-16 sm:!h-19 lg:!h-22 xl:!h-25.5 !rounded-lg'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                        <Skeleton :pt="{ root: { class: ['!flex-1 !rounded-sm mt-1.25 sm:mt-2.25 lg:!mt-3.5'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                    </div>
                </template>
                <template #card="{ index, inpData, toggleSkeleton, cardRefs }">
                    <Card :ref="el => cardRefs[index] =  (el as ComponentPublicInstance)?.$el" :pt="{ root: { class: ['relative opacity-0 transition-opacity duration-100 rounded-xl flex flex-col gap-2'], style: 'box-shadow: 0px 18px 47px 0px rgba(0, 0, 0, 0.1);' }, body: { class: ['!p-3 lg:!p-4 xl:!p-5']}}">
                        <template #content>
                            <div class="flex items-center gap-3 xl:gap-3">
                                <div class="relative right-0 size-10 sm:size-15 xl:size-15 wrounded-full pointer-events-none">
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
                                            <I_FullStar v-if="i <= Math.floor(inpData.rating)" class="size-4 sm:size-5 lg:size-6 xl:size-7 text-yellow-500"/>
                                            <I_HalfStar v-else-if="i === Math.ceil(inpData.rating) && inpData.rating % 1 >= 0.5" class="size-[15.5px] sm:size-[19px] lg:size-[23px] xl:size-[27px] text-yellow-500"/>
                                            <I_EmptyStar v-else class="size-4 sm:size-5 lg:size-6 xl:size-7 text-yellow-500"/>
                                        </template>
                                    </div>
                                    <h5 class=" !m-0 text-sm sm:text-base lg:text-lg xl:text-xl font-semibold">{{ inpData.name }}</h5>
                                    <span class="text-xs sm:text-sm lg:text-base xl:text-lg">{{ inpData.date_review }}</span>
                                </div>
                            </div>
                            <p class="!mt-1.5 sm:!mt-2 lg:!mt-3 text-xs sm:text-sm lg:text-base xl:text-lg">{{ inpData.comment }} Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea autem reiciendis maiores eligendi culpa, maxime qui non perferendis, cupiditate fuga nemo, quis ut alias omnis fugiat dolorem modi perspiciatis quos!</p>
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
                <div class="skeleton-wrapper flex-1 flex flex-col items-center">
                    <Skeleton :pt="{ root: { class: ['flex-1 !rounded-lg'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                    <div class="w-[97%] mt-3.5 lg:mt-1.5 mx-auto">
                        <Skeleton :pt="{ root: { class: ['!h-4 lg:h-6 !rounded-sm'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                        <Skeleton :pt="{ root: { class: ['!h-4 lg:h-6 mt-1 lg:mt-1.5 !rounded-md'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                        <Skeleton :pt="{ root: { class: ['!h-6.5 lg:h-11 mt-1.5 lg:mt-2 !rounded-lg'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                    </div>
                </div>
            </CustomCardWithSkeletonComponent>
        </div>
    </section>
</template>