<script setup lang="ts">
import { defineComponent, h, useSlots, type ComponentPublicInstance } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { getImgURL } from '@/utils/global'
import CustomCardWithSkeletonComponent from '@/components/CustomCardWithSkeleton.vue'
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
    customTWTransition: 'mt-1.5 phone:mt-2.5 sm:mt-4 lg:mt-3 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5',
    snapshots: {
        base: 3,
        sm: 2,
        md: 1,
    },
}
const metaDataLoading = {
    customTWTransition: 'mt-1.5 phone:mt-2.5 sm:mt-4 lg:mt-3 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5',
    snapshots: {
        base: 3,
        sm: 2,
        md: 1,
    },
}
</script>
<template>
    <section class="relative overflow-x-clip">
        <div class="w-[90%] relative flex flex-col mt-7 xl::mt-5 lg:mt-10 mb-10 xl:mb-30 mx-auto">
            <div class="w-[95%] mx-auto">
                <div class="mx-auto flex flex-col justify-center items-center">
                    <h2 class="w-fit !m-0 mx-auto lg:mx-0 !text-lg sm:!text-xl md:!text-2xl lg:!text-3xl xl:!text-4xl font-semibold">Popular Events</h2>
                    <p class="!m-0 !text-sm sm:!text-base md:!text-lg lg:!text-xl xl:!text-3xl">see other events</p>
                </div>
                <CustomCardWithSkeletonComponent v-if="props.all_events && props.all_events.length > 0" :metaData="metaDataPopuler" :inpData="props.all_events" :paralelRender="1">
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
                <CustomCardWithSkeletonComponent v-else :metaData="metaDataLoading" :paralelRender="Infinity" :isLoading="true">
                    <div class="skeleton-wrapper flex flex-col items-center">
                        <Skeleton :pt="{ root: { class: ['!w-[103%] sm:!w-[102.5%] !h-[123px] phone:!h-[172px] lg:!h-[200px] !rounded-lg relative -left-[0.25%] -top-[1%]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                        <div class="w-full p-3.75 lg:p-4.75 xl:px-6.75 xl:py-4.75 mx-auto flex flex-col">
                            <Skeleton :pt="{ root: { class: ['!h-[13px] sm:!h-[16.75px] lg:!h-[17px] xl:!h-[18px] 2xl:!h-[20px] !rounded-[3px] sm:!rounded-[4px] lg:!rounded-[5px]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                            <Skeleton :pt="{ root: { class: ['!h-[13px] sm:!h-[16.75px] lg:!h-[17px] xl:!h-[18px] 2xl:!h-[20px] mt-1 lg:mt-1.5 !rounded-[3px] sm:!rounded-[4px] lg:!rounded-[5px]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                            <Skeleton :pt="{ root: { class: ['!w-[92px] xs:!w-[92px] phone:!w-[110px] sm:!w-[112px] lg:!w-[127px] xl:!w-[157px] 2xl:!w-[160px] !h-[14px] sm:!h-[15.5px] lg:!h-[18px] xl:!h-[18px] 2xl:!h-[20px] mt-1.5 sm:mt-1 lg:mt-2 !rounded-[3px] sm:!rounded-[4px] lg:!rounded-[5px]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                        </div>
                    </div>
                </CustomCardWithSkeletonComponent>
                <Button variant="outlined" as="a" href="/events" target="_blank" rel="noopener noreferrer" class="relative left-1/2 -translate-x-1/2 w-fit mt-5 sm:mt-7.5 lg:mt-10 !px-2 sm:!px-3 lg:!px-4 !py-1 sm!py-1.5 lg:!py-2 !text-[#3D37F1] hover:!text-white !border-[#3D37F1] hover:!bg-[#3D37F1] !text-sm sm:!text-base lg:!text-lg xl:!text-xl">Learn More</Button>
            </div>
        </div>
    </section>
</template>