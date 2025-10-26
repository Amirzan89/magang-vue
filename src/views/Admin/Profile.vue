<script setup lang="ts">
import * as z from 'zod'
import { zodResolver } from "@primevue/forms/resolvers/zod"
import { Form, FormField } from "@primevue/forms"
import { onMounted, reactive, ref, type Ref, type ComponentPublicInstance, nextTick, watch, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useAxios from '@/composables/api/axios'
import RSAComposables from '@/composables/RSA'
import useEncryption from '@/composables/encryption'
import { useFetchDataStore } from '@/stores/FetchData'
import { useToast } from 'primevue/usetoast'
import { width, breakpoints } from '@/composables/useScreenSize'
import{ isImageFile, base64_decode_to_blob, type Base64File } from '@/utils/Base64File'
import Im_DefaultBoy from '@/assets/images/default_boy.jpg'
import Im_DefaultGirl from '@/assets/images/default_girl.png'
import I_Close from '@/assets/icons/close.svg'
import I_eye from '@/assets/icons/eye.svg'
import I_eye_slash from '@/assets/icons/eye-slash.svg'
import { base64_encode } from '@/utils/Base64File'
const route = useRoute()
const router = useRouter()
const { reqData } = useAxios()
const rsaComp = RSAComposables()
const { genIV, decryptRes } = useEncryption()
const fetchDataS = useFetchDataStore()
const toast = useToast()
const local = reactive({
    isFirstTime: true,
    isLoadingImgShow: true,
    linkImgShow: '' as string,
    isShowOverlay: false,
    linkImgProfile: '' as string,
    isErrorFoto: false as boolean,
    isPasswordLamaShow: false,
    isPasswordBaruShow: false,
    isPasswordBaruUlangiShow: false,
})
const profileForm: Ref = ref(null)
const fileInputProfile: Ref = ref(null)
const itemsGender = ref([
    { name: 'Laki-laki', value: 'laki-laki' },
    { name: 'Perempuan', value: 'perempuan' },
])
nextTick(() => {
    local.isFirstTime = false
    local.linkImgProfile = fetchDataS.imgUrl || ''
    local.linkImgShow = fetchDataS.imgUrl || ''
    profileForm.value.setValues({
        nama_lengkap: fetchDataS.cacheAuth.nama_lengkap,
        jenis_kelamin: fetchDataS.cacheAuth.jenis_kelamin,
        no_telpon: fetchDataS.cacheAuth.no_telpon,
        email: fetchDataS.cacheAuth.email
    })
})
onBeforeMount(async() => {
    const res = await reqData({
        url: '/api' + route.path,
        method: 'POST',
        reqType: 'Json',
    })
    if(res.status == 'error'){
        if(res.code === 401){
            toast.add({ severity: 'error', summary: 'Gagal Autentikasi', detail: 'Sesi telah habis, silahkan login kembali !', life: 3000 })
            setTimeout(() => router.push('/login'), 3000)
            return
        }
        toast.add({ severity: 'error', summary: 'Gagal Ambil Data Halaman', detail: res.message, life: 3000 })
        return
    }
    const iv = rsaComp.hexCus.enc(await genIV())
    let resFoto = await reqData({
        url: '/api/admin/download/foto-profile',
        headers: { 'X-Auth-Check': 'true', 'X-UniqueId': iv },
        isEncrypt: false,
    })
    const decrypted = decryptRes(resFoto.message, iv)
    resFoto = {
        ...resFoto,
        message: decrypted.message,
        data: decrypted.data,
    }
    if(resFoto.status == 'error'){
        if(resFoto.code === 401){
            toast.add({ severity: 'error', summary: 'Gagal Autentikasi', detail: 'Sesi telah habis, silahkan login kembali !', life: 3000 })
            setTimeout(() => router.push('/login'), 3000)
            return
        }
        if(resFoto.code !== 404){
            toast.add({ severity: 'error', summary: 'Gagal Ambil Foto Profile', detail: resFoto.message, life: 3000 })
        }
    }
    resFoto.data && resFoto.data !== null && isImageFile(resFoto.data.meta) ? fetchDataS.setDecryptedImage(base64_decode_to_blob(resFoto.data)) : fetchDataS.clearDecryptedImage()
    if(local.isFirstTime || local.linkImgProfile === ''){
        local.linkImgProfile = fetchDataS.imgUrl ?? (res.data.jenis_kelamin === 'perempuan' ? Im_DefaultGirl : Im_DefaultBoy)
    }
    local.linkImgShow = fetchDataS.imgUrl ?? (res.data.jenis_kelamin === 'perempuan' ? Im_DefaultGirl : Im_DefaultBoy)
    await nextTick()
    profileForm.value.setValues({
        nama_lengkap: res.data.nama_lengkap,
        jenis_kelamin: res.data.jenis_kelamin,
        no_telpon: res.data.no_telpon,
        email: res.data.email
    })
    fetchDataS.cacheAuth = res.data
})
const renderImgFallback = () => {
    if(!fetchDataS.cacheAuth) return Im_DefaultBoy
    return fetchDataS.cacheAuth.jenis_kelamin == 'laki-laki' ? Im_DefaultBoy : Im_DefaultGirl
}
const handleFormClickPersonal = () => {
    if(local.linkImgProfile){
        if(breakpoints.greater('sm').value) return
        local.isShowOverlay = !local.isShowOverlay
    }else{
        fileInputProfile.value.click()
    }
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
    local.isShowOverlay = false
}
watch(width, () => {
    local.isShowOverlay = breakpoints.greater('sm').value ? true : false
}, { immediate: true })
const delFile = async() => {
    if(local.isFirstTime) return
    URL.revokeObjectURL(local.linkImgProfile)
    local.linkImgProfile = ''
    profileForm.value.setFieldValue('foto', null)
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
    local.linkImgShow = local.linkImgProfile
    fetchDataS.cacheAuth.nama_lengkap = states.nama_lengkap.value
    fetchDataS.cacheAuth.jenis_kelamin = states.jenis_kelamin.value
    fetchDataS.cacheAuth.no_telpon = states.no_telpon.value
    fetchDataS.cacheAuth.email = states.email.value
    fetchDataS.clearDecryptedImage()
    await nextTick()
    setTimeout(() => {
        const fileFoto = states.foto.value
        fetchDataS.setDecryptedImage(new Blob([fileFoto], { type: fileFoto.type }))
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
    <section class="flex flex-col sm:gap-0.5 md:gap-1 lg:gap-1.5">
        <h1 class="!p-0 !m-0 !text-xl sm:!text-2xl lg:!text-3xl xl:!text-4xl">Profile</h1>
        <div class="card !pt-0 !px-3 !pb-4" style="box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.35);">
            <Tabs value="0">
                <TabList>
                    <Tab value="0">Profile</Tab>
                    <Tab value="1">Update Profile</Tab>
                    <Tab value="2">Update Password</Tab>
                </TabList>
                <TabPanels class="!p-2">
                    <TabPanel value="0">
                        <div class="flex items-center 3xs:h-30 sm:h-35 lg:h-40 xl:h-50 2xl:h-55 mb-4">
                            <div class="relative 3xs:w-[85%] xs:w-[70%] phone:w-[55%] sm:w-[50%] md:w-[40%] lg:w-[32%] xl:w-[30%] 2xl:w-[25%] 3xs:h-30 sm:h-35 lg:h-40 xl:h-50 2xl:h-55 flex flex-col justify-center mx-auto gap-2 rounded-lg">
                                <Skeleton v-if="local.isLoadingImgShow || local.linkImgShow == ''" shape="rectangle" width="100%" height="100%" borderRadius="20px"/>
                                <img :src="local.linkImgShow" alt="" class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-full h-full object-contain" :class="{ 'hidden': local.linkImgShow === ''}" @load="local.isLoadingImgShow = false" @error="local.isLoadingImgShow = false"/>
                            </div>
                        </div>
                        <div class="ml-[2%] grid grid-cols-[auto_auto_1fr] gap-x-2 gap-y-1 !text-sm sm:!text-base lg:!text-lg xl:!text-xl items-start">
                            <p class="!m-0">Nama Lengkap</p>
                            <span class="text-center w-2">:</span>
                            <p class="!m-0">{{ profileForm?.states.nama_lengkap.value }}</p>

                            <p class="!m-0">Jenis Kelamin</p>
                            <span class="text-center w-2">:</span>
                            <p class="!m-0">{{ profileForm?.states.jenis_kelamin.value }}</p>

                            <p class="!m-0">No Telpon</p>
                            <span class="text-center w-2">:</span>
                            <p class="!m-0">{{ profileForm?.states.no_telpon.value }}</p>

                            <p class="!m-0">Email</p>
                            <span class="text-center w-2">:</span>
                            <p class="!m-0">{{ profileForm?.states.email.value }}</p>
                        </div>
                    </TabPanel>
                    <TabPanel value="1">
                        <Form ref="profileForm" :resolver="profileValidator" @submit="updateProfileForm" v-slot="$form" class="flex flex-col gap-3 sm:gap-4 xl:gap-5 rounded-3xl">
                            <div class="col-12 md:col-10">
                                <div class="relative w-full 3xs:w-[85%] xs:w-[70%] phone:w-[55%] sm:w-[50%] md:w-[45%] lg:w-[35%] xl:w-[30%] 2xl:w-[25%] h-30 3xs:h-35 sm:h-35 md:h-37 lg:h-42 xl:h-50 2xl:h-55 flex flex-col justify-center items-center mx-auto cursor-pointer gap-2 rounded-lg" :class="{
                                    'border-black border-dashed border-3' : local.linkImgProfile === '' || local.isErrorFoto,
                                }" @dragover.prevent="local.linkImgProfile === '' && handleDragOverPersonal($event)" @drop.prevent="local.linkImgProfile === '' && handleDropPersonal($event)" @click="handleFormClickPersonal">
                                    <div v-if="local.linkImgProfile !== ''" v-show="local.isShowOverlay" class="absolute inset-0 backdrop-blur-xs sm:backdrop-blur-none hover:sm:backdrop-blur-xs z-20 flex items-center justify-center transition">
                                        <I_Close v-show="breakpoints.greater('sm') || local.isShowOverlay" class="size-7 sm:size-8 md:size-9 lg:size-10 p-1.25 bg-red-500 sm:bg-transparent hover:sm:bg-red-500 text-white sm:text-transparent hover:sm:text-white rounded-full shadow-md sm:shadow-none hover:sm:shadow-md cursor-pointer transition" @click.stop="delFile"></I_Close>
                                    </div>
                                    <img :src="local.linkImgProfile" alt="" class="w-full h-full object-contain" :class="{ 'hidden': local.linkImgProfile === ''}" @load="local.isErrorFoto = false" @error="renderImgFallback">
                                    <img src="@/assets/images/drop.png" class="size-12.5 phone:size-14 sm:size-16 md:size-18 lg:size-20 xl:size-23 2xl:size-25" :class="local.linkImgProfile !== '' && !local.isErrorFoto ? 'hidden' : ''"/>
                                    <span class="w-[70%] phone:w-full text-center text-base sm:text-lg lg:text-xl" :class="local.linkImgProfile !== '' && !local.isErrorFoto ? 'hidden' : ''">Pilih file atau jatuhkan gambar</span>
                                    <input type="file" class="hidden" ref="fileInputProfile" @change="handleFileChangePersonal">
                                </div>
                            </div>
                            <div class="flex flex-col gap-0.5 phone:gap-1 md:gap-2 xl:gap-2.5">
                                <FormField name="foto" class="hidden">
                                    <InputText id="foto" type="file" hidden/>
                                </FormField>
                                <FormField name="nama_lengkap" class="flex flex-col gap-0.25 !text-sm sm:!text-base lg:!text-lg">
                                    <label for="nama_lengkap">Nama Lengkap</label>
                                    <InputText id="nama_lengkap" type="text" placeholder="Masukkan Nama Lengkap"/>
                                </FormField>
                                <div class="grid grid-rows-2 grid-cols-1 sm:grid-rows-1 sm:grid-cols-2 sm:gap-3">
                                    <FormField name="jenis_kelamin" class="flex flex-col gap-0.25 !text-sm sm:!text-base lg:!text-lg">
                                        <label for="jenis_kelamin">Jenis Kelamin</label>
                                        <Select :options="itemsGender" optionLabel="name" optionValue="value" placeholder="Pilih Jenis Kelamin" class="w-full"/>
                                    </FormField>
                                    <FormField name="no_telpon" class="!flex-1 flex flex-col gap-0.25 !text-sm sm:!text-base lg:!text-lg">
                                        <label for="no_telpon">No Telpon</label>
                                        <InputText id="no_telpon" type="text" placeholder="Masukkan Nomor Telepon" @input="formatNoProfile($form)"/>
                                    </FormField>
                                </div>
                                <FormField name="email" class="flex flex-col gap-0.25 !text-sm sm:!text-base lg:!text-lg">
                                    <label for="email">Email Address</label>
                                    <InputText id="email" type="email" placeholder="Masukkan Alamat Email"/>
                                </FormField>
                            </div>
                            <Button type="submit" label="Update Profile" class="!w-full phone:!w-fit mt-3 sm:mt-5 lg:mt-7 mx-auto !px-2 lg:!px-4 !py-1 lg:!py-2 !rounded-sm sm:!rounded-md md:!rounded-lg lg:!rounded-xl !text-base sm:!text-lg lg:!text-xl xl:!text-2xl !font-normal"/>
                        </Form>
                    </TabPanel>
                    <TabPanel value="2">
                        <Form :resolver="gantiPasswordValidator" @submit="updatePasswordForm" v-slot="$form" class="flex flex-col gap-0.5 phone:gap-1 md:gap-2 xl:gap-2.5 rounded-3xl">
                            <FormField name="pass_lama" class="flex flex-col gap-0.25 !text-sm sm:!text-base lg:!text-lg">
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
                            <FormField name="pass_baru" class="flex flex-col gap-0.25 !text-sm sm:!text-base lg:!text-lg">
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
                            <FormField name="pass_baru_ulangi" class="flex flex-col gap-0.25 !text-sm sm:!text-base lg:!text-lg">
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
                            <Button type="submit" label="Update Password" class="!w-full phone:!w-fit mt-3 sm:mt-5 lg:mt-7 mx-auto !px-2 lg:!px-4 !py-1 lg:!py-2 !rounded-sm sm:!rounded-md md:!rounded-lg lg:!rounded-xl !text-base sm:!text-lg lg:!text-xl xl:!text-2xl !font-normal"/>
                        </Form>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    </section>
</template>