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
                return h('div', { class: 'relative' }, {
                    default: () => slots.default ? slots.default() : null
                });
            }
        }
    }),
    customTWTransition: 'mt-1.5 phone:mt-2.5 sm:mt-4 lg:mt-5 grid grid-cols-1 phone:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4',
}
</script>
<template>
    <section class="relative min-h-screen flex flex-col mt-5 mb-10">
        <div class="w-[90%] phone:w-[95%] mx-auto">
            <div class="flex justify-between items-center">
                <h2 class="w-fit text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-[#242565]">All Events</h2>
                <div class="flex gap-2">
                    <InputText id="email" type="email" class="w-30 sm:w-30 lg:w-50 xl:w-70 h-10 !px-1 !py-0 lg:px-3 lg:py-2 !text-sm sm:text-base lg:text-lg xl:text-xl" placeholder="Cari Event" v-model="local.inpSearch" @keyup.enter="redirectToSearchPage()"/>
                    <Button class="w-16 h-10 !p-0 lg:px-3 lg:py-2 !text-sm sm:text-base lg:text-lg xl:text-xl" @click="redirectToSearchPage()">Search</Button>
                </div>
            </div>
            <CustomCardWithSkeletonComponent :metaData="metaDataAll" :inpData="local.fetchData" :paralelRender="2">
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
                    <Card :ref="el => cardRefs[index] =  (el as ComponentPublicInstance)?.$el" :pt="{ root: { class: ['rounded-md lg:rounded-[20px] overflow-hidden opacity-0 transition-opacity duration-100'], style: 'box-shadow: 0px 18px 47px 0px rgba(0, 0, 0, 0.1);' }, body: { class: ['!gap-1 !p-3 lg:!p-4 xl:!px-7 xl:!py-5'] }}">
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
                                <h5 class="text-sm sm:text-base lg:text-lg xl:text-xl font:medium lg:font-semibold">{{ inpData.event_name }}</h5>
                                <span class="text-xs sm:text-sm lg:text-base xl:text-lg">{{ inpData.start_date }}</span>
                            </div>
                            <div class="mt-4 sm:mt-3 lg:mt-5 xl:mt-7 flex justify-between">
                                <a :href="inpData.link_lokasi" target="_blank" rel="noopener noreferrer"><I_Location class="size-5.5 phone:size-5 sm:size-5.5 lg:size-6.5 text-green-500"/></a>
                                <span class="text-sm sm:text-base lg:text-lg xl:text-xl">{{ inpData.nama_lokasi }}</span>
                                <I_Bookmark class="size-5.5 phone:size-5 sm:size-5.5 lg:size-6.5 text-green-500"/>
                            </div>
                        </template>
                    </Card>
                </template>
            </CustomCardWithSkeletonComponent>
        </div>
    </section>
</template>
<style scoped>
</style>