<script setup lang="ts">
import { ref, reactive, onBeforeMount, defineComponent, h, useSlots, type ComponentPublicInstance } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useConfig } from '@/composables/useConfig'
import { useFetchDataStore } from '@/stores/FetchData'
import CustomCardWithSkeletonComponent from '@/components/CustomCardWithSkeleton.vue'
import I_FullStar from '@/assets/icons/reviews/full-star.svg?component'
import I_HalfStar from '@/assets/icons/reviews/half-star.svg?component'
import I_EmptyStar from '@/assets/icons/reviews/empty-star.svg?component'
import defaultBoy from '@/assets/images/default_boy.jpg'
import defaultGirl from '@/assets/images/default_girl.png'
const publicConfig = useConfig()
const fetchDataS = useFetchDataStore()
const local = reactive({
    contributors: null as any,
    reviews: null as any,
})
onBeforeMount(async() =>{
    const res = await fetchDataS.fetchPage(useRoute().path, {})
    if(res ==  undefined || res.status == 'error'){
        return
    }
    console.log('enttokk dataa ', res.data)
    local.contributors = res.data.contributors
    local.reviews = res.data.reviews
})
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
    <section class="flex justify-center items-center">
            <h1>About Us</h1>
    </section>
    <section class="h-screen flex flex-col items-center">
        <img src="@/assets/images/cele-2.png" alt="" class="absolute top-1/2 -translate-y-1/2 -left-[29.5%] w-[75%] h-[75%] -z-1 object-cover opacity-30"/>
        <div>
            <h2>What We Offer</h2>
            <div class="h-fit flex gap-10">
                <div class="h-full flex flex-col">
                    <h4>Free Events</h4>
                    <h4>Event Booking</h4>
                    <h4>Event Profil</h4>
                    <h4>Explore & Discover</h4>
                </div>
                <div class="h-fit flex flex-col">
                    <p>Discover a wide variety of free events happening at universities across Sri Lanka, from academic seminars to fun social gatherings.</p>
                    <p>Reserve your spot for events directly through our platform. Whether it’s a workshop, a guest lecture, or a social event, booking is quick and easy.</p>
                    <p>Create your profile to track events you’ve registered for, manage your bookings, and add your favorite events to keep them handy.</p>
                    <p>Browse through a diverse range of events, filter them by categories or dates, and never miss out on something interesting happening at your university or beyond.</p>
                </div>
            </div>
        </div>
        <div>
            <h2 class="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold">Our Contributors</h2>
            <div class="grid grid-cols-1 phone:grid-cols-2 lg:grid-cols-3">
                <template v-for="item in local.contributors">
                    <img :src="item" alt="" class="w-full">
                </template>
                </div>
        </div>
        <div class="flex flex-col items-center">
            <h2 class="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold">Join Us</h2>
            <p class="mt-3">At [Your Organization Name], we’re more than just a group—we’re a movement. Joining us means becoming a part of a passionate and vibrant community united by shared values and a vision for the future. Together, we strive to make an impact, drive innovation, and create opportunities that matter.</p>
            <CustomCardWithSkeletonComponent :metaData="metaDataReviews" :inpData="local.reviews" :paralelRender="1">
                <template #skeleton="{ index, skeletonRefs }">
                    <div :ref="el => skeletonRefs[index] = el" class="skeleton-wrapper absolute z-10 top-0 left-0 flex flex-col w-full h-full transition-opacity duration-100">
                        <Skeleton :pt="{ root: { class: ['!h-16 sm:!h-19 lg:!h-22 xl:!h-25.5 !rounded-lg ]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                        <Skeleton :pt="{ root: { class: ['!flex-1 !rounded-sm mt-1.25 sm:mt-2.25 lg:!mt-3.5'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                    </div>
                </template>
                <template #card="{ index, inpData, toggleSkeleton, cardRefs }">
                    <Card :ref="el => cardRefs[index] =  (el as ComponentPublicInstance)?.$el" :pt="{ root: { class: ['relative opacity-0 transition-opacity duration-100 rounded-xl flex flex-col gap-2'], style: 'box-shadow: 0px 18px 47px 0px rgba(0, 0, 0, 0.1);' }, body: { class: ['!p-3 lg:!p-4 xl:!p-5']}}">
                        <template #content>
                            <div class="flex items-center gap-2 xl:gap-3">
                                <div class="relative right-0 size-10 xl:size-15 wrounded-full pointer-events-none">
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
                                    <h5 class="text-sm sm:text-base lg:text-lg xl:text-xl font-semibold">{{ inpData.name }}</h5>
                                    <span class="text-xs sm:text-sm lg:text-base xl:text-lg">{{ inpData.date_review }}</span>
                                </div>
                            </div>
                            <p class="mt-1 sm:mt-2 lg:mt-3 text-xs sm:text-sm lg:text-base xl:text-lg">{{ inpData.comment }} Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea autem reiciendis maiores eligendi culpa, maxime qui non perferendis, cupiditate fuga nemo, quis ut alias omnis fugiat dolorem modi perspiciatis quos!</p>
                        </template>
                    </Card>
                </template>
            </CustomCardWithSkeletonComponent>
            <Button variant="outlined" :as="RouterLink" to="/contact" target="_blank" rel="noopener noreferrer" class="w-fit !text-[#3D37F1] hover:!text-white !border-[#3D37F1] hover:!bg-[#3D37F1] !text-sm sm:!text-base lg:!text-lg xl:!text-xl">Contact for join</Button>
        </div>
    </section>
</template>
<style scoped>
</style>