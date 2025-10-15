<script setup lang="ts">
import * as z from 'zod'
import type { ZodSchema } from 'zod'
import { zodResolver } from "@primevue/forms/resolvers/zod"
import { Form, FormField } from "@primevue/forms"
import { useToast } from 'primevue/usetoast'
import { reactive, markRaw } from 'vue'
import { RouterLink } from 'vue-router'
import { useConfig } from '@/composables/useConfig'
import useAxios from '@/composables/api/axios'
import useEncryption from '@/composables/encryption'
import { useLoadingStore } from '@/stores/Loading'
import I_facebook from '@/assets/icons/footer_home/facebook.svg?component'
import I_twitter from '@/assets/icons/footer_home/twitter.svg?component'
import I_linkedln from '@/assets/icons/footer_home/linkedln.svg?component'
const publicConfig = useConfig()
const { axiosJson, fetchCsrfToken } = useAxios()
const { encryptReq, decryptRes } = useEncryption()
const loading = useLoadingStore()
const toast = useToast()
const local = reactive({
    isRequestInProgress: false,
    isUpdated: false,
    isPasswordShow: false,
})
const routeItems = reactive([
    {
        'name': 'Facebook Page',
        'link': 'https://facebook.com',
        'icon': markRaw(I_facebook),
    },
    {
        'name': 'Twitter Page',
        'link': 'https://twitter.com',
        'icon': markRaw(I_twitter),
    },
    {
        'name': 'Linkedln Page',
        'link': 'https://linkedln.com',
        'icon': markRaw(I_linkedln),
    },
])
const planItems = [
    {
        'label': 'Create And Set Up',
        'link': '/create',
    },
    {
        'label': 'Sell Tickets',
        'link': '/sell-tickets',
    },
    {
        'label': 'Online RSVP',
        'link': '/online-rsvp',
    },
    {
        'label': 'Online EVents',
        'link': '/online-events',
    },
]
const EventickItems = [
    {
        'label': 'About Us',
        'link': '/about',
    },
    {
        'label': 'Press',
        'link': '/press',
    },
    {
        'label': 'Contact Us',
        'link': '/contact',
    },
    {
        'label': 'Help Center',
        'link': '/help',
    },
    {
        'label': 'How It Works',
        'link': '/how',
    },
    {
        'label': 'Privacy',
        'link': '/privacy',
    },
    {
        'label': 'Terms',
        'link': '/terms',
    },
]
const footerValidator = zodResolver(z.object({
    email: z.string({ message: "Email tidak boleh kosong !" }).trim().max(50, { message: "Email maksimal 50 karakter" }).pipe(z.email({ message: "Format email tidak valid" }))
}))
let abortFormController: AbortController | null = null
const formFooter = ({ valid, states, reset }: any) => {
    if(!valid){
        const errMessage = Object.values(states as Record<string, any>).find((field: any) => field?.invalid)
        toast.add({
            severity: 'error',
            summary: 'Gagal dikirim',
            detail: errMessage?.error?.message || 'Periksa kembali input kamu!',
            life: 3000
        });
        return
    }
    if(local.isRequestInProgress) return
    if(abortFormController) abortFormController.abort()
    abortFormController = new AbortController()
    let retryCount = 0
    local.isRequestInProgress = true
    loading.showLoading()
    const APIReq = async(signal: AbortSignal) => {
        try{
            const encr = await encryptReq({
                email: states.email.value,
            })
            const res = (await(await axiosJson()).post('/footer-mail', {
                uniqueid: encr.iv,
                cipher: encr.data,
                mac: encr.mac,
            }, { params: {}, signal, headers: { 'X-Merseal': sessionStorage.merseal }})).data
            if(signal.aborted){
                return { status: 'error', message: 'Request dibatalkan' }
            }
            const decRes = decryptRes(res.message, encr.iv)
            reset()
            console.log('res sukses', decRes.message)
            toast.add({
                severity: 'success',
                summary: 'Sukses',
                detail: decRes.message,
                life: 3000
            })
        }catch(err: any){
            if(err.name === "CanceledError"){
                return console.log("Request dibatalkan")
            }else if(err.response){
                if(err.response.status === 404){
                    return console.log("not found")
                }
                if([419, 429].includes(err.response.status)){
                    if(retryCount <= 3){
                        retryCount++
                        await fetchCsrfToken()
                        return APIReq(signal)
                    }else{
                        retryCount = 0
                        return console.log("Request failed")
                    }
                }
                if(err.response.status === 500){
                    return console.log('500', err.response.data.message)
                }
                return console.log('errr response', err.response.data.message)
            }
            return console.log('errror', err)
        }finally{
            local.isRequestInProgress = false
            loading.closeLoading()
        }
    }
    APIReq(abortFormController.signal)
}
</script>
<template>
    <footer class="bg-[#0A075F]">
        <div class="mx-auto w-full p-2 sm:p-4 md:pt-5">
            <div class="flex flex-col md:flex-row md:justify-between gap-10 md:gap-0">
                <div class="md:w-[28%] xl:w-[30%] flex flex-col items-start md:mb-0">
                    <img src="@/assets/images/logowhite.png" class="h-10 xs:h-12 sm:h-15 md:h-[23%] lg:h-[26%] xl:h-[27%] 2xl:h-[28%] mb-2" alt="UniEvents Logo" />
                    <span class="text-white text-sm xs:text-base sm:text-lg md:text-base xl:text-lg">Eventick is a global self-service ticketing platform for live experiences that allows anyone to create, share, find and attend events that fuel their passions and enrich their lives.</span>
                    <div class="flex sm:mt-2 lg:mt-5 justify-center gap-2">
                        <template v-for="(item, index) in routeItems" :key="index">
                            <RouterLink :to="item.link" class="rounded-full flex justify-center items-center">
                                <component :is="item.icon" class="size-7 xs:size-7.5 lg:w-10 lg:h-10 "/>
                            </RouterLink>
                        </template>
                    </div>
                </div>
                <div class="w-full md:w-[28%] xl:w-[25%] md:mb-0 flex justify-between gap-10">
                    <div class="flex-1">
                        <h6 class="!m-0 lg:!mb-2 !text-sm xs:!text-base sm:!text-lg md:!text-base xl:!text-xl font-medium lg:font-semibold !text-white uppercase">Plan Events</h6>
                        <div class="lg:mt-1 flex flex-col gap-1 text-xs xs:text-sm sm:text-base md:text-sm xl:text-lg lg:font-medium text-white">
                            <template v-for="(item, index) in planItems" :key="index">
                                <RouterLink :to="item.link" class="">{{ item.label }}</RouterLink>
                            </template>
                        </div>
                    </div>
                    <div class="flex-1">
                        <h6 class="!m-0 lg:!mb-3 !text-sm xs:!text-base sm:!text-lg md:!text-base xl:!text-xl font-medium lg:font-semibold !text-white uppercase">Eventick</h6>
                        <div class="lg:mt-1 flex flex-col gap-1 text-xs xs:text-sm sm:text-base md:text-sm xl:text-lg lg:font-medium text-white">
                            <template v-for="(item, index) in EventickItems" :key="index">
                                <RouterLink :to="item.link" class="">{{ item.label }}</RouterLink>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="md:w-[42%] xl:w-[40%] lg:mb-0">
                    <h6 class="!m-0 lg:!mb-3 !text-sm xs:!text-base sm:!text-lg md:!text-base xl:!text-xl font-semibold uppercase !text-white">Stay In The Loop</h6>
                    <p class="!m-1 sm:!mb-4 !text-xs xs:!text-sm sm:!text-base md:!text-sm xl:!text-lg !text-white">Join our mailing list to stay in the loop with our newest for Event and concert</p>
                    <Form :resolver="footerValidator" @submit="formFooter" v-slot="$form" class="w-full 2xs:w-[82%] xs:w-[75%] phone:w-[52%] sm:w-[45%] md:w-[75%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] h-fit">
                        <FormField name="email" class="relative sm:col-span-2 md:col-span-1">
                            <InputText type="email" placeholder="Enter your email address" required class="!w-full"/>
                            <Button type="submit" label="Subscribe" class="!absolute top-1/2 right-[1.25%] -translate-y-1/2 h-[80%] !bg-red-500 !border-red-500"/>
                        </FormField>
                    </Form>
                </div>
            </div>
            <hr class="md:!mt-5 xl:!mt-7 !mb-0.75 sm:!mb-2 border-gray-200 sm:mx-auto dark:border-gray-700" />
            <div class="md:w-full flex justify-center items-center">
                <span class="text-xs xs:text-sm sm:text-base md:text-base xl:text-lg sm:text-center text-white">© Copyright {{ publicConfig.appName }} All Rights Reserved.</span>
            </div>
        </div>
    </footer>
</template>