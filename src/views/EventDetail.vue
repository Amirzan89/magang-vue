<script setup lang="ts">
import { reactive, onBeforeMount, defineComponent, useSlots, h, type ComponentPublicInstance } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useFetchDataStore } from '@/stores/FetchData'
import { getImgURL } from '@/utils/global'
import CustomCardWithSkeletonComponent from '@/components/CustomCardWithSkeleton.vue'
import I_Location from '@/assets/icons/detail_event/location.svg?component'
import I_Date from '@/assets/icons/detail_event/date.svg?component'
import I_Ticket from '@/assets/icons/detail_event/ticket.svg?component'
import I_LocationCard from '@/assets/icons/card_events/location.svg?component'
import I_Bookmark from '@/assets/icons/card_events/bookmark.svg?component'
import freeTag from '@/assets/images/free-tag.png';
const fetchDataS = useFetchDataStore()
const local = reactive({
    event_detail: null as any,
    all_events: null as any,
    inpSearch: '',
    isLoading: false,
})
onBeforeMount(async() =>{
    const res = (await fetchDataS.fetchPage(useRoute().path, {}))
    if(res ==  undefined || res.status == 'error'){
        return
    }
    console.log('enttokk dataa ', res.data)
    local.event_detail = res.data.event_detail
    local.all_events = res.data.all_events
})
const metaDataPopuler = {
    wrapper: () => defineComponent({
        setup(){
            const slots = useSlots()
            return () => {
                return h('div', { class: 'relative h-100' }, {
                    default: () => slots.default ? slots.default() : null
                });
            }
        }
    }),
    customTWTransition: 'mt-1.5 lg:mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 lg:gap-4',
}
</script>
<template>
    <section class="relative">
        <div>
            <!-- <h3>EXMOS 2025</h3> -->
            <!-- <h3>{{ local.event_detail.name_event }}</h3> -->
            <!-- <h3>{{ local.event_detail.description_event }}</h3> -->
            <!-- <p>{{ local.event_detail.description_event }}</p> -->
            <div class="flex">
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
                    <p>{{ local.event_detail. }}</p>
                    <p>{{ local.event_detail. }}</p>
                    <p>{{ local.event_detail.price }}</p>
                </div>
            </div>
            <div>
                <a :href="local.event_detail.link_event" target="_blank" rel="noopener noreferrer">
                    <Button>Book Event</Button>
                </a>
                <a :href="local.event_detail.price.detail_event" target="_blank" rel="noopener noreferrer">
                    <Button>Learn More</Button>
                </a>
            </div>
        </div>
    </section>
    <section>
        <h3>More Details</h3>
        <p>
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
    </section>
    <section class="relative flex flex-col mt-5 mb-10">
        <div class="w-[95%] mx-auto">
            <div class="mx-auto flex flex-col justify-center items-center">
                <h2 class="w-fit mx-auto lg:mx-0 text-xl xl:text-3xl font-bold">Popular Events</h2>
                <p>see other events</p>
            </div>
            <CustomCardWithSkeletonComponent :metaData="metaDataPopuler" :inpData="local.all_events" :paralelRender="1">
                <template #skeleton="{ index, skeletonRefs }">
                    <div :ref="el => skeletonRefs[index] = el" class="skeleton-wrapper absolute z-10 top-0 left-0 flex flex-col w-full h-full">
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
                            <img :src="freeTag" alt="" class="absolute top-0 right-0 z-9 h-[20%]">
                            <div class="w-[87%] mx-auto flex flex-col mt-2">
                                <div class="flex flex-col text-black">
                                    <!-- <div class="flex flex-col">
                                        <span class="text-[#3D37F1] font-bold text-base">May</span>
                                        <span class="text-black text-xl">11</span>
                                    </div> -->
                                    <RouterLink :to="'/events/' + inpData.event_id" class="text-base sm:text-lg font-medium">{{ inpData.event_name }}</RouterLink>
                                    <span class="text-sm sm:text-lg">{{ inpData.start_date }}</span>
                                </div>
                                <!-- <div class="flex flex-col text-xl">
                                    <div class="flex gap-2 items-center">
                                    <I_DRight class="w-5 h-5 text-red-500" />
                                    <span>Musical Event</span>
                                    </div>
                                    <div class="flex gap-2 items-center">
                                    <I_DRight class="w-5 h-5 text-red-500" />
                                    <span>All Universities students can join</span>
                                    </div>
                                </div> -->
                                <div class="flex justify-between items-center mt-3">
                                    <a :href="inpData.link_lokasi" target="_blank" rel="noopener noreferrer"><I_LocationCard class="w-5 h-5 sm:w-8 sm:h-8 text-black"/></a>
                                    <span class="text-base">{{ inpData.nama_lokasi }}</span>
                                    <I_Bookmark class="w-5 h-5 sm:w-8 sm:h-8 text-black" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </template>
            </CustomCardWithSkeletonComponent>
            <RouterLink to="/events" class="relative left-1/2 -translate-x-1/2 w-[30%] xs:w-[32%] xl:w-[11%] 2xl:w-[10%] h-7 xs:h-11 xl:h-12 mt-5 lg:mt-10 text-[#3D37F1] border xl:border-2 border-[#3D37F1] lg:px-0 lg:py-2 rounded-lg lg:rounded-2xl xl:rounded-xl flex justify-center items-center hover:bg-[#3D37F1] text-xs lg:text-xl hover:text-white font-semibold" style="box-shadow: 0px 18px 47px 0px rgba(0, 0, 0, 0.1);">Load More</RouterLink>
        </div>
    </section>
</template>
<style scoped>
</style>