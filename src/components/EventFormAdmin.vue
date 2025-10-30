<script setup lang="ts">
import * as z from 'zod'
import { zodResolver } from "@primevue/forms/resolvers/zod"
import { Form, FormField } from "@primevue/forms"
import { onMounted, reactive, ref, type Ref, type ComponentPublicInstance, nextTick, watch, onBeforeMount, computed, type ComputedRef } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useConfig } from '@/composables/useConfig'
import useAxios from '@/composables/api/axios'
import RSAComposables from '@/composables/RSA'
import useEncryption from '@/composables/encryption'
import { useGlobalStore } from '@/stores/Global'
import { useFetchDataStore } from '@/stores/FetchData'
import { useToast } from 'primevue/usetoast'
import { width, breakpoints } from '@/composables/useScreenSize'
import{ isImageFile, base64_decode_to_blob } from '@/utils/Base64File'
import Im_DefaultBoy from '@/assets/images/default_boy.jpg'
import Im_DefaultGirl from '@/assets/images/default_girl.png'
import I_Close from '@/assets/icons/close.svg'
import I_eye from '@/assets/icons/eye.svg'
import I_eye_slash from '@/assets/icons/eye-slash.svg'
import { base64_encode } from '@/utils/Base64File'
import { capitalizeFirstLetter } from '@/utils/global'
interface EventData{
    event_name: string
    event_description: string
    event_group: string
    foto: string[]
}
interface ModeForm{
    name: string
    url: string
    method: 'POST' | 'PUT' | 'GET' | 'DELETE'
}
const { reqData } = useAxios()
const fetchDataS = useFetchDataStore()
const toast = useToast()
const modeForm: ModeForm[] = [
    {
        'name': 'tambah',
        'url': '/api/kelola-event/tambah-form',
        method: 'POST',
    },
    {
        'name': 'update',
        'url': '/api/kelola-event/update-form',
        method: 'PUT',
    },
]
const props = defineProps<{
    mode: 'tambah' | 'detail',
    inpDataGroup?: { name: string, value: string }[],
    inpData?: EventData,
}>()
const local = reactive({
    mode: 'tambah' as 'tambah' | 'detail' | 'update',
    isFirstTime: true,
    oldInput: {} as Record<string, any>,
})
const inpFiles = ref(
    Array.from({ length: 7 }, () => ({
        mode: 'link' as 'drop' | 'link',
        isShowOverlay: breakpoints.greater('sm').value,
        isHoveringOverlay: false,
        isLoadingImg: false,
        isErrorImg: false,
        file: null as File | null,
        preview: '',
        inpImg: '',
    }))
)
const selectedMode: ComputedRef<ModeForm> = computed(() => modeForm.find((i) => i.name === local.mode)!)
const eventForm: Ref = ref(null)
const fileInputEvent = ref<(HTMLInputElement | null)[]>([])
watch(() => props.inpDataGroup, () => {
    local.isFirstTime = false
    if(props.mode == 'detail'){
        local.oldInput = props.inpData ?? {}
        eventForm.value.setValues({
            event_name: props.inpData?.event_name,
            event_description: props.inpData?.event_description,
            event_group: props.inpData?.event_group,
        })
    }
})
const onImgLoad = (f, e: Event) => {
    const img = e.target as HTMLImageElement
    if(img.naturalWidth === 0 || img.naturalHeight === 0){
        f.isErrorImg = true
    }else{
        f.isErrorImg = false
    }
    f.isLoadingImg = false
    f.hasTriedLoad = true
}
const onImgError = (f) => {
  f.isErrorImg = true
  f.isLoadingImg = false
  f.hasTriedLoad = true
}
const handleInpImgClick = (index: number) => {
    const f = inpFiles.value[index]
    if(f.preview){
        if(breakpoints.greater('sm').value) return
        f.isShowOverlay = !f.isShowOverlay
    }else{
        fileInputEvent.value?.[index].click()
    }
}
const handleFileChange = (event: any, index: number) => {
    handleFiles(index, event.target.files)
}
const handleDragOver = (event: Event) => {
    event.preventDefault()
}
const handleDropFile = (event: any, index: number) => {
    event.preventDefault()
    handleFiles(index, event.dataTransfer.files)
}
const handleFiles = async (index: number, files: FileList) => {
    const f = inpFiles.value[index]
    if(files.length !== 1){
        toast.add({ severity: 'error', summary: 'Gagal Upload', detail: 'Pilih satu file foto.', life: 2500 })
        return
    }
    const file = files[0]
    if(!file.type.startsWith('image/')){
        toast.add({ severity: 'error', summary: 'Gagal Upload', detail: 'File bukan gambar.', life: 2500 })
        return
    }
    if(file.size > 2 * 1024 * 1024){
        toast.add({ severity: 'error', summary: 'Gagal Upload', detail: 'Ukuran > 2MB.', life: 2500 })
        return
    }
    f.file = file
    f.preview = URL.createObjectURL(file)
    f.inpImg = 'Local'
    f.mode = 'drop'
    f.isErrorImg = false
    f.isHoveringOverlay = false
    eventForm.value.setFieldValue(`foto_${index + 1}`, file)
}
const handleInpLink = (index: number) => {
    const f = inpFiles.value[index]
    const val = f.inpImg.trim()
    f.isErrorImg = false
    f.hasTriedLoad = false
    f.file = null
    f.mode = 'link'
    if(!val){
        f.preview = ''
        f.isLoadingImg = false
        return
    }
    f.preview = ''
    f.isLoadingImg = true
    if(/^https?:\/\//i.test(val)){
        nextTick(() => (f.preview = val))
    }else{
        f.isErrorImg = true
        f.isLoadingImg = false
        f.hasTriedLoad = true
    }
}
const delFile = (index: number) => {
    const f = inpFiles.value[index]
    if(f.preview && f.mode === 'drop') URL.revokeObjectURL(f.preview)
    Object.assign(f, {
        mode: 'link',
        file: null,
        preview: '',
        inpImg: '',
        isErrorImg: false,
        isShowOverlay: breakpoints.greater('sm').value,
    })
    eventForm.value.setFieldValue(`foto_${index + 1}`, null)
}
watch(breakpoints.active(), () => {
    inpFiles.value.forEach(f => {
        f.isShowOverlay = breakpoints.greater('sm').value
    })
}, { immediate: true })
const eventValidator = zodResolver(z.object({
    event_name: z.string().min(1, 'Nama event harus diisi!').max(30, 'Nama event maksimal 30 karakter'),
    event_description: z.string().min(1, 'Deskripsi event harus diisi!').max(300, 'Deskripsi event maksimal 30 karakter'),
    email: z.string().min(1, 'Email Harus diisi!').max(45, 'Email maksimal 45 karakter').email('Masukkan email dengan benar!'),
    foto: z.union([z.instanceof(File), z.null()]).optional().refine(file => !file || file.size <= 2 * 1024 * 1024, { message: 'Foto maksimal 2 MB !' })
}))
const sendEventForm = async({ valid, states, reset }: any) => {
    if(local.mode == 'detail') return
    if(!valid){
        toast.add({ severity: 'error', summary: 'Gagal ' + capitalizeFirstLetter(props.mode) + ' Event',  detail: Object.values(states as Record<string, any>).find((field: any) => field?.invalid)?.error?.message || 'Periksa kembali input !', life: 3000 })
        return
    }
    if(props.mode == 'detail' && states.nama_lengkap.value === local.oldInput.nama_lengkap && states.email.value === local.oldInput.email && states.jenis_kelamin.value === local.oldInput.jenis_kelamin && states.no_telpon.value === local.oldInput.no_telpon && states.foto.value === null){
        return toast.add({ severity: 'error', summary: 'Gagal ' + capitalizeFirstLetter(props.mode) + ' Event', detail: 'Data belum diubah !', life: 3000 })
    }
    const fileFoto = await base64_encode(states.foto.value)
    const foto = []
    // for(let i = 1; i <= 7; i++){
    //     const img = local.linkImg[i]
    //     if(!img) continue
    //     if(local.isLocal[i]){
    //         // convert local file to base64
    //         const file = await base64_encode(states[`foto_${i}`]?.value)
    //         foto.push({
    //             data: file.data,
    //             meta: file.meta,
    //             source: 'local',
    //         })
    //     } else {
    //         foto.push({
    //             url: img,
    //             source: 'external',
    //         })
    //     }
    // }
    const res = await reqData({
        url: selectedMode.value.url,
        method: selectedMode.value.method,
        reqBody: {
            event_name: states.event_name.value,
            event_description: states.event_description.value,
            event_group: states.event_group.value,
            foto: [
                //
            ]
            // foto: {
            //     data: fileFoto.data,
            //     meta: fileFoto.meta
            // }
        },
        reqType: 'Json',
        isNeedLoading: true,
    })
    if(res.status == 'error'){
        toast.add({ severity: 'error', summary: 'Gagal ' + capitalizeFirstLetter(props.mode) + ' Event', detail: res.message, life: 3000 })
        return
    }
    await nextTick()
    setTimeout(() => {
        local.oldInput = Object.fromEntries(
            Object.entries(states).map(([k, v]: any) => [k, v.value])
        )
        toast.add({ severity: 'success', summary: 'Berhasil ' + capitalizeFirstLetter(props.mode) + ' Event', detail: res.message, life: 3000 })
        if(local.mode == 'tambah'){
            reset()
        }
        setTimeout(() => {
        }, 3000);
    }, 5)
}
</script>
<template>
    <Form ref="eventForm" :resolver="eventValidator" @submit="sendEventForm" v-slot="$form" class="flex flex-col gap-3 sm:gap-4 xl:gap-5 rounded-3xl">
        <div class="flex flex-col gap-0.5 phone:gap-1 md:gap-2 xl:gap-2.5">
            <FormField name="event_name" class="flex flex-col gap-0.25 !text-sm sm:!text-base lg:!text-lg">
                <label for="event_name">Nama Event</label>
                <InputText id="event_name" type="text" placeholder="Masukkan nama event"/>
            </FormField>
            <FormField name="event_description" class="flex flex-col gap-0.25 !text-sm sm:!text-base lg:!text-lg">
                <label for="event_description">Deskripsi Event</label>
                <InputText id="event_description" type="text" placeholder="Masukkan deskripsi event"/>
            </FormField>
            <FormField name="event_group" class="flex flex-col gap-0.25 !text-sm sm:!text-base lg:!text-lg">
                <label for="event_group">Kategori Event</label>
                <Select v-model="$form.event_group" :options="props.inpDataGroup" optionLabel="name" optionValue="value" placeholder="Pilih kategori event" class="w-full"/>
            </FormField>
            <div class="grid grid-cols-1 phone:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
                <FormField v-for="(fileObj, iMg) in inpFiles" :name="'imageicon_' + iMg" class="w-full">
                    <label :for="'event_group ' + iMg">Foto Event {{ iMg }}</label>
                    <div class="flex flex-col gap-5">
                        <div class="relative w-full h-40 flex flex-col justify-center items-center cursor-pointer rounded-lg text-gray-500" :class="{ 'border-3 border-dashed border-black': !fileObj.preview || fileObj.isErrorImg }" @dragover.prevent="!fileObj.preview && handleDragOver($event)" @drop.prevent="!fileObj.preview && handleDropFile($event, iMg)" @click="handleInpImgClick(iMg)">
                            <div v-if="fileObj.preview !== ''" v-show="fileObj.isShowOverlay" class="absolute inset-0 backdrop-blur-xs sm:backdrop-blur-none z-20 flex items-center justify-center transition" :class="{ 'sm:backdrop-blur-xs': fileObj.isHoveringOverlay }">
                                <div class="size-[45%] rounded-full flex items-center justify-center" @mouseenter="fileObj.isHoveringOverlay = true" @mouseleave="fileObj.isHoveringOverlay = false">
                                    <I_Close v-show="breakpoints.greater('sm') || fileObj.isShowOverlay" class="size-7 sm:size-8 md:size-9 lg:size-10 p-1.25 bg-red-500 sm:bg-transparent hover:sm:bg-red-500 text-white sm:text-transparent hover:sm:text-white rounded-full shadow-md sm:shadow-none hover:sm:shadow-md cursor-pointer transition" @click.stop="delFile(iMg)"></I_Close>
                                </div>
                            </div>
                            <img v-if="fileObj.preview && !fileObj.isErrorImg" :src="fileObj.preview" class="object-contain w-full h-full" @load="onImgLoad(fileObj, $event)" @error="onImgError(fileObj)"/>
                            <template v-if="!fileObj.preview && !fileObj.file && !fileObj.hasTriedLoad">
                                <img src="@/assets/images/drop.png" class="w-10 mb-2" />
                                <span>Pilih file atau jatuhkan gambar</span>
                            </template>
                            <div v-if="fileObj.isLoadingImg" class="absolute inset-0 flex justify-center items-center bg-white/60 text-sm font-medium">Memuat gambar...</div>
                            <div v-if="fileObj.isErrorImg && fileObj.hasTriedLoad" class="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                                <span>⚠️ Gagal memuat gambar</span>
                            </div>
                            <input type="file" class="hidden" ref="fileInputEvent" accept="image/*" @change="handleFileChange($event, iMg)"/>
                        </div>
                        <InputText v-model="fileObj.inpImg" placeholder="Masukkan link foto event" :readonly="fileObj.mode === 'drop'" @input="handleInpLink(iMg)"/>
                    </div>
                </FormField>
            </div>
        </div>
        <div class="w-full flex justify-between">
            <Button :as="RouterLink" to="/kelola-event" label="Kembali" class="!w-full phone:!w-fit mt-3 sm:mt-5 lg:mt-7 mx-auto !px-2 lg:!px-4 !py-1 lg:!py-2 !rounded-sm sm:!rounded-md md:!rounded-lg lg:!rounded-xl !text-base sm:!text-lg lg:!text-xl xl:!text-2xl !font-normal"/>
            <template v-if="props.mode == 'tambah'">
                <Button type="submit" label="Tambah Event" class="!w-full phone:!w-fit mt-3 sm:mt-5 lg:mt-7 mx-auto !px-2 lg:!px-4 !py-1 lg:!py-2 !rounded-sm sm:!rounded-md md:!rounded-lg lg:!rounded-xl !text-base sm:!text-lg lg:!text-xl xl:!text-2xl !font-normal"/>
            </template>
            <template v-else>
                <Button v-if="local.mode == 'detail'" type="submit" label="Edit Event" class="!w-full phone:!w-fit mt-3 sm:mt-5 lg:mt-7 mx-auto !px-2 lg:!px-4 !py-1 lg:!py-2 !rounded-sm sm:!rounded-md md:!rounded-lg lg:!rounded-xl !text-base sm:!text-lg lg:!text-xl xl:!text-2xl !font-normal"/>
                <template v-else>
                    <Button type="submit" label="Batal Update" class="!w-full phone:!w-fit mt-3 sm:mt-5 lg:mt-7 mx-auto !px-2 lg:!px-4 !py-1 lg:!py-2 !rounded-sm sm:!rounded-md md:!rounded-lg lg:!rounded-xl !text-base sm:!text-lg lg:!text-xl xl:!text-2xl !font-normal"/>
                    <Button type="submit" label="Update Event" class="!w-full phone:!w-fit mt-3 sm:mt-5 lg:mt-7 mx-auto !px-2 lg:!px-4 !py-1 lg:!py-2 !rounded-sm sm:!rounded-md md:!rounded-lg lg:!rounded-xl !text-base sm:!text-lg lg:!text-xl xl:!text-2xl !font-normal"/>
                </template>
            </template>
        </div>
    </Form>
</template>