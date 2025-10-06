<script setup lang="ts">
import { reactive, onBeforeMount, defineComponent, useSlots, h, type ComponentPublicInstance, onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { getImgURL } from '@/utils/global'
import useAxios from '@/composables/api/axios'
import useEncryption from '@/composables/encryption'
import CustomCardWithSkeletonComponent from '@/components/CustomCardWithSkeleton.vue'
import I_Location from '@/assets/icons/card_events/location.svg?component'
import I_Bookmark from '@/assets/icons/card_events/bookmark.svg?component'
import freeTag from '@/assets/images/free-tag.png'
const router = useRouter()
const route = useRoute()
const { axiosJson, fetchCsrfToken } = useAxios()
const { encryptReq, decryptRes } = useEncryption()
const local = reactive({
    fetchData: null as any,
    next_cursor: null as string | null,
    has_more: false,
    inpSearch: '',
    isLoading: false,
})
let hydrationController: AbortController | null = null
const APIComposables = async(path: string, inpSignal: AbortSignal, requestBody = null as any) => {
    let retryCount = 0
    local.isLoading = true
    const APIReq = async(signal: AbortSignal) => {
        try{
            const encr = await encryptReq(requestBody)
            const res = (await(await axiosJson()).post(path, {
                uniqueid: encr.iv,
                cipher: encr.data,
                mac: encr.mac,
            }, { params: { ...route.query,_: Date.now() }, signal, headers: { 'X-Merseal': sessionStorage.merseal }})).data
            if(signal.aborted){
                return { status: 'error', message: 'Request dibatalkan' }
            }
            const decRes = decryptRes(res.message, encr.iv)
            return { status: 'success', data: decRes }
        }catch(err: any){
            if(err.name === "CanceledError"){
                console.log("Request dibatalkan")
                return { status: 'error', message: 'Request dibatalkan' }
            }else if(err.response){
                let cusRedirect: string | null = null
                if(err.response.status === 404){
                    return { status:'error', message: 'not found', code: 404 }
                }
                if([419, 429].includes(err.response.status)){
                    if(retryCount <= 3){
                        retryCount++
                        await fetchCsrfToken()
                        return APIReq(signal)
                    }else{
                        retryCount = 0
                        console.log('Request failed')
                        // return toast
                        return { status: 'error', message: 'Request failed' }
                    }
                }
                if(err.response.status === 500){
                    console.log('500', err.response.data.message)
                    // return toast
                    return { status: 'error', message: err.response.data.message }
                }
                console.log('err response', err.response.data.message)
                // return toast
                return { status:'error', message: err.response.data.message, code: err.response.status, data: { redirect: cusRedirect }}
            }
            console.log('errror', err)
            // return toast
            return { status:'error', message: err }
        }finally{
            local.isLoading = false
        }
    }
    return APIReq(inpSignal)
}
onBeforeMount(async() => {
    const{ id_page, limit } = route.query
    const isLimitValid = limit && !isNaN(Number(limit)) && Number(limit) > 0 && Number(limit) <= 30
    const isIdPageValid = id_page ? typeof id_page === 'string' && id_page.length <= 100 : true
    if(!isIdPageValid || !isLimitValid){
        await router.replace({ path:'/events', query: { 'limit': 15 }})
    }
    hydrationController = new AbortController()
    const res = await APIComposables(route.path, hydrationController.signal)
    if(res.status == 'error'){
        return console.log('error hydration')
    }
    console.log('enttokk dataa ', res.data)
    local.fetchData = res.data.data
    local.next_cursor = res.data.next_cursor
    local.has_more = res.data.has_more
})
const redirectToSearchPage = async() => {
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
    pagination: {
        rowsPerPage: 2,
        lazyLoading: true,
        preRenderPage: 1,
    }
}
const lazyDataData = async() => {
    if(local.has_more){
        await router.replace({ path:'/events', query: { 'next_page': local.next_cursor,'limit': 15 }})
        hydrationController = new AbortController()
        const res = await APIComposables(route.path, hydrationController.signal)
        if(res.status == 'error'){
            return console.log('error lazy')
        }
        console.log('lazyy res',res.data)
        local.fetchData.push(...res.data.data)
        local.next_cursor = res.data.next_cursor
        local.has_more = res.data.has_more
    }
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
            <CustomCardWithSkeletonComponent :metaData="metaDataAll" :inpData="local.fetchData" :paralelRender="2" @lazy-data="lazyDataData">
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
                                <RouterLink :to="'/event/' + inpData.event_id" class="text-sm sm:text-base lg:text-lg xl:text-xl font:medium lg:font-semibold">{{ inpData.event_name }}</RouterLink>
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