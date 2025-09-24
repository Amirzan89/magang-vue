<script setup lang="ts">
import { ref, reactive, onBeforeMount, markRaw, h, useSlots, defineComponent, type ComponentPublicInstance } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { useConfig } from '@/composables/useConfig'
import { useFetchDataStore } from '@/stores/FetchData'
import { getImgURL } from '@/utils/global'
import CustomCardWithSkeletonComponent from '@/components/CustomCardWithSkeleton.vue'
import I_VLeft from '@/assets/icons/hero_home/vector-left.svg?component'
import I_VRight from '@/assets/icons/hero_home/vector-right.svg?component'
import I_music from '@/assets/icons/hero_home/music_note.svg?component'
import I_conferences from '@/assets/icons/hero_home/conferences.svg?component'
import I_celebration from '@/assets/icons/hero_home/celebration.svg?component'
import I_games from '@/assets/icons/hero_home/games.svg?component'
import I_DRight from '@/assets/icons/card_events/double-right.svg?component'
import I_Location from '@/assets/icons/card_events/location.svg?component'
import I_Bookmark from '@/assets/icons/card_events/bookmark.svg?component'
import I_FullStar from '@/assets/icons/reviews/full-star.svg?component'
import I_HalfStar from '@/assets/icons/reviews/half-star.svg?component'
import I_EmptyStar from '@/assets/icons/reviews/empty-star.svg?component'
import I_Plus from '@/assets/icons/reviews/plus.svg?component'
import freeTag from '@/assets/images/free-tag.png';
import defaultBoy from '@/assets/images/default_boy.jpg'
import defaultGirl from '@/assets/images/default_girl.png'
const publicConfig = useConfig()
const fetchDataS = useFetchDataStore()
const totalItemsCar = ref(0)
const selectedIndex = ref(0)
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
})
const activeIndex = ref(0)
const onSlideChange = (swiper: any) => {
    activeIndex.value = swiper.realIndex
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
    customTWTransition: 'h-full mt-1.5 lg:mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 lg:gap-4',
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
    customTWTransition: 'h-full mt-1.5 lg:mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 lg:gap-4',
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
}
</script>
<template>
    <section class="relative lg:h-screen pt-16">
        <div class="absolute top-0 left-0 w-full h-full -z-1">
            <img src="@/assets/images/party-1.png" alt="" class="w-full object-cover" />
            <div class="absolute top-0 left-0 w-full h-full opacity-90" style="background-image:linear-gradient(156deg, #ed4690 0%, #5522cc 111.39%)"></div>
        </div>
        <div class="relative z-10 flex flex-col justify-center gap-24 items-center h-full text-white">
            <div class="w-[90%] lg:w-[92%] aspect-video lg:aspect-auto h-3/4">
                <Swiper v-if="local.upcoming_events && local.upcoming_events.length > 0" :modules="[Navigation, Pagination, Autoplay]" :slides-per-view="1" :space-between="20" :loop="true" :autoplay="{ delay: 3000 }" :pagination="{ clickable: true }" :allow-touch-move="false" :simulate-touch="false" :keyboard="{ enabled: false }" :mousewheel="{ enabled: false }" :navigation="{ nextEl: '.btn-next', prevEl: '.btn-prev' }" class="relative left-1/2 -translate-x-1/2 rounded-xl h-full bg-green-500"  @slideChange="onSlideChange">
                    <template v-for="(item, index) in local.upcoming_events" :key="index">
                        <SwiperSlide><img :src="item.img" alt="" class="w-full object-contain"></SwiperSlide>
                    </template>
                    <div class="absolute z-2 w-full h-full top-0 left-0 backdrop-blur-[1px]">
                        <div class="absolute z-3 w-full h-full top-0 left-0 opacity-70" style="background: #5420B4; background: linear-gradient(45deg,rgba(84, 32, 180, 1) 100%, rgba(0, 0, 0, 1) 13%);"></div>
                        <div class="relative z-4 w-[75%] h-full mx-auto flex justify-between items-center">
                            <div class="lg:w-[40%] 2xl:w-[30%] h-fit flex justify-around items-center ">
                                <I_VLeft class="btn-prev size-8"/>
                                <div class="w-[90%] h- ">
                                    <h4 class="text-4xl">{{ local.upcoming_events[activeIndex].event_name }}</h4>
                                    <Button :as="RouterLink" :to="'/events/' + local.upcoming_events[activeIndex]!.link_event" severity="secondary" class="w-fit h-fit">Learn More</Button>
                                </div>
                                <I_VRight class="btn-next size-8"/>
                            </div>
                            <div class="lg:w-[30%] 2xl:w-[30%] h-[40%]">
                                <h4 class="text-4xl">Uni Events</h4>
                                <p class="">Stay updated with the latest academic talks, workshops, and social gatherings across Sri Lankan universities. Whether you're here to network, learn, or have fun, there’s something for everyone!</p>
                                <Button :as="RouterLink" to="/about" severity="danger">About US</Button>
                            </div>
                        </div>
                    </div>
                </Swiper>
            </div>
            <ul class="phone:w-[75%] lg:w-fit mb-5 grid grid-cols-2 gap-4 phone:flex phone:justify-around phone:gap-0 xl:gap-25 text-white">
            <!-- <ul class="w-[87%] flex justify-around text-white bg-red-500"> -->
                <template v-for="(item, index) in catHero" :key="index">
                    <li class="flex flex-col items-center gap-1 xl:gap-3">
                        <div class="bg-white inline-flex justify-center items-center rounded-full w-fit">
                            <component :is="item.icon" class="size-7 phone:size-8 xl:size-10 m-2.75 phone:m-2.5 xl:m-5"></component>
                        </div>
                        <span class="block text-center text-base xl:text-xl font-medium">{{ item.name }}</span>
                    </li>
                </template>
            </ul>
        </div>
    </section>
    <!-- CARDS / UPCOMING -->
    <section class="relative flex flex-col">
        <div class="w-[90%] mx-auto h-fit">
            <h2 class="w-fit mt-5 mx-auto lg:mx-0 text-xl xl:text-3xl font-bold">Upcoming Events</h2>
            <CustomCardWithSkeletonComponent :metaData="metaDataUpcoming" :inpData="local.upcoming_events" :paralelRender="2">
                <template #skeleton="{ index, skeletonRefs }">
                    <div :ref="el => skeletonRefs[index] = el" class="skeleton-wrapper absolute z-10 top-0 left-0 flex flex-col w-full h-full transition-opacity duration-100">
                        <Skeleton :pt="{ root: { class: ['!h-[65%] !rounded-lg ]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                        <div class="w-[97%] mt-1.5 mx-auto">
                            <Skeleton :pt="{ root: { class: ['!h-6 !rounded-sm ]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                            <Skeleton :pt="{ root: { class: ['!h-6 mt-1.5 !rounded-md ]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                            <Skeleton :pt="{ root: { class: ['!h-11 mt-2 !rounded-lg ]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                        </div>
                    </div>
                </template>
                <template #card="{ index, inpData, toggleSkeleton, cardRefs }">
                    <Card :ref="el => cardRefs[index] =  (el as ComponentPublicInstance)?.$el" class="h-full pt-0 pb-0 rounded-md lg:rounded-[20px] overflow-hidden opacity-0 transition-opacity duration-100" :pt="{ root: { style: 'box-shadow: 0px 18px 47px 0px rgba(0, 0, 0, 0.1);' }, footer: { class: 'flex justify-between items-center mt-3' }}">
                        <template #header>
                            <img :src="getImgURL(inpData.img)" alt="" class="w-full h-[170px] lg:h-[197px] object-cover" :ref="((el: any) => {
                                    if(el?.complete && el.naturalWidth !== 0 && !inpData.imgLoad) toggleSkeleton(index)
                                })"
                                @load="() => {
                                    inpData.imgLoad = true
                                    toggleSkeleton(index)
                                }" @error="() => toggleSkeleton(index)"/>
                            <img :src="freeTag" alt="" class="absolute top-0 right-0 z-9 h-[20%]">
                        </template>
                        <template #title>{{ inpData.event_name }}</template>
                        <template #subtitle>{{ inpData.start_date }}</template>
                        <template #footer>
                            <a :href="inpData.link_lokasi" target="_blank" rel="noopener noreferrer"><I_Location class="w-5 h-5 sm:w-8 sm:h-8 text-green-500"/></a>
                            <span class="text-base">{{ inpData.nama_lokasi }}</span>
                            <I_Bookmark class="w-5 h-5 sm:w-8 sm:h-8 text-green-500"/>
                        </template>
                    </Card>
                </template>
            </CustomCardWithSkeletonComponent>
            <RouterLink to="/events" class="relative left-1/2 -translate-x-1/2 w-[30%] xs:w-[32%] xl:w-[11%] 2xl:w-[10%] h-7 xs:h-11 xl:h-12 mt-5 lg:mt-10 text-[#3D37F1] border xl:border-2 border-[#3D37F1] lg:px-0 lg:py-2 rounded-lg lg:rounded-2xl xl:rounded-xl flex justify-center items-center hover:bg-[#3D37F1] text-xs lg:text-xl hover:text-white font-semibold" style="box-shadow: 0px 18px 47px 0px rgba(0, 0, 0, 0.1);">See All Events</RouterLink>
        </div>
        <div class="h-17 sm:h-55 xl:h-60 mt-17 lg:mt-50 bg-purple-500">
            <div class="w-[95%] lg:w-[90%] xl:w-[75%] h-full relative left-1/2 -translate-x-1/2 flex justify-between items-end overflow-y-visible">
                <img src="@/assets/images/image-3.png" alt="" class="h-30 lg:h-100 self-end">
                <div class="w-[40%] lg:w-fit h-fit self-center flex flex-col items-center text-white text-center lg:text-start">
                    <h2 class="text-sm lg:text-2xl xl:text-2xl">Add Your Loving Event</h2>
                    <!-- <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p> -->
                    <RouterLink to="/" class="mt-3 px-2 lg:px-4 py-1 lg:py-2 rounded-sm lg:rounded-md text-xs xl:text-lg 2xl:text-xl" style="background-color:#F5167E">View all events</RouterLink>
                </div>
            </div>
        </div>
    </section>
    <section class="relative mt-10">
        <div class="w-[95%] mx-auto">
            <h2 class="w-fit mt-5 mx-auto lg:mx-0 text-xl xl:text-3xl font-bold">Past Events</h2>
            <CustomCardWithSkeletonComponent :metaData="metaDataPast" :inpData="local.past_events" :paralelRender="4">
                <template #skeleton="{ index, skeletonRefs }">
                    <div :ref="el => skeletonRefs[index] = el" class="skeleton-wrapper absolute z-10 top-0 left-0 flex flex-col w-full h-full transition-opacity duration-100">
                        <Skeleton :pt="{ root: { class: ['!h-[65%] !rounded-lg ]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                        <div class="w-[97%] mt-1.5 mx-auto">
                            <Skeleton :pt="{ root: { class: ['!h-6 !rounded-sm ]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                            <Skeleton :pt="{ root: { class: ['!h-6 mt-1.5 !rounded-md ]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                            <Skeleton :pt="{ root: { class: ['!h-11 mt-2 !rounded-lg ]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                        </div>
                    </div>
                </template>
                <template #card="{ index, inpData, toggleSkeleton, cardRefs }">
                    <Card :ref="el => cardRefs[index] =  (el as ComponentPublicInstance)?.$el" class="h-full pt-0 pb-0 rounded-md lg:rounded-[20px] overflow-hidden opacity-0 transition-opacity duration-100" :pt="{ root: { style: 'box-shadow: 0px 18px 47px 0px rgba(0, 0, 0, 0.1);' }, footer: { class: 'flex justify-between items-center mt-3' }}">
                        <template #header>
                            <img :src="getImgURL(inpData.img)" alt="" class="w-full h-[170px] lg:h-[197px] object-cover" :ref="((el: any) => {
                                    if(el?.complete && el.naturalWidth !== 0 && !inpData.imgLoad) toggleSkeleton(index)
                                })"
                                @load="() => {
                                    inpData.imgLoad = true
                                    toggleSkeleton(index)
                                }" @error="() => toggleSkeleton(index)"/>
                            <img :src="freeTag" alt="" class="absolute top-0 right-0 z-9 h-[20%]">
                        </template>
                        <template #title>{{ inpData.event_name }}</template>
                        <template #subtitle>{{ inpData.start_date }}</template>
                        <template #footer>
                            <a :href="inpData.link_lokasi" target="_blank" rel="noopener noreferrer"><I_Location class="w-5 h-5 sm:w-8 sm:h-8 text-green-500"/></a>
                            <span class="text-base">{{ inpData.nama_lokasi }}</span>
                            <I_Bookmark class="w-5 h-5 sm:w-8 sm:h-8 text-green-500" />
                        </template>
                    </Card>
                </template>
            </CustomCardWithSkeletonComponent>
            <RouterLink to="/events" class="relative left-1/2 -translate-x-1/2 w-[30%] xs:w-[32%] xl:w-[11%] 2xl:w-[8%] h-7 xs:h-11 xl:h-12 mt-5 lg:mt-10 text-[#3D37F1] border xl:border-2 border-[#3D37F1] lg:px-0 lg:py-2 rounded-lg lg:rounded-2xl xl:rounded-xl flex justify-center items-center hover:bg-[#3D37F1] text-xs lg:text-xl hover:text-white font-semibold" style="box-shadow: 0px 18px 47px 0px rgba(0, 0, 0, 0.1);">Load More</RouterLink>
        </div>
    </section>
    <section class="relative mt-20 lg:mt-50 mb-15 lg:mb-20">
        <div class="w-[90%] lg:w-[95%] xl:w-[97%] mx-auto">
            <h2 class="w-fit mx-auto text-lg lg:text-3xl font-semibold text-[#242565]">Reviews About Us</h2>
            <p class="w-fit mx-auto text-sm lg:text-xl text-center text-[#242565]">See what our amazing customers have to say about us!</p>
            <CustomCardWithSkeletonComponent :metaData="metaDataReviews" :inpData="local.reviews" :paralelRender="1">
                <template #skeleton="{ index, skeletonRefs }">
                    <div :ref="el => skeletonRefs[index] = el" class="skeleton-wrapper absolute z-10 top-0 left-0 flex flex-col w-full h-full transition-opacity duration-100">
                        <Skeleton :pt="{ root: { class: ['!h-[65%] !rounded-lg ]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                        <div class="w-[97%] mt-1.5 mx-auto">
                            <Skeleton :pt="{ root: { class: ['!h-6 !rounded-sm ]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                            <Skeleton :pt="{ root: { class: ['!h-6 mt-1.5 !rounded-md ]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                            <Skeleton :pt="{ root: { class: ['!h-11 mt-2 !rounded-lg ]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                        </div>
                    </div>
                </template>
                <template #card="{ index, inpData, toggleSkeleton, cardRefs }">
                    <Card :ref="el => cardRefs[index] =  (el as ComponentPublicInstance)?.$el" class="lg:h-50 opacity-0 transition-opacity duration-100" :pt="{ root: { style: 'box-shadow: 0px 18px 47px 0px rgba(0, 0, 0, 0.1);' }}">
                        <template #header>
                            <div class="relative right-0 size-15 xl:size-15 wrounded-full pointer-events-none">
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
                            <div>
                                <div class="flex">
                                    <template v-for="i in 5" :key="i">
                                        <I_FullStar v-if="i <= Math.floor(inpData.rating)" class="size-4 sm:size-5 xl:size-6 text-yellow-500"/>
                                        <I_HalfStar v-else-if="i === Math.ceil(inpData.rating) && inpData.rating % 1 >= 0.5" class="size-3.5 sm:size-6 xl:size-6 text-yellow-500"/>
                                        <I_EmptyStar v-else class="size-4 sm:size-5 xl:size-6 text-yellow-500"/>
                                    </template>
                                </div>
                                <h5 class="text-base xl:text-xl font-semibold">{{ inpData.name }}</h5>
                                <span class="text-xs xl:text-base lg:text-lg">{{ inpData.date_review }}</span>
                            </div>
                        </template>
                        <template #content>{{ inpData.comment }}</template>
                    </Card>
                </template>
                <template #placeholder-card>
                    <Card class="lg:h-50" style="box-shadow: 0px 18px 47px 0px rgba(0, 0, 0, 0.1);">
                        <template #content>
                            <I_Plus class="size-9 sm:size-10"/>
                            <p class="text-base xl:text-lg font-medium">Add Yours</p>
                        </template>
                    </Card>
                </template>
            </CustomCardWithSkeletonComponent>
        </div>
    </section>
</template>
<style scoped>
</style>