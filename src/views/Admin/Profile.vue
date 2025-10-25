<script setup lang="ts">
import * as z from 'zod'
import { zodResolver } from "@primevue/forms/resolvers/zod"
import { Form, FormField } from "@primevue/forms"
import { onMounted, reactive, ref, type Ref, type ComponentPublicInstance, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useAxios from '@/composables/api/axios'
import RSAComposables from '@/composables/RSA'
import useEncryption from '@/composables/encryption'
import { useFetchDataStore } from '@/stores/FetchData'
import { useToast } from 'primevue/usetoast'
import Im_DefaultBoy from '@/assets/images/default_boy.jpg'
import Im_DefaultGirl from '@/assets/images/default_girl.png'
import I_Drop from '@/assets/icons/drop.svg'
import I_eye from '@/assets/icons/eye.svg'
import I_eye_slash from '@/assets/icons/eye-slash.svg'
import { base64_encode } from '@/utils/Base64File'
const route = useRoute()
const router = useRouter()
const { reqData } = useAxios()
const rsaComp = RSAComposables()
const { genIV, decryptImg } = useEncryption()
const fetchDataS = useFetchDataStore()
const toast = useToast()
const local = reactive({
    isWUpProfile: false,
    foto: null as File | null,
    linkImgProfile: '' as string,
    isErrorFoto: false as boolean,
    isPasswordLamaShow: false,
    isPasswordBaruShow: false,
    isPasswordBaruUlangiShow: false,
})
const profileForm: Ref = ref(null)
const fileInputProfile: Ref = ref(null)
onMounted(async() => {
    if(Object.keys(fetchDataS.cacheAuth).length === 0){
        const res = await reqData({
            url: '/api' + route.path,
            method: 'POST',
            reqType: 'Json',
        })
        if(res.status == 'error'){
            if(res.code === 401){
                toast.add({ severity: 'error', summary: 'Gagal Autentikasi', detail: 'Sesi telah habis, silahkan login kembali !', life: 3000 })
                setTimeout(() => {
                    return router.push('/login')
                }, 3000)
            }
            toast.add({ severity: 'error', summary: 'Gagal Ambil Data Halaman', detail: res.message, life: 3000 })
            return
        }
        fetchDataS.cacheAuth = res.data
        const iv = rsaComp.hexCus.enc(await genIV())
        const resFoto = await reqData({
            url: '/api/admin/download/foto-profile',
            headers: { 'X-Auth-Check': 'true', 'X-UniqueId': iv },
            isEncrypt: false,
        })
        if(resFoto.status == 'error'){
            if(resFoto.code === 401){
                toast.add({ severity: 'error', summary: 'Gagal Autentikasi', detail: 'Sesi telah habis, silahkan login kembali !', life: 3000 })
                setTimeout(() => {
                    return router.push('/login')
                }, 3000)
            }
            toast.add({ severity: 'error', summary: 'Gagal Ambil Data Halaman', detail: resFoto.message, life: 3000 })
            return
        }
        fetchDataS.setDecryptedImage(decryptImg(resFoto.message, iv))
    }
    local.linkImgProfile = fetchDataS.imgUrl ?? ''
    const data = fetchDataS.cacheAuth
    await nextTick()
    profileForm.value.setValues({
        nama_lengkap: data.nama_lengkap,
        jenis_kelamin: data.jenis_kelamin,
        no_telpon: data.no_telpon,
        email: data.email
    })
})
const renderImgFallback = () => {
    if(!fetchDataS.cacheAuth) return Im_DefaultBoy
    return fetchDataS.cacheAuth.jenis_kelamin == 'laki-laki' ? Im_DefaultBoy : Im_DefaultGirl
}
const handleFormClickPersonal = () => {
    fileInputProfile.value.click()
}
const handleFileChangePersonal = (event: any) => {
    handleFiles(event.target.files)
}
const handleDragOverPersonal = (event: Event) => {
    event.preventDefault()
}
const handleDropPersonal = (event: any) => {
    event.preventDefault()
    handleFiles(event.dataTransfer.files)
}
const handleFiles = async(files: FileList) => {
    if(files.length !== 1){
        toast.add({ severity: 'error', summary: 'Gagal Upload Foto', detail: 'Pilih Satu File Foto', life: 3000 })
        return
    }
    const file = files[0]
    if(!file.type.startsWith('image/')){
        toast.add({ severity: 'error', summary: 'Gagal Upload Foto', detail: 'Invalid File Foto', life: 3000 })
        return
    }
    if(file.size > 2 * 1024 * 1024){
        toast.add({ severity: 'error', summary: 'Gagal Upload Foto', detail: 'Ukuran File Foto tidak bisa lebih dari 2MB', life: 3000 })
        return
    }
    profileForm.value.setFieldValue('foto', file)
    local.linkImgProfile = URL.createObjectURL(file)
    local.isErrorFoto = false
}
const profileValidator = zodResolver(z.object({
    nama_lengkap: z.string().min(1, 'Nama lengkap harus diisi!').max(50, 'Nama Lengkap maksimal 50 karakter'),
    jenis_kelamin: z.enum(['laki-laki', 'perempuan'], { message: 'Jenis kelamin harus dipilih!' }),
    no_telpon: z.string().min(10, 'Nomor telepon minimal 10 digit!').max(15, 'Nomor telepon maksimal 15 digit!').regex(/^\d+$/, 'Nomor telepon harus berupa angka!'),
    email: z.string().min(1, 'Email Harus diisi!').max(45, 'Email maksimal 45 karakter').email('Masukkan email dengan benar!'),
    foto: z.union([z.instanceof(File), z.null()]).optional().refine(file => !file || file.size <= 2 * 1024 * 1024, { message: 'Foto maksimal 2 MB !' })
}))
const formatNoProfile = ($form: any) => {
    const raw = $form.no_telpon.value || ''
    $form.no_telpon.value = raw.replace(/\D/g, '').slice(0, 13)
}
const updateProfileForm = async({ valid, states, reset }: any) => {
    if(!valid){
        toast.add({ severity: 'error', summary: 'Gagal Update Profile',  detail: Object.values(states as Record<string, any>).find((field: any) => field?.invalid)?.error?.message || 'Periksa kembali input !', life: 3000 })
        return
    }
    if(states.nama_lengkap.value === fetchDataS.cacheAuth.nama_lengkap && states.email.value === fetchDataS.cacheAuth.email && states.jenis_kelamin.value === fetchDataS.cacheAuth.jenis_kelamin && states.no_telpon.value === fetchDataS.cacheAuth.no_telpon && states.foto.value === null){
        return toast.add({ severity: 'error', summary: 'Gagal Update Profile', detail: 'Data belum diubah !', life: 3000 })
    }
    const fileFoto = await base64_encode(states.foto.value)
    const res = await reqData({
        url: '/api/admin/update/profile',
        method: 'PUT',
        reqBody: {
            nama_lengkap: states.nama_lengkap.value,
            jenis_kelamin: states.jenis_kelamin.value,
            no_telpon: states.no_telpon.value,
            email_new: states.email.value !== fetchDataS.cacheAuth.email ? states.email.value : '',
            foto: {
                data: fileFoto.data,
                meta: fileFoto.meta
            }
        },
        reqType: 'Json',
        isNeedLoading: true,
    })
    if(res.status == 'error'){
        toast.add({ severity: 'error', summary: 'Gagal Update Profile', detail: res.message, life: 3000 })
        return
    }
    fetchDataS.cacheAuth.nama_lengkap = states.nama_lengkap.value
    fetchDataS.cacheAuth.jenis_kelamin = states.jenis_kelamin.value
    fetchDataS.cacheAuth.no_telpon = states.no_telpon.value
    fetchDataS.cacheAuth.email = states.email.value
    fetchDataS.clearDecryptedImage()
    await nextTick()
    setTimeout(() => {
        const fileFoto = states.foto.value
        fetchDataS.setDecryptedImage(new Blob([fileFoto], { type: fileFoto.typpeee }))
        toast.add({ severity: 'success', summary: 'Berhasil Update Profile', detail: res.message, life: 3000 });
    }, 5)
}
const gantiPasswordValidator = zodResolver(z.object({
    pass_lama: z.string().min(1, 'Password Harus diisi!'),
    pass_baru: z.string().min(1, 'Password Harus diisi!')
        .min(8, 'Password minimal 8 karakter !')
        .regex(/[A-Z]/, 'Password minimal ada 1 huruf kapital !')
        .regex(/[a-z]/, 'Password minimal ada 1 huruf kecil !')
        .regex(/\d/, 'Password minimal ada 1 angka!')
        .regex(/[!@#$%^&*]/, 'Password minimal ada 1 karakter unik!'),
    pass_baru_ulangi: z.string().min(1, 'Ulangi Password Harus diisi!')
        .min(8, 'Password konfirmasi minimal 8 karakter!')
        .regex(/[A-Z]/, 'Password konfirmasi minimal ada 1 huruf kapital!')
        .regex(/[a-z]/, 'Password konfirmasi minimal ada 1 huruf kecil!')
        .regex(/\d/, 'Password konfirmasi minimal ada 1 angka!')
        .regex(/[!@#$%^&*]/, 'Password konfirmasi minimal ada 1 karakter unik!')
    }))
const showPass = (cond: string) => {
    if(cond === 'lama'){
        local.isPasswordLamaShow = !local.isPasswordLamaShow
    }else if(cond === 'baru'){
        local.isPasswordBaruShow = !local.isPasswordBaruShow
    }else if(cond === 'ulangi'){
        local.isPasswordBaruUlangiShow = !local.isPasswordBaruUlangiShow
    }
}
const updatePasswordForm = async({ valid, states, reset }: any) => {
    if(!valid){
        const errMessage = Object.values(states as Record<string, any>).find((field: any) => field?.invalid)
        toast.add({ severity: 'error', summary: 'Gagal dikirim', detail: errMessage?.error?.message || 'Periksa kembali input !', life: 3000 });
        return
    }
    const res = await reqData({
        url: '/api/admin/update/password',
        method: 'PUT',
        reqBody: {
            password_old: states.pass_lama.value,
            password: states.pass_baru.value,
            password_confirm: states.pass_baru_ulangi.value
        },
        reqType: 'Json',
        isNeedLoading: true,
        callbackResFn: reset
    })
    if(res.status == 'error'){
        toast.add({ severity: 'error', summary: 'Gagal Update Password', detail: res.message, life: 3000 })
        return
    }
    toast.add({ severity: 'success', summary: 'Berhasil Update Password', detail: res.message, life: 3000 })
}

</script>
<template>
    <section class="flex flex-col gap-5">
        <h1>Profile</h1>
        <div class="card !p-4" style="box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.35);">
            <Tabs value="0">
                <TabList>
                    <Tab value="0">Profile</Tab>
                    <Tab value="1">Updae Password</Tab>
                </TabList>
                <TabPanels class="!p-2">
                    <TabPanel value="0">
                        <Form ref="profileForm" :resolver="profileValidator" @submit="updateProfileForm" v-slot="$form" class="flex flex-col gap-1 phone:gap-1.5 sm:gap-2 xl:gap-5 rounded-3xl">
                            <div class="col-12 md:col-10">
                                <div class="3xs:w-[85%] xs:w-[70%] phone:w-[55%] sm:w-[50%] md:w-[45%] lg:w-[35%] xl:w-[30%] 2xl:w-[25%] 3xs:h-30 sm:h-35 lg:h-40 xl:h-50 2xl:h-55 flex flex-col justify-center mx-auto cursor-pointer gap-2 rounded-lg" :class="{
                                    'border-black border-dashed border-3' : local.linkImgProfile === '' || local.isErrorFoto,
                                    'pointer-events-none': !local.isWUpProfile,
                                }" @dragover.prevent="handleDragOverPersonal" @drop.prevent="handleDropPersonal" @click="handleFormClickPersonal">
                                    <img :src="local.linkImgProfile" alt="" class="w-full h-full object-contain" :class="{ 'hidden': local.linkImgProfile === ''}" @load="local.isErrorFoto = false" @error="renderImgFallback">
                                    <I_Drop class="mt-2 h-15 relative top-2 pointer-events-none" :class="local.linkImgProfile !== '' && !local.isErrorFoto ? 'hidden' : ''"/>
                                    <span class="text-center text-lg" :class="local.linkImgProfile !== '' && !local.isErrorFoto ? 'hidden' : ''">Pilih atau jatuhkan file gambar</span>
                                    <input type="file" class="hidden" ref="fileInputProfile" @change="handleFileChangePersonal">
                                </div>
                            </div>
                            <div class="flex flex-col gap-0.5 phone:gap-1 md:gap-2 xl:gap-2.5">
                                <FormField name="foto" class="hidden">
                                    <InputText id="foto" type="file" hidden/>
                                </FormField>
                                <FormField name="nama_lengkap" class="flex flex-col gap-0.25 !text-sm phone:!text-base md:!text-lg lg:!text-xl xl:!text-2xl">
                                    <label for="nama_lengkap">Nama Lengkap</label>
                                    <InputText id="nama_lengkap" type="text" placeholder="Masukkan Nama Lengkap" :class="{ 'pointer-events-none': !local.isWUpProfile }"/>
                                </FormField>
                                <div class="flex gap-3">
                                    <FormField name="jenis_kelamin" class="flex-1 flex flex-col gap-0.25 !text-sm phone:!text-base md:!text-lg lg:!text-xl xl:!text-2xl">
                                        <label for="jenis_kelamin">Jenis Kelamin</label>
                                        <InputText id="jenis_kelamin" type="text" placeholder="Enter Email Address" :class="{ 'pointer-events-none': !local.isWUpProfile }"/>
                                    </FormField>
                                    <FormField name="no_telpon" class="flex-1 flex flex-col gap-0.25 !text-sm phone:!text-base md:!text-lg lg:!text-xl xl:!text-2xl">
                                        <label for="no_telpon">No Telpon</label>
                                        <InputText id="no_telpon" type="text" placeholder="Masukkan Nomor Telepon" :class="{ 'pointer-events-none': !local.isWUpProfile }" @input="formatNoProfile($form)"/>
                                    </FormField>
                                </div>
                                <FormField name="email" class="flex flex-col gap-0.25 !text-sm phone:!text-base md:!text-lg lg:!text-xl xl:!text-2xl">
                                    <label for="email">Email Address</label>
                                    <InputText id="email" type="email" placeholder="Enter Email Address" :class="{ 'pointer-events-none': !local.isWUpProfile }"/>
                                </FormField>
                            </div>
                            <div>
                                <div v-show="local.isWUpProfile">
                                    <Button type="button" label="Cancel Update" class="!w-full mt-3 sm:mt-5 lg:mt-7 mx-auto !px-2 lg:!px-4 !py-1 lg:!py-2 !rounded-sm lg:!rounded-[17px] !text-sm sm:!text-base lg:!text-lg xl:!text-xl !font-normal" @click="local.isWUpProfile = false"/>
                                    <Button type="submit" label="Update Profile" class="!w-full mt-3 sm:mt-5 lg:mt-7 mx-auto !px-2 lg:!px-4 !py-1 lg:!py-2 !rounded-sm lg:!rounded-[17px] !text-sm sm:!text-base lg:!text-lg xl:!text-xl !font-normal"/>
                                </div>
                                <Button v-show="!local.isWUpProfile" type="button" label="Edit Profile" class="!w-full mt-3 sm:mt-5 lg:mt-7 mx-auto !px-2 lg:!px-4 !py-1 lg:!py-2 !rounded-sm lg:!rounded-[17px] !text-sm sm:!text-base lg:!text-lg xl:!text-xl !font-normal" @click="local.isWUpProfile = true"/>
                            </div>
                        </Form>
                    </TabPanel>
                    <TabPanel value="1">
                        <Form :resolver="gantiPasswordValidator" @submit="updatePasswordForm" v-slot="$form" class="flex flex-col gap-0.5 phone:gap-1 md:gap-2 xl:gap-2.5 rounded-3xl">
                            <FormField name="pass_lama" class="flex flex-col gap-0.25 !text-sm phone:!text-base md:!text-lg lg:!text-xl xl:!text-2xl">
                                <label for="pass_lama bg-amber-500">Password Sekarang</label>
                                <div class="relative w-full">
                                    <InputText id="pass_lama" :type="local.isPasswordLamaShow ? 'text' : 'password'" placeholder="Enter Your Password" class="!w-full"/>
                                    <div class="absolute top-1/2 -translate-y-1/2 3xs:right-1 sm:right-2 xl:right-3" @click="showPass('lama')">
                                        <div class="relative 3xs:w-[17px] lg:w-8 xl:w-10 flex items-center justify-center">
                                            <I_eye class="absolute fill-palText w-full transition duration-[400ms]" :class="!$form.pass_lama?.value || !local.isPasswordLamaShow ? 'opacity-0 pointer-events-none' : 'opacity-100 cursor-pointer'"/>
                                            <I_eye_slash class="absolute fill-palText w-full transition duration-400" :class="!$form.pass_lama?.value || local.isPasswordLamaShow ? 'opacity-0 pointer-events-none' : 'opacity-100 cursor-pointer'"/>
                                        </div>
                                    </div>
                                </div>
                            </FormField>
                            <FormField name="pass_baru" class="flex flex-col gap-0.25 !text-sm phone:!text-base md:!text-lg lg:!text-xl xl:!text-2xl">
                                <label for="pass_baru bg-amber-500">Password Baru</label>
                                <div class="relative w-full">
                                    <InputText id="pass_baru" :type="local.isPasswordBaruShow ? 'text' : 'password'" placeholder="Enter Your Password" class="!w-full"/>
                                    <div class="absolute top-1/2 -translate-y-1/2 3xs:right-1 sm:right-2 xl:right-3" @click="showPass('baru')">
                                        <div class="relative 3xs:w-[17px] lg:w-8 xl:w-10 flex items-center justify-center">
                                            <I_eye class="absolute fill-palText w-full transition duration-[400ms]" :class="!$form.pass_baru?.value || !local.isPasswordBaruShow ? 'opacity-0 pointer-events-none' : 'opacity-100 cursor-pointer'"/>
                                            <I_eye_slash class="absolute fill-palText w-full transition duration-400" :class="!$form.pass_baru?.value || local.isPasswordBaruShow ? 'opacity-0 pointer-events-none' : 'opacity-100 cursor-pointer'"/>
                                        </div>
                                    </div>
                                </div>
                            </FormField>
                            <FormField name="pass_baru_ulangi" class="flex flex-col gap-0.25 !text-sm phone:!text-base md:!text-lg lg:!text-xl xl:!text-2xl">
                                <label for="pass_baru_ulangi bg-amber-500">Masukkan kembali Password Baru</label>
                                <div class="relative w-full">
                                    <InputText id="pass_baru_ulangi" :type="local.isPasswordBaruUlangiShow ? 'text' : 'password'" placeholder="Enter Your Password" class="!w-full"/>
                                    <div class="absolute top-1/2 -translate-y-1/2 3xs:right-1 sm:right-2 xl:right-3" @click="showPass('ulangi')">
                                        <div class="relative 3xs:w-[17px] lg:w-8 xl:w-10 flex items-center justify-center">
                                            <I_eye class="absolute fill-palText w-full transition duration-[400ms]" :class="!$form.pass_baru_ulangi?.value || !local.isPasswordBaruUlangiShow ? 'opacity-0 pointer-events-none' : 'opacity-100 cursor-pointer'"/>
                                            <I_eye_slash class="absolute fill-palText w-full transition duration-400" :class="!$form.pass_baru_ulangi?.value || local.isPasswordBaruUlangiShow ? 'opacity-0 pointer-events-none' : 'opacity-100 cursor-pointer'"/>
                                        </div>
                                    </div>
                                </div>
                            </FormField>
                            <Button type="submit" label="Update Password" class="!w-full mt-3 sm:mt-5 lg:mt-7 mx-auto !px-2 lg:!px-4 !py-1 lg:!py-2 !rounded-sm lg:!rounded-[17px] !text-sm sm:!text-base lg:!text-lg xl:!text-xl !font-normal"/>
                        </Form>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    </section>
</template>