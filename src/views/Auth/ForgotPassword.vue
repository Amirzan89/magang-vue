<script setup lang="ts">
import * as z from 'zod'
import { zodResolver } from "@primevue/forms/resolvers/zod"
import { Form, FormField } from "@primevue/forms"
import { onBeforeMount, reactive } from 'vue'
import { useRoute } from 'vue-router'
import useAxios from '@/composables/api/axios'
import { useToast } from 'primevue/usetoast'
import I_eye from '@/assets/icons/eye.svg'
import I_eye_slash from '@/assets/icons/eye-slash.svg'
const route = useRoute()
const { reqData } = useAxios()
const toast = useToast()
const local = reactive({
    mode: 'forgot_password' as 'forgot_password' | 'otp' | 'ganti_password',
    isRequestInProgress: false,
    isUpdated: false,
    isPasswordShow: false,
})
onBeforeMount(async() => {
    if(route.name === 'ForgotPasswordPage'){
        local.mode = 'forgot_password'
        return
    }
    local.mode = 'ganti_password'
    const linkId = route.params.id
    const res = await reqData({
        url: '/api' + route.path,
        method: 'POST',
        reqType: 'Json',
    })
    if(res.status == 'error'){
        toast.add({ severity: 'error', summary: 'Gagal Ambil Data Halaman', detail: res.message, life: 3000 })
        return
    }
})
const otpDigits = ref(['', '', '', '', '', '']);
const inputRefs = ref([]);
const handleInput = (event, index) => {
    const value = event.target.value;
    
    // Hanya ambil digit pertama jika pengguna menempel (paste)
    otpDigits.value[index] = value.length > 1 ? value.charAt(0) : value;

    // Cek apakah ada digit dan apakah ada kotak input berikutnya
    if (otpDigits.value[index] && index < otpDigits.value.length - 1) {
        // Pindah fokus ke kotak input berikutnya
        nextTick(() => {
        inputRefs.value[index + 1].focus()
        })
    }
}
const showPass = () => {
    local.isPasswordShow = !local.isPasswordShow
}
const forgotPassValidator = zodResolver(z.object({
    email: z.string({ message: "Email tidak boleh kosong !" }).trim().max(50, { message: "Email maksimal 50 karakter" }).pipe(z.email({ message: "Format email tidak valid" })),
}))
const forgotPassForm = async({ valid, states, reset }: any) => {
    if(!valid){
        const errMessage = Object.values(states as Record<string, any>).find((field: any) => field?.invalid)
        toast.add({ severity: 'error', summary: 'Gagal dikirim', detail: errMessage?.error?.message || 'Periksa kembali input !', life: 3000 });
        return
    }
    const res = await reqData({
        url: '/api/admin/verify/create/passsword',
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
    toast.add({ severity: 'success', summary: 'Berhasil Login', detail: res.message, life: 3000 })
}
const otpValidator = zodResolver(z.object({
    email: z.string({ message: "Email tidak boleh kosong !" }).trim().max(50, { message: "Email maksimal 50 karakter" }).pipe(z.email({ message: "Format email tidak valid" })),
    otp: z.string().min(1, 'Password Harus diisi !')
}))
const otpForm = async({ valid, states, reset }: any) => {
    if(!valid){
        const errMessage = Object.values(states as Record<string, any>).find((field: any) => field?.invalid)
        toast.add({ severity: 'error', summary: 'Gagal dikirim', detail: errMessage?.error?.message || 'Periksa kembali input !', life: 3000 });
        return
    }
    const res = await reqData({
        url: '/api/admin/verify/otp/password',
        method: 'POST',
        reqBody: {
            email: states.email.value,
            otp: states.otp.value,
        },
        reqType: 'Json',
        isNeedLoading: true,
    })
    if(res.status == 'error'){
        toast.add({ severity: 'error', summary: 'Gagal OTP', detail: res.message, life: 3000 })
        return
    }
    toast.add({ severity: 'success', summary: 'Berhasil OTP', detail: res.message, life: 3000 })
}
const gantiPassValidator = zodResolver(z.object({
    email: z.string({ message: "Email tidak boleh kosong !" }).trim().max(50, { message: "Email maksimal 50 karakter" }).pipe(z.email({ message: "Format email tidak valid" })),
    password: z.string().min(1, 'Password Harus diisi !')
    password_confirm: z.string().min(1, 'Password Harus diisi !')
}))
const gantiPassForm = async({ valid, states, reset }: any) => {
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
            password_confirm: states.passsword_confirm.value,
            
        },
        reqType: 'Json',
        isNeedLoading: true,
    })
    if(res.status == 'error'){
        toast.add({ severity: 'error', summary: 'Gagal Ganti Password', detail: res.message, life: 3000 })
        return
    }
    toast.add({ severity: 'success', summary: 'Berhasil Ganti Password', detail: res.message, life: 3000 })
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
                    <h2 class="!m-0 !text-lg phone:!text-xl md:!text-2xl lg:!text-4xl xl:!text-[40px] !text-white">
                        <template v-if="local.mode == 'forgot_password'">Forgot Password</template>
                        <template v-if="local.mode == 'otp'">OTP Password</template>
                        <template v-if="local.mode == 'ganti_password'">Ganti Password</template>
                    </h2>
                    <p class="!text-base phone:!text-lg md:!text-xl lg:!text-2xl xl:!text-3xl !text-white">For the purpose of industry regulation, your details are required</p>
                </div>
                <Form v-if="local.mode == 'forgot_password'" :resolver="forgotPassValidator" @submit="forgotPassForm" v-slot="$form" class="w-[100%] lg:w-[50%] h-fit px-5 lg:px-12 py-7 lg:py-7 flex flex-col rounded-2xl md:rounded-2xl lg:rounded-3xl" style="background-color: rgba(255,255,255, 0.7); box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.35);">
                    <FormField name="email" class="flex flex-col">
                        <label for="email" class="ml-0.75 text-sm phone:text-base md:text-lg lg:text-xl xl:text-2xl">Masukkan email terdaftar</label>
                        <InputText v-for="(digit, index) in otpDigits" id="email" type="email" placeholder="Enter Email Address" class="!text-sm phone:!text-base md:!text-lg lg:!text-xl xl:!text-2xl"/>
                    </FormField>
                    <Button type="submit" label="Kirim otp ganti password" class="!w-full mt-5 sm:mt-10 lg:mt-15 mx-auto !px-2 lg:!px-4 !py-1 lg:!py-2 !rounded-sm lg:!rounded-[17px] !text-sm phone:!text-base md:!text-lg lg:!text-xl xl:!text-2xl font-medium lg:font-semibold"/>
                </Form>
                <Form v-else-if="local.mode == 'otp'" :resolver="otpValidator" @submit="otpForm" v-slot="$form" class="w-[100%] lg:w-[50%] h-fit px-5 lg:px-12 py-7 lg:py-7 flex flex-col rounded-2xl md:rounded-2xl lg:rounded-3xl" style="background-color: rgba(255,255,255, 0.7); box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.35);">
                    <FormField name="email" class="flex flex-col">
                        <label for="email" class="ml-0.75 text-sm phone:text-base md:text-lg lg:text-xl xl:text-2xl">Verifikasi OTP</label>
                        <InputText id="email" type="email" placeholder="Enter Email Address" class="!text-sm phone:!text-base md:!text-lg lg:!text-xl xl:!text-2xl"/>
                    </FormField>
                    <Button type="submit" label="Login" class="!w-full mt-5 sm:mt-10 lg:mt-15 mx-auto !px-2 lg:!px-4 !py-1 lg:!py-2 !rounded-sm lg:!rounded-[17px] !text-sm phone:!text-base md:!text-lg lg:!text-xl xl:!text-2xl font-medium lg:font-semibold"/>
                    <Button type="button" label="Kirim ulang kode OTP" class="!w-full mt-5" :disabled="local.resending" @click="ReSendOtp"/>
                    <!-- <p>Tidak menerima kode OTP ? <span @click="ReSendOtp">kirim ulang</span></p> -->
                    <Button type="button" label="Kirim ulang" class="!w-full mt-5 sm:mt-10 lg:mt-15 mx-auto !px-2 lg:!px-4 !py-1 lg:!py-2 !rounded-sm lg:!rounded-[17px] !text-sm phone:!text-base md:!text-lg lg:!text-xl xl:!text-2xl font-medium lg:font-semibold"/>
                </Form>
                <Form v-else-if="local.mode == 'ganti_password'" :resolver="gantiPassValidator" @submit="gantiPassForm" v-slot="$form" class="w-[100%] lg:w-[50%] h-fit px-5 lg:px-12 py-7 lg:py-7 flex flex-col rounded-2xl md:rounded-2xl lg:rounded-3xl" style="background-color: rgba(255,255,255, 0.7); box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.35);">
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
                    <FormField name="password" class="mt-2 sm:mt-2.5 lg:mt-3 flex flex-col">
                        <label for="password" class="ml-0.75 text-sm phone:text-base md:text-lg lg:text-xl xl:text-2xl">Ulangi Password</label>
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
                    <Button type="submit" label="Update Password" class="!w-full mt-5 sm:mt-10 lg:mt-15 mx-auto !px-2 lg:!px-4 !py-1 lg:!py-2 !rounded-sm lg:!rounded-[17px] !text-sm phone:!text-base md:!text-lg lg:!text-xl xl:!text-2xl font-medium lg:font-semibold"/>
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