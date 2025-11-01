<script setup lang="ts">
import * as z from 'zod'
import { zodResolver } from "@primevue/forms/resolvers/zod"
import { Form, FormField } from "@primevue/forms"
import { id as idLocale } from 'date-fns/locale'
import { format } from 'date-fns'
import { reactive, ref, type Ref, nextTick, watch, computed, type ComputedRef, shallowRef } from 'vue'
import { RouterLink } from 'vue-router'
import { useConfig } from '@/composables/useConfig'
import useAxios from '@/composables/api/axios'
import { useToast } from 'primevue/usetoast'
import { breakpoints } from '@/composables/useScreenSize'
import{ isImageFile } from '@/utils/Base64File'
import I_Close from '@/assets/icons/close.svg'
import { base64_encode } from '@/utils/Base64File'
import { capitalizeFirstLetter } from '@/utils/global'
export interface EventGroup{
    name: string
    value: string
}
export interface EventData{
    event_id?: string
    event_name: string
    event_description: string
    event_group: string
    start_date: Date
    end_date: Date
    quota: number
    price: number
    inclusion: string
    foto: string[]
}
interface ModeForm{
    name: string
    url: string
    method: 'POST' | 'PUT' | 'GET' | 'DELETE'
}
interface ModeForm{
    name: string
    url: string
    method: 'POST' | 'PUT' | 'GET' | 'DELETE'
}
interface InpFiles{
    states: 'tambah' | 'hydration' | 'updating' | 'updated'
    mode: 'drop' | 'link'
    isShowOverlay: boolean
    isHoveringOverlay: boolean
    isLoadingImg: boolean
    hasTriedLoad: boolean
    isErrorImg: boolean
    file: File | 'exist' | null
    preview: string
    inpImg: string
}
const publicConfig = useConfig()
const { reqData } = useAxios()
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
    inpDataGroup?: EventGroup[],
    inpData?: EventData,
}>()
const local = reactive({
    mode: props.mode == 'tambah' ? 'tambah' : 'detail' as 'tambah' | 'detail' | 'update',
    isFirstTime: true,
    oldInput: {} as Record<string, any>,
})
const inpFiles: Ref<InpFiles[]> = ref(
    Array.from({ length: 9 }, () => ({
        states: props.mode == 'tambah' ? 'tambah' : 'hydration',
        mode: 'link' as 'drop' | 'link',
        isShowOverlay: breakpoints.greater('sm').value,
        isHoveringOverlay: false,
        isLoadingImg: false,
        hasTriedLoad: false as boolean,
        isErrorImg: false,
        file: null as File | null,
        preview: '',
        inpImg: '',
    }))
)
const selectedMode: ComputedRef<ModeForm> = computed(() => modeForm.find((i) => i.name === local.mode)!)
const eventForm: Ref = ref(null)
const localCategory: Ref<EventGroup[]> = shallowRef([])
const fileInputEvent = ref<(HTMLInputElement | null)[]>([])
watch(() => props.inpDataGroup, () => {
    if(local.isFirstTime && props.inpDataGroup){
        localCategory.value = props.inpDataGroup
        local.isFirstTime = false
    }
    if(props.mode !== 'detail' || !props.inpData) return
    local.mode = 'detail'
    local.oldInput = props.inpData
    const d = props.inpData as EventData
    eventForm.value?.setValues({
        event_name: d.event_name ?? '',
        event_description: d.event_description ?? '',
        event_group: d.event_group ?? '',
        start_date: d.start_date ?? '',
        end_date: d.end_date ?? '',
        quota: Number(d.quota) || 0,
        price: Number(d.price) || 0,
        inclusion: d.inclusion ?? '',
    })
    props.inpData.foto?.forEach((fileObj, i) => {
        if(!fileObj) return
        const img = inpFiles.value[i]
        const isExternal = typeof fileObj === 'string' && /^https?:\/\//i.test(fileObj) && !fileObj.includes(window.location.host)
        Object.assign(img, {
            inpImg: isExternal ? fileObj : 'Local',
            preview: isExternal ? fileObj : `${publicConfig.baseURL}/img/events/${encodeURIComponent(fileObj)}`,
            mode: isExternal ? 'link' : 'drop',
        })
    })
})
const dateSD = computed({
    get(){
        const formVal = eventForm.value?.states.start_date.value
        if(!formVal) return null
        return formVal
    },
    async set(val: Date | null){
        const formVal = eventForm.value?.states
        if(!eventForm.value?.setFieldValue) return
        const newVal = val ? format(val, 'yyyy-MM-dd') : ''
        eventForm.value.setFieldValue('start_date', newVal)
        await nextTick()
        const endVal = formVal.end_date.value
        if((endVal && val) && val > endVal){
            await nextTick()
            eventForm.value.setFieldValue('end_date', newVal)
        }
    },
})
const dateED = computed({
    get(){
        const formVal = eventForm.value?.states.end_date.value
        if(!formVal) return null
        return formVal
    },
    async set(val: Date | null){
        const formVal = eventForm.value?.states
        if(!eventForm.value?.setFieldValue) return
        const newVal = val ? format(val, 'yyyy-MM-dd') : ''
        eventForm.value.setFieldValue('end_date', newVal)
        await nextTick()
        const startVal = formVal.start_date.value
        if((startVal && val) && val < startVal){
            await nextTick()
            eventForm.value.setFieldValue('start_date', newVal)
        }
    },
})
const onImgLoad = (f: InpFiles, e: Event) => {
    const img = e.target as HTMLImageElement
    if(img.naturalWidth === 0 || img.naturalHeight === 0){
        f.isErrorImg = true
    }else{
        if(f.inpImg != 'Local'){
            f.file = 'exist'
        }
        f.isErrorImg = false
    }
    f.isLoadingImg = false
    f.hasTriedLoad = true
}
const onImgError = (f: InpFiles) => {
    f.file = null
    f.isErrorImg = true
    f.isLoadingImg = false
    f.hasTriedLoad = true
}
const handleInpImgClick = (index: number) => {
    if(local.isFirstTime || local.mode == 'detail') return
    const f = inpFiles.value[index]
    if(f.preview){
        if(breakpoints.greater('sm').value) return
        f.isShowOverlay = !f.isShowOverlay
    }else{
        if(fileInputEvent.value[index]) fileInputEvent.value?.[index].click()
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
    if(local.isFirstTime || local.mode == 'detail') return
    const f = inpFiles.value[index]
    if(files.length !== 1){
        toast.add({ severity: 'error', summary: 'Gagal Upload', detail: 'Pilih satu file foto.', life: 2500 })
        return
    }
    const file = files[0]
    if(!isImageFile(file)){
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
    f.states = 'updating'
}
const handleInpLink = (index: number) => {
    const f = inpFiles.value[index]
    const val = f.inpImg.trim()
    f.isErrorImg = false
    f.hasTriedLoad = false
    f.mode = 'link'
    if(!val){
        f.file = null
        f.preview = ''
        f.isLoadingImg = false
        return
    }
    f.preview = ''
    f.isLoadingImg = true
    f.states = 'updating'
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
        states: 'updating',
        mode: 'link',
        file: null,
        preview: '',
        inpImg: '',
        isErrorImg: false,
        isShowOverlay: breakpoints.greater('sm').value,
    })
}
watch(breakpoints.active(), () => {
    inpFiles.value.forEach(f => {
        f.isShowOverlay = breakpoints.greater('sm').value
    })
}, { immediate: true })
const eventValidator = zodResolver(z.object({
    event_name: z.string('Nama event harus diisi !').min(1, 'Nama event harus diisi!').max(50, 'Nama event maksimal 50 karakter'),
    event_description: z.string('Deskripsi event harus diisi !').min(1, 'Deskripsi event harus diisi !').max(300, 'Deskripsi event maksimal 300 karakter'),
    event_group: z.string('Kategori event harus diisi !').trim().min(1, 'Kategori event harus diisi !'),
    start_date: z.union([z.date(), z.string().refine(v => !isNaN(Date.parse(v)), 'Tanggal mulai harus valid')]),
    end_date: z.union([z.date(), z.string().refine(v => !isNaN(Date.parse(v)), 'Tanggal berakhir harus valid')]),
    quota: z.number({ error: 'Kuota harus berupa angka!' }).min(1, 'Kuota minimal 1!'),
    price: z.number({ error: 'Harga harus berupa angka!' }).min(0, 'Harga tidak boleh negatif!'),
    inclusion: z.string('Inklusi wajib diisi !').trim().min(1, 'Inklusi wajib diisi!').max(255, 'Inklusi maksimal 255 karakter!'),
    foto: z.union([z.instanceof(File), z.null()]).optional().refine(file => !file || file.size <= 2 * 1024 * 1024, { message: 'Foto maksimal 2 MB !' })
}))
const sendEventForm = async({ valid, states, reset }: any) => {
    if(local.mode == 'detail') return
    if(!valid){
        toast.add({ severity: 'error', summary: 'Gagal ' + capitalizeFirstLetter(props.mode) + ' Event',  detail: Object.values(states as Record<string, any>).find((field: any) => field?.invalid)?.error?.message || 'Periksa kembali input !', life: 3000 })
        return
    }
    if(local.mode == 'update'){
        const unchanged = ['event_name', 'event_description', 'event_group', 'start_date', 'end_date', 'quota', 'price', 'inclusion'].every(field => states[field]?.value === local.oldInput?.[field])
        const sameFoto = (() => {
            if (!Array.isArray(states.foto?.value) || !Array.isArray(local.oldInput?.foto)) {
                return false
            }
            const newFotos = states.foto.value
            const oldFotos = local.oldInput.foto
            if(newFotos.length !== oldFotos.length) return false
            return newFotos.every((newItem: { data: string, meta: Record<string, any> } | string, i: number) => {
                const oldItem = oldFotos[i]
                if(newItem == null && oldItem == null) return true
                if(typeof newItem === 'string' && typeof oldItem === 'string') return newItem.trim() === oldItem.trim()
                if(typeof newItem === 'object' && typeof oldItem === 'object' && 'data' in newItem && 'data' in oldItem && 'meta' in newItem && 'meta' in oldItem && newItem.data === oldItem.data && newItem.meta?.type === oldItem.meta?.type) return true
                return false
            })
        })()
        if(unchanged && sameFoto){
            return toast.add({ severity: 'error', summary: 'Gagal Detail Event', detail: 'Data belum diubah !', life: 3000 })
        }
    }
    const foto = await Promise.all(inpFiles.value.map(async(item) => {
        if(!item.file) return null
        if(props.mode == 'tambah'){
            if(item.inpImg == 'Local'){
                const fileFoto = await base64_encode((item.file as File))
                return { data: fileFoto.data, meta: fileFoto.meta }
            }else{
                return { url: item.preview }
            }
        }
        if(item.states != 'updating'){
            return { url: item.states }
        }
        if(typeof item.file === 'string' && item.file == 'exist'){
            return { url: item.preview }
        }else{
            const fileFoto = await base64_encode(item.file)
            return { data: fileFoto.data, meta: fileFoto.meta }
        }
    }))
    const reqBody = {
        event_name: states.event_name.value,
        event_description: states.event_description.value,
        event_group: states.event_group.value,
        start_date: states.start_date.value,
        end_date: states.end_date.value,
        quota: states.quota.value.toString(),
        price: states.price.value.toString(),
        inclusion: states.inclusion.value,
        foto
    }
    if (props.mode === 'detail') Object.assign(reqBody, { event_id: props.inpData!.event_id });
    const res = await reqData({
        url: selectedMode.value.url,
        method: selectedMode.value.method,
        reqBody,
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
            inpFiles.value = Array.from({ length: 9 }, () => ({
                states: 'tambah',
                mode: 'link',
                isShowOverlay: breakpoints.greater('sm').value,
                isHoveringOverlay: false,
                isLoadingImg: false,
                hasTriedLoad: false,
                isErrorImg: false,
                file: null,
                preview: '',
                inpImg: 'fff',
            }))
        }else{
            inpFiles.value = inpFiles.value.map(item => ({
                ...item,
                states: item.states == 'updating' ? 'updated' : item.states,
            }))
        }
    }, 5)
}
</script>
<template>
    <Form ref="eventForm" :resolver="eventValidator" @submit="sendEventForm" v-slot="$form" class="flex flex-col gap-3 sm:gap-4 xl:gap-5 rounded-3xl">
        <div class="flex flex-col gap-0.5 phone:gap-1 md:gap-2 xl:gap-2.5">
            <FormField name="event_name" class="flex flex-col gap-0.25 !text-sm sm:!text-base lg:!text-lg">
                <label for="event_name">Nama Event</label>
                <InputText id="event_name" type="text" placeholder="Masukkan nama event" :readonly="props.mode == 'detail' && local.mode == 'detail'"/>
            </FormField>
            <FormField name="event_description" class="flex flex-col gap-0.25 !text-sm sm:!text-base lg:!text-lg">
                <label for="event_description">Deskripsi Event</label>
                <Textarea id="event_description" type="text" placeholder="Masukkan deskripsi event" rows="5" cols="30":readonly="props.mode == 'detail' && local.mode == 'detail'"/>
            </FormField>
            <FormField name="event_group" class="flex flex-col gap-0.25 !text-sm sm:!text-base lg:!text-lg">
                <label for="event_group">Kategori Event</label>
                <Select v-model="$form.event_group" :options="props.inpDataGroup" optionLabel="name" optionValue="value" placeholder="Pilih kategori event" class="w-full" :disabled="props.mode == 'detail' && local.mode == 'detail'"/>
            </FormField>
            <div class="grid grid-rows-2 grid-cols-1 sm:grid-rows-1 sm:grid-cols-2 sm:gap-3">
                <FormField name="start_date" class="flex flex-col gap-0.25 !text-sm sm:!text-base lg:!text-lg">
                    <label for="start_date">Tanggal Mulai Event</label>
                    <DatePicker v-model="dateSD" dateFormat="dd MM yy" showIcon placeholder="Pilih tanggal awal event" :readonly="props.mode == 'detail' && local.mode == 'detail'"/>
                </FormField>
                <FormField name="end_date" class="flex flex-col gap-0.25 !text-sm sm:!text-base lg:!text-lg">
                    <label for="end_date">Tanggal Berakhir Event</label>
                    <DatePicker v-model="dateED" dateFormat="dd MM yy" showIcon :locale="idLocale" placeholder="Pilih tanggal akhir event" :readonly="props.mode == 'detail' && local.mode == 'detail'"/>
                </FormField>
            </div>
            <div class="grid grid-rows-2 grid-cols-1 sm:grid-rows-1 sm:grid-cols-2 sm:gap-3">
                <FormField name="quota" class="flex flex-col gap-0.25 !text-sm sm:!text-base lg:!text-lg">
                    <label for="quota">Kuota Event Event</label>
                    <InputNumber id="quota" :min="1" showButtons inputId="horizontal-buttons" buttonLayout="horizontal" :step="1" placeholder="Masukkan kuota tiket" :readonly="props.mode == 'detail' && local.mode == 'detail'">
                        <template #incrementbuttonicon>
                            <span class="pi pi-plus" />
                        </template>
                        <template #decrementbuttonicon>
                            <span class="pi pi-minus" />
                        </template>
                    </InputNumber>
                </FormField>
                <FormField name="price" class="flex flex-col gap-0.25 !text-sm sm:!text-base lg:!text-lg">
                    <label for="price">Harga Tiket</label>
                    <InputNumber id="price" :min="0" :minFractionDigits="0" :maxFractionDigits="0" showButtons mode="currency" currency="IDR" locale="id-ID" buttonLayout="horizontal" placeholder="Masukkan harga tiket" :readonly="props.mode == 'detail' && local.mode == 'detail'">
                        <template #incrementbuttonicon>
                            <span class="pi pi-plus" />
                        </template>
                        <template #decrementbuttonicon>
                            <span class="pi pi-minus" />
                        </template>
                    </InputNumber>
                </FormField>
            </div>
            <FormField name="inclusion" class="flex flex-col gap-0.25 !text-sm sm:!text-base lg:!text-lg">
                <label for="inclusion">Inklusi Event</label>
                <InputText id="inclusion" type="text" placeholder="Masukkan inklusi event" :readonly="props.mode == 'detail' && local.mode == 'detail'"/>
            </FormField>
            <div class="grid grid-cols-1 phone:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
                <FormField v-for="(fileObj, iMg) in inpFiles" :name="'fotoevent_' + iMg" class="w-full">
                    <label :for="'fotoevent_' + iMg">Foto Event {{ iMg + 1 }}</label>
                    <div class="flex flex-col gap-5">
                        <div class="relative w-full h-40 flex flex-col justify-center items-center rounded-lg text-gray-500" :class="{ 'border-3 border-dashed border-black': !fileObj.preview || fileObj.isErrorImg, 'cursor-pointer': (!local.isFirstTime && local.mode != 'detail' && !fileObj.isErrorImg) && (fileObj.inpImg === 'Local' || fileObj.states == 'updating' || fileObj.file == null) }" @dragover.prevent="!fileObj.preview && handleDragOver($event)" @drop.prevent="!fileObj.preview && handleDropFile($event, iMg)" @click="handleInpImgClick(iMg)">
                            <div v-show="local.mode != 'detail' && fileObj.preview !== '' && fileObj.isShowOverlay && fileObj.inpImg === 'Local' && !fileObj.isErrorImg" class="absolute inset-0 backdrop-blur-xs sm:backdrop-blur-none flex items-center justify-center transition" :class="{ 'sm:backdrop-blur-xs': fileObj.isHoveringOverlay }">
                                <div class="size-[45%] rounded-full flex items-center justify-center" @mouseenter="fileObj.isHoveringOverlay = true" @mouseleave="fileObj.isHoveringOverlay = false">
                                    <I_Close v-show="breakpoints.greater('sm') || fileObj.isShowOverlay" class="size-7 sm:size-8 md:size-9 lg:size-10 p-1.25 bg-red-500 sm:bg-transparent hover:sm:bg-red-500 text-white sm:text-transparent hover:sm:text-white rounded-full shadow-md sm:shadow-none hover:sm:shadow-md cursor-pointer transition" @click.stop="delFile(iMg)"></I_Close>
                                </div>
                            </div>
                            <img v-show="fileObj.preview && !fileObj.isLoadingImg && !fileObj.isErrorImg" :src="fileObj.preview" class="object-contain w-full h-full" @load="fileObj.preview && onImgLoad(fileObj, $event)" @error="fileObj.preview && onImgError(fileObj)"/>
                            <img v-show="!fileObj.preview && !fileObj.isErrorImg" src="@/assets/images/drop.png" class="w-10 mb-2"/>
                            <span v-show="!fileObj.preview && !fileObj.isErrorImg">Pilih file atau jatuhkan gambar</span>
                            <div v-show="fileObj.isLoadingImg" class="flex justify-center items-center bg-white/60 text-sm font-medium">Memuat gambar...</div>
                            <div v-show="fileObj.isErrorImg && fileObj.hasTriedLoad" class="flex flex-col items-center justify-center gap-1.5 text-gray-400 text-sm">
                                <span>⚠️ Gagal memuat gambar</span>
                                <Button v-show="local.mode != 'detail'" class="!px-2 !py-1" @click.stop="delFile(iMg)">Hapus</Button>
                            </div>
                            <input type="file" class="hidden" ref="fileInputEvent" accept="image/*" @change="handleFileChange($event, iMg)"/>
                        </div>
                        <InputText :id="'fotoevent_' + iMg" v-model="fileObj.inpImg" placeholder="Masukkan link foto event" :readonly="local.mode == 'detail' || fileObj.mode === 'drop'" @input="handleInpLink(iMg)"/>
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
                <Button v-if="local.isFirstTime || local.mode == 'detail'" type="button" label="Update Event" class="!w-full phone:!w-fit mt-3 sm:mt-5 lg:mt-7 mx-auto !px-2 lg:!px-4 !py-1 lg:!py-2 !rounded-sm sm:!rounded-md md:!rounded-lg lg:!rounded-xl !text-base sm:!text-lg lg:!text-xl xl:!text-2xl !font-normal" @click="local.mode = 'update'"/>
                <template v-else-if="local.mode == 'update'">
                    <Button type="button" label="Batal Update" class="!w-full phone:!w-fit mt-3 sm:mt-5 lg:mt-7 mx-auto !px-2 lg:!px-4 !py-1 lg:!py-2 !rounded-sm sm:!rounded-md md:!rounded-lg lg:!rounded-xl !text-base sm:!text-lg lg:!text-xl xl:!text-2xl !font-normal" @click="!local.isFirstTime ? local.mode = 'detail' : null"/>
                    <Button type="submit" label="Kirim Update" class="!w-full phone:!w-fit mt-3 sm:mt-5 lg:mt-7 mx-auto !px-2 lg:!px-4 !py-1 lg:!py-2 !rounded-sm sm:!rounded-md md:!rounded-lg lg:!rounded-xl !text-base sm:!text-lg lg:!text-xl xl:!text-2xl !font-normal"/>
                </template>
            </template>
        </div>
    </Form>
</template>