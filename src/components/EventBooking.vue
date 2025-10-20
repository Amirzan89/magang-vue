<script setup lang="ts">
import * as z from 'zod'
import { zodResolver } from "@primevue/forms/resolvers/zod"
import { Form, FormField } from "@primevue/forms"
import useAxios from '@/composables/api/axios'
import { useLoadingStore } from '@/stores/Loading'
import { useToast } from 'primevue/usetoast'
const { reqData } = useAxios()
const toast = useToast()
const loading = useLoadingStore()
const props = defineProps<{
    detail_event: Record<string, any>,
}>()
const bookingValidator = zodResolver(z.object({
    nama: z.string({ message: "Nama tidak boleh kosong !" }).min(1, { message: "Nama harus di isi !" }).max(50, { message: "Nama maksimal 50 karakter" }),
    gender: z.enum(["M", "F"], { message: "Pilih jenis kelamin" }),
    mobileno: z.string().min(10, { message: "Nomor HP minimal 10 digit" }).max(15, { message: "Nomor HP maksimal 15 digit" }).regex(/^\d+$/, { message: "Nomor HP hanya boleh angka" }),
    qty: z.preprocess((val) => {
        if(val === '' || val === null || val === undefined) return undefined
        return Number(val)
    }, z.number({ message: "Jumlah Tiket tidak boleh kosong !" }).min(1, { message: "Jumlah Tiket minimal 1" }).max(10, { message: "Jumlah Tiket maksimal 10" })),
    email: z.string({ message: "Email tidak boleh kosong !" }).trim().max(50, { message: "Email maksimal 50 karakter" }).pipe(z.email({ message: "Format email tidak valid" }))
}))
let abortFormController: AbortController | null = null
const formBooking = async({ valid, states, reset }: any) => {
    if(!valid) return
    if(abortFormController) abortFormController.abort()
    abortFormController = new AbortController()
    const res = await reqData({
        url: '/event-booking',
        method: 'POST',
        signal: abortFormController.signal,
        reqBody: {
            nama: states.nama.value,
            gender: states.gender.value,
            mobileno: states.mobileno.value,
            event_group: props.detail_event.event_group,
            event_id: props.detail_event.event_id,
            qty: states.qty.value,
            email: states.email.value,
        },
        reqType: 'Json',
        isNeedLoading: true,
        callbackResFn: reset
    })
    if(res.status == 'error'){
        toast.add({ severity: 'error', summary: 'Gagal Booking', detail: res.message, group: 'br', life: 3000 });
    }
    toast.add({ severity: 'success', summary: 'Berhasil Booking', detail: res.message, group: 'br', life: 3000 });
}
</script>
<template>
    <section class="relative overflow-x-clip mt-3 mb-10 sm:mb-15 lg:mb-20">
        <img src="@/assets/images/cele-3.png" alt="" class="absolute -bottom-[60%] -right-[40.5%] w-fit h-fit -z-1 object-cover opacity-30"/>
        <h2 class="w-[90%] lg:w-[95%] !m-0 !mx-auto !text-lg sm:!text-xl lg:!text-2xl xl:!text-3xl">Booking Event</h2>
        <Form :resolver="bookingValidator" @submit="formBooking" v-slot="$form" class="w-[90%] lg:w-[95%] mx-auto flex flex-col gap-0.5 phone:gap-1 md:gap-2 xl:gap-2.5">
            <FormField name="nama" class="flex flex-col gap-0.25">
                <label for="nama">Nama</label>
                <InputText id="nama" placeholder="Masukkan Nama"/>
                <Message v-if="$form.nama?.invalid" severity="error">{{ $form.nama.error?.message }}</Message>
            </FormField>
            <div class="w-full grid gap-1 md:gap-3 xl:gap-5 sm:grid-cols-2 sm:items-start md:grid-cols-3">
                <FormField name="gender" class="flex flex-col gap-0.25">
                    <label for="gender">Jenis Kelamin</label>
                    <Select id="gender" :options="[{ name: 'Laki-laki', value: 'M' }, { name: 'Perempuan', value: 'F' }]" optionLabel="name" optionValue="value" placeholder="Pilih Gender" />
                    <Message v-if="$form.gender?.invalid" severity="error">{{ $form.gender.error?.message }}</Message>
                </FormField>
                <FormField name="mobileno" class="flex flex-col gap-0.25">
                    <label for="mobileno">mobile number</label>
                    <InputText id="mobileno" type="tel" placeholder="08xxxxxxxx" />
                    <Message v-if="$form.mobileno?.invalid" severity="error">{{ $form.mobileno.error?.message }}</Message>
                </FormField>
                <FormField name="qty" class="flex flex-col gap-0.25 sm:col-span-2 md:col-span-1">
                    <label for="qty">Jumlah Tiket</label>
                    <InputNumber id="qty" placeholder="Masukkan Jumlah Tiket"/>
                    <Message v-if="$form.qty?.invalid" severity="error">{{ $form.qty.error?.message }}</Message>
                </FormField>
            </div>
            <FormField name="email" class="flex flex-col gap-0.25">
                <label for="email">Email Pengguna</label>
                <InputText id="email" placeholder="Masukkan Email Pengguna" />
                <Message v-if="$form.email?.invalid" severity="error">{{ $form.email.error?.message }}</Message>
            </FormField>
            <Button type="submit" label="Kirim" :loading="loading.isLoading" class="mt-3 sm:mt-5 lg:mt-7 mx-auto !px-2 lg:!px-4 !py-1 lg:!py-2 !rounded-sm lg:!rounded-md !text-sm sm:!text-base lg:!text-lg xl:!text-xl !font-normal"/>
        </Form>
    </section>
</template>