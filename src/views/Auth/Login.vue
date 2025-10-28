<script setup lang="ts">
import * as z from 'zod'
import { zodResolver } from "@primevue/forms/resolvers/zod"
import { Form, FormField } from "@primevue/forms"
import { onBeforeMount, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useConfig } from '@/composables/useConfig'
import useAxios from '@/composables/api/axios'
import { useFetchDataStore } from '@/stores/FetchData'
import { useLoadingStore } from '@/stores/Loading'
import{ isImageFile, base64_decode_to_blob } from '@/utils/Base64File'
import { useToast } from 'primevue/usetoast'
import Im_DefaultBoy from '@/assets/images/default_boy.jpg'
import Im_DefaultGirl from '@/assets/images/default_girl.png'
import I_eye from '@/assets/icons/eye.svg'
import I_eye_slash from '@/assets/icons/eye-slash.svg'
import I_google from '@/assets/icons/google.svg'
const router = useRouter()
const publicConfig = useConfig()
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
    })
    if(res.status == 'error'){
        toast.add({ severity: 'error', summary: 'Gagal Login', detail: res.message, life: 3000 })
        return
    }
    fetchDataS.login()
    fetchDataS.cacheAuth = res.data
    if(res.data.foto && res.data.foto !== null && isImageFile(res.data.foto.meta)){
        fetchDataS.setDecryptedImage(base64_decode_to_blob(res.data.foto))
    }else{
        fetchDataS.imgUrl = res.data.jenis_kelamin === 'perempuan' ? Im_DefaultGirl : Im_DefaultBoy
    }
    toast.add({ severity: 'success', summary: 'Berhasil Login', detail: res.message, life: 3000 })
    setTimeout(async() => {
        await router.push('/dashboard')
    }, 3000)
}
</script>
<template>
    <section class="relative overflow-clip flex-1">
        <img src="@/assets/images/cele-3.png" alt="" class="absolute bottom-0 md:-bottom-5 -right-13 sm:-right-23 md:-right-32 lg:-right-35 xl:-right-35 2xl:-right-37 h-57 xs:h-62 phone:h-65 sm:h-90 md:h-130 lg:h-132 xl:h-137 2xl:h-145 -z-1 object-contain opacity-30 scale-300 sm:scale-270 md:scale-250"/>
        <div class="relative left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[95%] sm:h-[92%] lg:h-[90%] flex rounded-3xl">
            <div class="absolute top-0 left-0 w-full h-full -z-1">
                <img src="@/assets/images/party-1.png" alt="" class="w-full h-full object-fill rounded-3xl" />
                <div class="absolute top-0 left-0 w-full h-full opacity-90 rounded-3xl" style="background: #ED4690; background: linear-gradient(145deg,rgba(237, 70, 144, 1) 0%, rgba(85, 34, 204, 1) 100%)"/>
            </div>
            <div class="w-[85%] md:w-[90%] lg:w-[82.5%] xl:w-[75%] h-fit mx-auto lg:ml-auto lg:mr-[4.5%] my-auto flex flex-col md:flex-row justify-between gap-5 md:gap-0 bg-amber-500a">
                <div class="lg:w-[30%]">
                    <h2 class="!m-0 !text-lg phone:!text-xl md:!text-2xl lg:!text-4xl xl:!text-[40px] !text-white">Login Your Account</h2>
                    <p class="!text-base phone:!text-lg md:!text-xl lg:!text-2xl xl:!text-3xl !text-white">For the purpose of industry regulation, your details are required</p>
                </div>
                <Form :resolver="loginValidator" @submit="loginForm" v-slot="$form" class="w-[100%] lg:w-[50%] h-fit px-5 lg:px-12 py-7 lg:py-7 flex flex-col rounded-2xl md:rounded-2xl lg:rounded-3xl" style="background-color: rgba(255,255,255, 0.7); box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.35);">
                    <FormField name="email" class="flex flex-col">
                        <label for="email" class="ml-0.75 text-sm phone:text-base md:text-lg lg:text-xl xl:text-2xl">Email Address</label>
                        <InputText id="email" type="email" placeholder="Enter Email Address" class="!text-sm phone:!text-base md:!text-lg lg:!text-xl xl:!text-2xl"/>
                    </FormField>
                    <FormField name="password" class="mt-2 sm:mt-2.5 lg:mt-3 flex flex-col">
                        <label for="password" class="ml-0.75 text-sm phone:text-base md:text-lg lg:text-xl xl:text-2xl">Password</label>
                        <div class="relative w-full">
                            <InputText id="password" :type="local.isPasswordShow ? 'text' : 'password'" placeholder="Enter Your Password" class="!w-full !text-sm phone:!text-base md:!text-lg lg:!text-xl xl:!text-2xl"/>
                            <div class="absolute top-1/2 -translate-y-1/2 3xs:right-1 sm:right-2 xl:right-3" @click="showPass">
                                <div class="relative 3xs:w-[17px] lg:w-8 xl:w-10 flex items-center justify-center">
                                    <I_eye class="absolute fill-palText w-full transition duration-[400ms]" :class="!$form.password?.value || !local.isPasswordShow ? 'opacity-0 pointer-events-none' : 'opacity-100 cursor-pointer'"/>
                                    <I_eye_slash class="absolute fill-palText w-full transition duration-400" :class="!$form.password?.value || local.isPasswordShow ? 'opacity-0 pointer-events-none' : 'opacity-100 cursor-pointer'"/>
                                </div>
                            </div>
                        </div>
                    </FormField>
                    <p class="!m-0 !ml-0.75 !mt-0.5 !text-sm phone:!text-base md:!text-lg lg:!text-xl xl:!text-2xl">Forgot Password ? <RouterLink to="/forgot-password" class="hover:text-red-500">Click Here</RouterLink></p>
                    <Button type="submit" label="Login" :loading="loading.isLoading" class="!w-full mt-5 sm:mt-10 lg:mt-15 mx-auto !px-2 lg:!px-4 !py-1 lg:!py-2 !rounded-sm lg:!rounded-[17px] !text-sm phone:!text-base md:!text-lg lg:!text-xl xl:!text-2xl font-medium lg:font-semibold"/>
                    <div class="relative left-1/2 -translate-x-1/2 w-[98%] h-6.5 sm:h-7.5 lg:h-10 flex items-center gap-5 sm:gap-7 lg:gap-10">
                        <hr class="flex-1">
                        <span class="text-xs sm:text-sm lg:text-base text-white">Or</span>
                        <hr class="flex-1">
                    </div>
                    <Button as="a" :href="publicConfig.baseURL +'/login/google'" rel="noopener noreferrer" class="relative w-full !px-2 sm:!px-3 lg:!px-4 !py-1 sm!py-1.5 lg:!py-2 !rounded-sm lg:!rounded-[17px] !gap-2 !bg-white !text-black hover:!text-white !border-black hover:!bg-black !text-sm phone:!text-base md:!text-lg lg:!text-xl xl:!text-2xl font-medium lg:font-semibold">
                        <I_google class="size-5 sm:size-7 lg:size-9"/>
                        <span>Sign in with Google</span>
                    </Button>
                </Form>
            </div>
        </div>
    </section>
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