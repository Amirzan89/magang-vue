<script setup lang="ts">
import { reactive, onBeforeMount, defineComponent, useSlots, h, type ComponentPublicInstance } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useFetchDataStore } from '@/stores/FetchData'
import { getImgURL } from '@/utils/global'
import CustomCardWithSkeletonComponent from '@/components/CustomCardWithSkeleton.vue'
import I_Location from '@/assets/icons/card_events/location.svg?component'
import I_Bookmark from '@/assets/icons/card_events/bookmark.svg?component'
import freeTag from '@/assets/images/free-tag.png';
const router = useRouter()
const fetchDataS = useFetchDataStore()
const local = reactive({
    fetchData: null as any,
    past_events: null as any,
    reviews: null as any,
    inpSearch: '',
    isLoading: false,
})
onBeforeMount(async() =>{
    const res = (await fetchDataS.fetchPage(useRoute().path, {}))
    if(res ==  undefined || res.status == 'error'){
        return
    }
    console.log('enttokk dataa ', res.data)
    local.fetchData = res.data
})
const redirectToSearchPage = async() => {
    console.log('iisii ', local.inpSearch)
    router.push({
        path: '/search',
        query: {
            find: local.inpSearch
        }
    })
}
const metaDataAll = {
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
    <section class="relative flex flex-col mt-5 mb-10">
        <div class="w-[95%] mx-auto">
            <div class="flex justify-between">
                <h2 class="w-fit mx-auto lg:mx-0 text-xl xl:text-3xl font-bold">All Events</h2>
                <div class="flex gap-2">
                    <Input id="email" type="email" class="w-50" placeholder="Cari Event" v-model="local.inpSearch" @keyup.enter="redirectToSearchPage()"/>
                    <Button @click="redirectToSearchPage()">Search</Button>
                </div>
            </div>
            <CustomCardWithSkeletonComponent :metaData="metaDataAll" :inpData="local.fetchData" :paralelRender="2">
                <template #skeleton="{ index, skeletonRefs }">
                    <div :ref="el => skeletonRefs[index] = el" class="skeleton-wrapper absolute z-10 top-0 left-0 flex flex-col w-full h-full transition-opacity duration-100">
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
                                    <a :href="inpData.link_lokasi" target="_blank" rel="noopener noreferrer"><I_Location class="w-5 h-5 sm:w-8 sm:h-8 text-black"/></a>
                                    <span class="text-base">{{ inpData.nama_lokasi }}</span>
                                    <I_Bookmark class="w-5 h-5 sm:w-8 sm:h-8 text-black" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </template>
            </CustomCardWithSkeletonComponent>
        </div>
    </section>
</template>
<style scoped>
</style>