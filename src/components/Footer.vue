<script setup lang="ts">
import * as z from 'zod'
import { reactive, markRaw } from 'vue'
import { useRouter,RouterLink } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { Login } from '@/composables/api/auth'
import { useConfig } from '@/composables/useConfig'
import { useLoadingStore } from '@/stores/Loading'
import { useFetchDataStore } from '@/stores/FetchData'
import { useToastStore } from '@/stores/Toast'
import I_facebook from '@/assets/icons/footer_home/facebook.svg?component'
import I_twitter from '@/assets/icons/footer_home/twitter.svg?component'
import I_linkedln from '@/assets/icons/footer_home/linkedln.svg?component'
const publicConfig = useConfig()
const route = useRouter()
const fetchDataS = useFetchDataStore()
const loading = useLoadingStore()
const toast = useToastStore()
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
const planItems = reactive([
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
])
const EventickItems = reactive([
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
])
const formSchema = toTypedSchema(z.object({
    email: z.string().min(1, 'Email Harus diisi !').email('Masukkan email dengan benar !'),
    password: z.string().min(1, 'Password Harus diisi !')
}))
const { values, setFieldError, handleSubmit, validate } = useForm({
    validationSchema: formSchema,
})
const inpFields = Object.keys(values);
const inpChange = async() => {
    await validate();
}
const loginForm = async() => {
    if(local.isRequestInProgress) return;
    handleSubmit(async(values) => {
        local.isRequestInProgress = true;
        loading.showLoading();
        const res = await Login({email: values.email, password: values.password, recaptcha: ''});
        if(res.status === 'success'){
            local.isRequestInProgress = false;
            fetchDataS.isFirstTime = false;
            loading.closeLoading();
            console.log('toastt berhasil')
            // toast.success({ title: 'Berhasil Login', message: res.message, duration: 3000 });
            setTimeout(function(){
                route.push('/dashboard');
            }, 1500);
        }else if(res.status === 'error'){
            local.isRequestInProgress = false;
            loading.closeLoading();
            console.log('toastt gagal', res.message);
            toast.error({ title: 'Gagal Login', message: res.message, duration: 3000 });
            if(res.fields){
                if(typeof res.fields === 'string'){
                    setFieldError(res.fields, res.message);
                }else{
                    res.fields.forEach((field: any) => {
                        if(inpFields.includes(field)){
                            setFieldError(field, res.message);
                        }
                    });
                }
            }
        }
    }, (err: any) => {
        console.error('errrrorrr ', err)
    })();
}
</script>
<template>
    <footer class="bg-[#0A075F]">
        <div class="mx-auto w-full lg:max-w-[97%] p-4 lg:py-6">
            <div class="lg:flex justify-between">
                <div class="lg:w-[28%] xl:w-[30%] flex flex-col items-start mb-6 lg:mb-0">
                    <img src="@/assets/images/logowhite.png" class="sm:h-[30%] md:h-[40%]" alt="UniEvents Logo" />
                    <span class="text-white xl:text-lg">Eventick is a global self-service ticketing platform for live experiences that allows anyone to create, share, find and attend events that fuel their passions and enrich their lives.</span>
                    <div class="flex mt-2 lg:mt-5 justify-center gap-2">
                        <template v-for="(item, index) in routeItems" :key="index">
                            <RouterLink :to="item.link" class="rounded-full flex justify-center items-center">
                                <component :is="item.icon" class="w-7 lg:w-10 h-7 lg:h-10 "/>
                            </RouterLink>
                        </template>
                    </div>
                </div>
                <div class="w-full lg:w-[28%] xl:w-[25%] mb-6 lg:mb-0 flex justify-between gap-10">
                    <div class="flex-1">
                        <h2 class="lg:mb-6 text-base lg:text-lg font-semibold text-white uppercase">Plan Events</h2>
                        <div class="flex flex-col gap-1 text-white font-medium">
                            <template v-for="(item, index) in planItems" :key="index">
                                <RouterLink :to="item.link" class="">{{ item.label }}</RouterLink>
                            </template>
                        </div>
                    </div>
                    <div class="flex-1">
                        <h2 class="lg:mb-6 text-base lg:text-lg font-semibold text-white uppercase">Eventick</h2>
                        <div class="flex flex-col gap-1 text-white font-medium">
                            <template v-for="(item, index) in EventickItems" :key="index">
                                <RouterLink :to="item.link" class="">{{ item.label }}</RouterLink>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="lg:w-[42%] xl:w-[40%] lg:mb-0 text-white">
                    <h2 class="lg:mb-6 text-base lg:text-lg font-semibold  uppercase">Stay In The Loop</h2>
                    <p class="mb-4">Join our mailing list to stay in the loop with our newest for Event and concert</p>
                    <form class="relative w-[50%] lg:h-fit">
                        <input type="email" id="first_name" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter your email address" required>
                        <button class="absolute top-1/2 -translate-y-1/2 right-[2%] bg-red-500 md:px-1 lg:px-2 py-1 flex justify-center items-center md:rounded-md xl:rounded-lg cursor-pointer" @click="send">Subscribe</button>
                    </form>
                </div>
            </div>
            <hr class="my-3 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-5" />
            <div class="sm:w-4/5 lg:w-full flex justify-center items-center">
                <span class="text-sm sm:text-center text-white">© Copyright {{ publicConfig.appName }} All Rights Reserved.</span>
            </div>
        </div>
    </footer>
</template>