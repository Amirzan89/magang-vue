<script setup lang="ts">
import * as z from 'zod'
import { zodResolver } from "@primevue/forms/resolvers/zod"
import { Form, FormField } from "@primevue/forms"
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import useAxios from '@/composables/api/axios'
import { useFetchDataStore } from '@/stores/FetchData'
import { useLoadingStore } from '@/stores/Loading'
import { useToast } from 'primevue/usetoast'
import FooterHome from '@/layouts/FooterHome.vue'
import Loading from '@/components/Loading.vue'
import I_eye from '@/assets/icons/eye.svg'
import I_eye_slash from '@/assets/icons/eye-slash.svg'
const router = useRouter()
const loading = useLoadingStore()
const { reqData } = useAxios()
const toast = useToast()
const fetchDataS = useFetchDataStore()
const local = reactive({
    isRequestInProgress: false,
    isUpdated: false,
    isPasswordShow: false,
})
const showPass = () => {
    local.isPasswordShow = !local.isPasswordShow
}
const loginValidator = zodResolver(z.object({
    email: z.string({ message: "Email tidak boleh kosong !" }).trim().max(50, { message: "Email maksimal 50 karakter" }).pipe(z.email({ message: "Format email tidak valid" })),
    password: z.string().min(1, 'Password Harus diisi !')
}))
const loginForm = async({ valid, states, reset }: any) => {
    if(!valid){
        const errMessage = Object.values(states as Record<string, any>).find((field: any) => field?.invalid)
        toast.add({ severity: 'error', summary: 'Gagal dikirim', detail: errMessage?.error?.message || 'Periksa kembali input !', life: 3000 });
        return
    }
    const res = await reqData({
        url: '/api/admin/login',
        method: 'POST',
        reqBody: {
            email: states.email.value,
            password: states.password.value,
        },
        reqType: 'Json',
        isNeedLoading: true,
        callbackResFn: reset
    })
    if(res.status == 'error'){
        toast.add({ severity: 'error', summary: 'Gagal Login', detail: res.message, life: 3000 })
        return
    }
    fetchDataS.login()
    toast.add({ severity: 'success', summary: 'Berhasil Login', detail: res.message, life: 3000 })
    setTimeout(async() => {
        await router.push('/dashboard')
    }, 3000)
}
</script>
<template>
    <main class="relative h-screen flex flex-col">
        <div class="relative w-full h-20 sm:h-30 lg:h-40 flex justify-center items-center">
            <img src="@/assets/images/logowhite.png" alt="">
            <div class="absolute top-0 left-0 w-full h-full -z-1">
                <img src="@/assets/images/header.png" alt="" class="w-full h-full object-fill"/>
                <div class="absolute top-0 left-0 w-full h-full opacity-90" style="background: #ED4690; background: linear-gradient(145deg,rgba(237, 70, 144, 1) 0%, rgba(85, 34, 204, 1) 100%)"/>
            </div>
        </div>
        <section class="relative overflow-clip flex-1">
            <img src="@/assets/images/cele-3.png" alt="" class="absolute bottom-0 md:-bottom-5 -right-13 sm:-right-23 md:-right-32 lg:-right-35 xl:-right-35 2xl:-right-37 h-57 xs:h-62 phone:h-65 sm:h-90 md:h-130 lg:h-132 xl:h-137 2xl:h-145 -z-1 object-contain opacity-30 scale-300 sm:scale-270 md:scale-250"/>
            <div class="relative left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] flex rounded-3xl">
                <div class="absolute top-0 left-0 w-full h-full -z-1">
                    <img src="@/assets/images/party-1.png" alt="" class="w-full h-full object-fill rounded-3xl" />
                    <div class="absolute top-0 left-0 w-full h-full opacity-90 rounded-3xl" style="background: #ED4690; background: linear-gradient(145deg,rgba(237, 70, 144, 1) 0%, rgba(85, 34, 204, 1) 100%)"/>
                </div>
                <div class="w-[75%] h-fit ml-auto mr-10 my-auto flex flex-col md:flex-row justify-between bg-amber-500a">
                    <div class="w-[30%]">
                        <h2 class="!text-lg phone:!text-xl md:!text-2xl lg:!text-4xl xl:!text-[40px] !text-white">Login Your Account</h2>
                        <p class="!text-base phone:!text-lg md:!text-xl lg:!text-2xl xl:!text-3xl !text-white">For the purpose of industry regulation, your details are required</p>
                    </div>
                    <Form :resolver="loginValidator" @submit="loginForm" v-slot="$form" class="w-[90%] lg:w-[50%] h-fit px-12 py-7 flex flex-col gap-0.5 phone:gap-1 md:gap-2 xl:gap-2.5 rounded-3xl" style="background-color: rgba(255,255,255, 0.7); box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.35);">
                        <div>
                            <FormField name="email" class="flex flex-col gap-0.25 !text-sm phone:!text-base md:!text-lg lg:!text-xl xl:!text-2xl">
                                <label for="email">Email Address</label>
                                <InputText id="email" type="email" placeholder="Enter Email Address"/>
                            </FormField>
                            <FormField name="password" class="flex flex-col gap-0.25 !text-sm phone:!text-base md:!text-lg lg:!text-xl xl:!text-2xl">
                                <label for="password bg-amber-500">Password</label>
                                <div class="relative w-full">
                                    <InputText id="password" :type="local.isPasswordShow ? 'text' : 'password'" placeholder="Enter Your Password" class="!w-full"/>
                                    <div class="absolute top-1/2 -translate-y-1/2 3xs:right-1 sm:right-2 xl:right-3" @click="showPass">
                                        <div class="relative 3xs:w-[17px] lg:w-8 xl:w-10 flex items-center justify-center">
                                            <I_eye class="absolute fill-palText w-full transition duration-[400ms]" :class="!$form.password?.value || !local.isPasswordShow ? 'opacity-0 pointer-events-none' : 'opacity-100 cursor-pointer'"/>
                                            <I_eye_slash class="absolute fill-palText w-full transition duration-400" :class="!$form.password?.value || local.isPasswordShow ? 'opacity-0 pointer-events-none' : 'opacity-100 cursor-pointer'"/>
                                        </div>
                                    </div>
                                </div>
                            </FormField>
                        </div>
                        <p class="!text-sm phone:!text-base md:!text-lg lg:!text-xl xl:!text-2xl">Forgot Password ? <RouterLink to="/forgot-password">Click Here</RouterLink></p>
                        <Button type="submit" label="Login" :loading="loading.isLoading" class="!w-full mt-3 sm:mt-5 lg:mt-7 mx-auto !px-2 lg:!px-4 !py-1 lg:!py-2 !rounded-sm lg:!rounded-[17px] !text-sm sm:!text-base lg:!text-lg xl:!text-xl !font-normal"/>
                    </Form>
                </div>
            </div>
        </section>
    </main>
    <FooterHome></FooterHome>
    <Loading/>
    <Toast position="bottom-right" />
</template>
<style scoped lang="scss">
.fade-out{
    animation: fadeOut 0.75s ease forwards;
}
@keyframes fadeOut {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
        display: none;
    }
}
</style>