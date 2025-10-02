<script setup lang="ts">
import { defineComponent, h, useSlots, type ComponentPublicInstance } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { getImgURL } from '@/utils/global'
import CustomCardWithSkeletonComponent from '@/components/CustomCardWithSkeleton.vue'
import I_LocationCard from '@/assets/icons/card_events/location.svg?component'
import I_Bookmark from '@/assets/icons/card_events/bookmark.svg?component'
import freeTag from '@/assets/images/free-tag.png'
const props = defineProps<{
    all_events: [],
}>()
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
    <section class="relative overflow-x-clip">
        <img src="@/assets/images/cele-3.png" alt="" class="absolute bottom-0 -right-[29.5%] w-[75%] h-[75%] -z-1 object-cover opacity-30"/>
        <div class="w-[90%] mt-7 xl::mt-5 lg:mt-10 mx-auto">
            <div class="">
                <h2 class="w-fit mt- mx-auto lg:mx-0 text-base sm:text-lg lg:text-xl xl:text-2xl font-semibold text-[#242565]">More Details</h2>
                <p class="lg:mt-2 ml-7 text-sm sm:text-base lg:text-lg xl:text-xl">
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
                        <h2 class="w-fit mx-auto lg:mx-0 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold">Popular Events</h2>
                        <p>see other events</p>
                    </div>
                    <CustomCardWithSkeletonComponent v-if="props.all_events && props.all_events.length > 0" :metaData="metaDataPopuler" :inpData="props.all_events" :paralelRender="1">
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