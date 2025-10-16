<script setup lang="ts">
import { reactive, onBeforeMount, defineComponent, useSlots, h, type ComponentPublicInstance, onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { getImgURL } from '@/utils/global'
import useAxios from '@/composables/api/axios'
import useEncryption from '@/composables/encryption'
import CustomCardWithSkeletonComponent from '@/components/CustomCardWithSkeleton.vue'
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
const APIComposables = async(path: string, inpSignal: AbortSignal, headers: Record<string, any> = {}) => {
    let retryCount = 0
    local.isLoading = true
    const APIReq = async(signal: AbortSignal) => {
        try{
            const encr = await encryptReq({})
            const res = (await(await axiosJson()).post(path, {
                uniqueid: encr.iv,
                cipher: encr.data,
                mac: encr.mac,
            }, { params: { ...route.query,_: Date.now() }, signal, headers: { 'X-Merseal': sessionStorage.merseal, ...headers }})).data
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
    const{ next_page } = route.query
    const newQuery: Record<string,any> = {}
    newQuery.limit = 15
    const hyHeader: Record<string, any> = {}
    if(next_page && typeof next_page === 'string'){
        const nextPageNumber = parseInt(next_page.replace(/\D/g, ''), 10)
        if(next_page.length <= 100 && !isNaN(nextPageNumber)){
            hyHeader['X-Pagination-From'] = 'first-time'
            newQuery.next_page = next_page
        }
    }
    router.replace({ path:'/events', query: newQuery })
    hydrationController = new AbortController()
    const res = await APIComposables(route.path, hydrationController.signal, hyHeader)
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
    customTWTransition: 'mt-1.5 phone:mt-2.5 sm:mt-4 lg:mt-5 grid grid-cols-1 phone:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5',
    pagination: {
        lazyLoading: true,
        preRenderPage: 1,
        item_id: 'event_id',
    },
    snapshots: {
        base: 2,
        phone: 2,
        xl: 3,
    },
}
const metaDataEventLoading = {
    customTWTransition: 'mt-1.5 phone:mt-2.5 sm:mt-4 lg:mt-5 grid grid-cols-1 phone:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5',
    snapshots: {
        base: 3,
        phone: 2,
        xl: 3,
    },
}
const lazyDataAll = async() => {
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
    <section class="relative pb-35 sm:pb-25 lg:pb-30 flex flex-col gap-3 sm:gap-5 lg:gap-7">
        <div class="w-full h-40 phone:h-50 sm:h-60 md:h-70 lg:h-80 xl:h-90 2xl:h-100 relative flex justify-center items-center">
            <h2 class="!m-0 !text-lg xs:!text-xl phone:!text-2xl sm:!text-3xl md:!text-4xl lg:text-5xl xl:!text-6xl !text-white">All Events</h2>
            <div class="absolute top-0 left-0 w-full h-full -z-1">
                <img src="@/assets/images/party-1.png" alt="" class="w-full h-full object-fill" />
                <div class="absolute top-0 left-0 w-full h-full opacity-90" style="background: #ED4690; background: linear-gradient(145deg,rgba(237, 70, 144, 1) 0%, rgba(85, 34, 204, 1) 100%)"/>
            </div>
        </div>
        <div class="w-[90%] phone:w-[95%] lg:w-[97%] mx-auto">
            <div class="w-full xs:w-fit ml-auto flex gap-2">
                <InputText id="email" type="email" class="flex-1 sm:flex-initial sm:w-55 md:w-60 lg:w-[calc(0.25rem*65)] xl:w-70 h-10 !px-1 !py-0 lg:px-3 lg:py-2 !text-sm sm:text-base lg:text-lg xl:text-xl" placeholder="Cari Event" v-model="local.inpSearch" @keyup.enter="redirectToSearchPage()"/>
                <Button class="w-16 h-10 !p-0 lg:px-3 lg:py-2 !text-sm sm:text-base lg:text-lg xl:text-xl" @click="redirectToSearchPage()">Search</Button>
            </div>
            <CustomCardWithSkeletonComponent v-if="local.fetchData" :metaData="metaDataAll" :inpData="local.fetchData" :paralelRender="2" @lazy-data="lazyDataAll">
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
                <div class="skeleton-wrapper flex flex-col items-center">
                    <Skeleton :pt="{ root: { class: ['!w-[103%] sm:!w-[102.5%] !h-[123px] phone:!h-[172px] lg:!h-[200px] !rounded-lg relative -left-[0.25%] -top-[1%]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                    <div class="w-full p-3.75 lg:p-4.75 xl:px-6.75 xl:py-4.75 mx-auto flex flex-col">
                        <Skeleton :pt="{ root: { class: ['!h-[13px] sm:!h-[16.75px] lg:!h-[17px] xl:!h-[18px] 2xl:!h-[20px] !rounded-[3px] sm:!rounded-[4px] lg:!rounded-[5px]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                        <Skeleton :pt="{ root: { class: ['!h-[13px] sm:!h-[16.75px] lg:!h-[17px] xl:!h-[18px] 2xl:!h-[20px] mt-1 lg:mt-1.5 !rounded-[3px] sm:!rounded-[4px] lg:!rounded-[5px]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                        <Skeleton :pt="{ root: { class: ['!w-[92px] xs:!w-[92px] phone:!w-[110px] sm:!w-[112px] lg:!w-[127px] xl:!w-[157px] 2xl:!w-[160px] !h-[14px] sm:!h-[15.5px] lg:!h-[18px] xl:!h-[18px] 2xl:!h-[20px] mt-1.5 sm:mt-1 lg:mt-2 !rounded-[3px] sm:!rounded-[4px] lg:!rounded-[5px]'], style: 'background-color: rgba(0,0,0, 0.18)' }}"/>
                    </div>
                </div>
            </CustomCardWithSkeletonComponent>
        </div>
    </section>
</template>
<style scoped>
</style>