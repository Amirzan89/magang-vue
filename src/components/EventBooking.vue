<script setup lang="ts">
import { zodResolver } from "@primevue/forms/resolvers/zod"
import { Form, FormField } from "@primevue/forms"
import { useToast } from 'primevue/usetoast'
import * as z from 'zod'
import type { ZodSchema } from 'zod'
import { reactive, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import useAxios from '@/composables/api/axios'
import useEncryption from '@/composables/encryption'
import DynamicFormComponent from '@/components/DynamicForm/DynamicForm.vue'
const { axiosJson, fetchCsrfToken } = useAxios()
const { encryptReq, decryptRes } = useEncryption()
const toast = useToast()
const props = defineProps<{
    detail_event: Record<string, any>,
}>()
const local = reactive({
    isRequestInProgress: false,
})
const bookingValidator = zodResolver(z.object({
    nama: z.string({ message: "Nama tidak boleh kosong !" }).min(1, { message: "Nama harus di isi !" }).max(50, { message: "Nama maksimal 50 karakter" }),
    gender: z.enum(["M", "F"], { message: "Pilih jenis kelamin" }),
    mobileno: z.string().min(10, { message: "Nomor HP minimal 10 digit" }).max(15, { message: "Nomor HP maksimal 15 digit" }).regex(/^\d+$/, { message: "Nomor HP hanya boleh angka" }),
    qty: z.number().min(1, { message: "Jumlah minimal 1" }).max(10, { message: "Jumlah maksimal 10" }),
    email: z.string({ message: "Email tidak boleh kosong !" }).trim().max(50, { message: "Email maksimal 50 karakter" }).pipe(z.email({ message: "Format email tidak valid" }))
}))
let abortFormController: AbortController | null = null
const formBooking = ({ valid, states }: any) => {
    if(!valid) return
    if(local.isRequestInProgress) return
    if(abortFormController) abortFormController.abort()
    abortFormController = new AbortController()
    let retryCount = 0
    local.isRequestInProgress = true
    const APIReq = async(signal: AbortSignal) => {
        try{
            console.log('mlebuu encryptt', states)
            const encr = await encryptReq({
                nama: states.nama.value,
                gender: states.gender.value,
                mobileno: states.mobileno.value,
                event_group: props.detail_event.event_id,
                event_id: props.detail_event.event_id,
                qty: states.qty.value,
                email: states.email.value,
            })
            console.log('enccc',)
            const res = (await(await axiosJson()).post('/event-booking', {
                uniqueid: encr.iv,
                cipher: encr.data,
                mac: encr.mac,
            }, { params: { _: Date.now() }, signal, headers: { 'X-Merseal': sessionStorage.merseal }})).data
            if(signal.aborted){
                return { status: 'error', message: 'Request dibatalkan' }
            }
            const decRes = decryptRes(res.data, encr.iv)
            return { status: 'success', data: decRes }
        }catch(err: any){
            if(err.name === "CanceledError"){
                console.log("Request dibatalkan")
                return { status: 'error', message: 'Request dibatalkan' }
            }else if(err.response){
                let cusRedirect: string | null = null
                if(err.response.status === 404){
                    return { status:'error', message: 'not found', code: 404 }
                }
                if([419, 429].includes(err.response.status)){
                    if(retryCount <= 3){
                        retryCount++
                        await fetchCsrfToken()
                        return APIReq(signal)
                    }else{
                        retryCount = 0
                        console.log('Request failed')
                        // return toast
                        return { status: 'error', message: 'Request failed' }
                    }
                }
                if(err.response.status === 500){
                    console.log('500', err.response.data.message)
                    // return toast
                    return { status: 'error', message: err.response.data.message }
                }
                console.log('err response', err.response.data.message)
                // return toast
                return { status:'error', message: err.response.data.message, code: err.response.status, data: { redirect: cusRedirect }}
            }
            console.log('errror', err)
            // return toast
            return { status:'error', message: err }
        }finally{
            local.isRequestInProgress = false
        }
    }
    APIReq(abortFormController.signal)
}
</script>
<template>
    <section class="relative overflow-x-clip">
        <img src="@/assets/images/cele-3.png" alt="" class="absolute bottom-0 -right-[29.5%] w-[75%] h-[75%] -z-1 object-cover opacity-30"/>
        <Form :resolver="bookingValidator" @submit="formBooking" v-slot="$form">
            <FormField name="nama" class="flex flex-col gap-1">
                <label for="nama">Nama</label>
                <InputText id="nama"/>
                <Message v-if="$form.nama?.invalid" severity="error">{{ $form.nama.error?.message }}</Message>
            </FormField>
            <FormField name="gender" class="flex flex-col gap-1">
                <label for="gender">Jenis Kelamin</label>
                <Select id="gender" :options="[{ name: 'Laki-laki', value: 'M' }, { name: 'Perempuan', value: 'F' }]" optionLabel="name" optionValue="value" placeholder="Pilih Gender" />
                <Message v-if="$form.gender?.invalid" severity="error">{{ $form.gender.error?.message }}</Message>
            </FormField>
            <div class="flex">
                <FormField name="qty" class="flex flex-col gap-1">
                    <label for="qty">Jumlah Tiket</label>
                    <InputNumber id="qty"/>
                    <Message v-if="$form.qty?.invalid" severity="error">{{ $form.qty.error?.message }}</Message>
                </FormField>
                <FormField name="mobileno" class="flex flex-col gap-1">
                    <label for="mobileno">mobile number</label>
                    <InputText id="mobileno" type="tel" placeholder="08xxxxxxxx" />
                    <Message v-if="$form.mobileno?.invalid" severity="error">{{ $form.mobileno.error?.message }}</Message>
                </FormField>
            </div>
            <FormField name="email" class="flex flex-col gap-1">
                <label for="email">Email</label>
                <InputText id="email" placeholder="Masukkan Email" />
                <Message v-if="$form.email?.invalid" severity="error">{{ $form.email.error?.message }}</Message>
            </FormField>
            <Button type="submit" label="Kirim" :loading="local.isRequestInProgress" />
        </Form>
    </section>
</template>