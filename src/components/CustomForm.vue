<template>
    <form class="tw-mt-5" @submit.prevent="submitForm">
        <template v-if="props.config.isReadonly">
            <template v-for="(item, index) in input">
                <component v-if="item.render && typeof item.render == 'function'" :is="item.render(local, dynamicRefs, input, inpVar, CustomFormCom)"/>
                <template v-else>
                    <div>
                        <label for="">{{ item.label }}</label>
                        <div>{{ item[item.nameField] }}</div>
                    </div>
                </template>
            </template>
        </template>
        <template v-else>
            <template v-for="(item, index) in input">
                <FormField v-if="item.typeInput === 'date'" v-slot="{ componentField, meta }" :name="item.nameField">
                    <component v-if="item.render && typeof item.render == 'function'" :is="item.render(local, dynamicRefs, input, inpVar, CustomFormCom)" v-bind="componentField" :key="index"/>
                    <!-- <Popover>
                        <PopoverTrigger as-child>
                            <Button variant="outline" :class="cn('w-[280px] justify-start text-left font-normal', !currentInput[item.nameField] && 'text-muted-foreground')">
                                <CalendarIcon class="mr-2 h-4 w-4" />
                                {{ currentInput[item.nameField] ? df.format(currentInput[item.nameField]) : "Pick a date" }}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent class="w-auto p-0"><Calendar v-model="currentInput[item.nameField]" initial-focus /></PopoverContent>
                    </Popover> -->
                </FormField>
                <FormField v-else-if="item.typeInput === 'radio'" v-slot="{ componentField, meta }" :name="item.nameField">
                    <FormItem>
                        <FormLabel>{{ item.label }}</FormLabel>
                        <FormControl>
                            <RadioGroup default-value="male" :disabled="local.isMode == 'detail'" v-bind="componentField" v-model="currentInput[item.nameField]" @update:modelValue="handleInputChange($event, index, 'radio')" :isError="meta.touched && !meta.valid">
                                <template v-for="(valueEnum, indexValue) in item.type">
                                    <div class="flex items-center space-x-2">
                                        <RadioGroupItem :id="`option-${indexValue}`" :value="valueEnum"/>
                                        <Label :for="`option-${indexValue}`">{{ valueEnum.toString().capitalize() }}</Label>
                                    </div>
                                </template>
                            </RadioGroup>
                        </FormControl>
                    </FormItem>
                </FormField>
                <FormField v-else-if="item.typeInput === 'file'" v-slot="{ componentField, meta }" :name="item.nameField">
                    <FormItem>
                        <FormLabel>{{ item.label }}</FormLabel>
                        <FormControl class="tw-col-12 md:tw-col-10">
                            <component v-if="item.render && typeof item.render == 'function'" :is="item.render(local, dynamicRefs, input, inpVar)" v-bind="componentField" :key="index"/>
                            <template v-else>
                                <Input :type="item.typeInput" :disabled="local.isMode == 'detail'" :placeholder="item.placeholder"/>
                            </template>
                        </FormControl>
                    </FormItem>
                </FormField>
                <FormField v-else-if="item.typeInput === 'password'" v-slot="{ componentField, meta }" :name="item.nameField">
                    <FormItem>
                        <FormLabel>{{ item.label }}</FormLabel>
                        <div class="tw-relative">
                            <FormControl>
                                <Input  :type="inpVar[item.nameLocalVar] ? 'text' : 'password'" :disabled="local.isMode == 'detail'" :placeholder="item.placeholder" v-bind="componentField" v-model="item[item.nameField]" @input="handleInputChange($event, index)" :isError="meta.touched && !meta.valid"/>
                                <div class="tw-absolute tw-top-1/2 -tw-translate-y-1/2 3xs:tw-right-1 sm:tw-right-2 xl:tw-right-3" @click="handleClickInput(index)">
                                    <div class="tw-relative 3xs:tw-w-[17px] lg:tw-w-8 xl:tw-w-10 tw-flex tw-items-center tw-justify-center">
                                        <I_eye_slash class="tw-absolute tw-fill-palText tw-w-full tw-transition tw-duration-400" :class="!meta.value || item.isPasswordBaruShow ? 'tw-opacity-0 tw-pointer-events-none' : 'tw-opacity-100 tw-cursor-pointer'"/>
                                        <I_eye class="tw-absolute tw-fill-palText tw-w-full tw-transition tw-duration-[400ms]" :class="!meta.value || !item.isPasswordBaruShow ? 'tw-opacity-0 tw-pointer-events-none' : 'tw-opacity-100 tw-cursor-pointer'"/>
                                    </div>
                                </div>
                            </FormControl>
                        </div>
                    </FormItem>
                </FormField>
                <FormField v-else-if="item.typeInput === 'textarea'" v-slot="{ componentField, meta }" :name="item.nameField">
                    <FormItem>
                        <FormLabel>{{ item.label }}</FormLabel>
                        <FormControl>
                            <Textarea :disabled="local.isMode == 'detail'" class="resize-none" :placeholder="item.placholder" v-bind="componentField" v-model="currentInput[item.nameField]" @input="handleInputChange($event, index)" :isError="meta.touched && !meta.valid"/>
                        </FormControl>
                    </FormItem>
                </FormField>
                <FormField v-else v-slot="{ componentField, meta }" :name="item.nameField">
                    <FormItem>
                        <FormLabel>{{ item.label }}</FormLabel>
                        <FormControl>
                            <Input type="text" :disabled="local.isMode == 'detail'" :placeholder="item.placholder" v-bind="componentField" v-model="currentInput[item.nameField]" @input="handleInputChange($event, index)" :isError="meta.touched && !meta.valid"/>
                        </FormControl>
                    </FormItem>
                </FormField>
            </template>
        </template>
        <component v-if="props.btnSubmit && typeof props.btnSubmit === 'function'" :is="props.btnSubmit(local)" key="btnSubmit"/>
        <Button v-else type="submit" class="">{{ props.btnSubmit || 'Submit' }}</Button>
    </form>
</template>
<script setup lang="ts">
import { reactive, computed, ref, onBeforeMount, watch } from 'vue'
import {
    parseDate,
    type DateValue,
} from '@internationalized/date'
import type { ZodSchema } from 'zod'
import { useLoadingStore } from '@/stores/Loading'
const loading = useLoadingStore()
import { useCustomForm } from '@/composables/createUseForm'
import { Form, FormDescription, FormItem, FormLabel } from './ui/form'
import I_eye from '@/assets/icons/eye.svg'
import I_eye_slash from '@/assets/icons/eye-slash.svg'
interface Fields{
    nameField: string,
    typeInput: 'text' | 'email' | 'password' | 'radio' | 'date' | 'file',
    label: string,
    callbackChange: Function,
    placholder?: string,
    type: string,
    nameLocalVar?: any
    callbackVar?: Function,
    ref?: any
    render?: CallableFunction
}
const props = defineProps<{
    config?: any
    editable?: 'detail' | 'edit'
    fields: Fields[]
    initialValue?: Fields
    inpVar?: Record<string, any>
    btnSubmit?: CallableFunction | string
    zodSchema?: ZodSchema
    formApi?: any
}>()
const emit = defineEmits(['error', 'response', 'updateField'])
type InpFields = {
    [Key in typeof props.fields[number]['nameField']]: Extract<
        typeof props.fields[number],
        { nameField: Key }
    >['type']
}
const local = reactive({
    isRequestInProgress: false,
    isMode: 'edit' as 'detail' | 'edit',
    isHydrate: false,
})
const dynamicRefs = reactive({})
const oldInput: InpFields = reactive({})
const input: InpFields[] = reactive([])
const inpVar: InpFields = reactive({})
const currentInput = computed(() => {
    if(!props.config?.isKeepEdit){
        return input.reduce((acc, field) => {
            acc[field.nameField] = field[field.nameField]
            return acc
        }, {})
    }
    if(local.isMode === 'detail'){
        return oldInput
    }else{
        return input.reduce((acc, field) => {
            acc[field.nameField] = field[field.nameField]
            return acc
        }, {})
    }
})
const normalizeValues = (values: any, fields: any) => {
    const normalized: any = {}
    fields.forEach((field: any) => {
        const fieldName = field.nameField
        if(field.typeInput === 'date'){
            if(values && values[fieldName] !== undefined && values[fieldName] !== null){
                normalized[fieldName] = values[fieldName] as DateValue
            }else{
                normalized[fieldName] = new Date().toISOString().split('T')[0]
            }
        }else if(field.typeInput === 'radio'){
            if(values && values[fieldName] !== undefined && values[fieldName] !== null){
                normalized[fieldName] = values[fieldName]
            }else{
                normalized[fieldName] = field.type[0]
            }
        }else if(field.typeInput === 'file'){
            normalized[fieldName] = null
        }else{
            if(values && values[fieldName] !== undefined && values[fieldName] !== null){
                normalized[fieldName] = values[fieldName]
            }else{
                normalized[fieldName] = ''
            }
        }
    })
    return normalized
}
const normalizedInput = normalizeValues(props.initialValue, props.fields)
const CustomFormCom = ref(null)
onBeforeMount(() => {
    if(!props.config.isReadonly){
        CustomFormCom.value = useCustomForm(props.zodSchema, normalizedInput)
    }
    props.fields.forEach((field) => {
        input.push({[field.nameField]: field.typeInput === 'date' ? parseDate(normalizedInput[field.nameField]) as DateValue : normalizedInput[field.nameField], ...field })
        if(field.ref){
            dynamicRefs[field.ref] = ref(null)
        }
    })
    if(props.initialValue){
        Object.assign(oldInput, normalizedInput)
    }
    Object.assign(inpVar, props.inpVar)
})
watch(() => props.editable, async() => {
    local.isMode = props.editable ?? 'edit'
}, { immediate:true })
watch(() => props.initialValue, async() => {
    const newValue = normalizeValues(props.initialValue, props.fields)
    if(local.isHydrate) return
    input.forEach((item) => {
        item[item.nameField] = newValue[item.nameField] || null
    })
    Object.assign(oldInput, newValue)
}, { immediate:true })
defineExpose({ inpVar })
const handleInputChange = (event: any, index: number, cond = 'input') => {
    const inpValue = cond == 'radio' ? event : (event.target as HTMLInputElement).value
    if(props.config?.isKeepEdit && local.isMode === 'detail'){
        oldInput[input[index].nameField] = inpValue
    }else{
        input[index][input[index].nameField] = inpValue
    }
    local.isHydrate = true
    if(typeof input[index].callbackChange === 'function'){
        input[index].callbackChange(event, input, index)
    }
    CustomFormCom.value.inpChange()
}
const handleClickInput = (index: number) => {
    if(typeof input[index].callbackVar === 'function'){
        input[index].callbackVar(inpVar)
    }
    CustomFormCom.value.inpChange()
}
const submitForm = async () => {
    if(local.isRequestInProgress) return
    CustomFormCom.value.cusHandleSubmit(async(values: any) => {
        if(props.config?.isEditable && !input.some((item) => values[item.nameField] !== oldInput[item.nameField])){
            return emit('error', { from: 'validate', message: 'Data belum diubah !' })
        }
        local.isRequestInProgress = true
        loading.showLoading()
        const res = await props.formApi(input.reduce((acc, field) => {
            acc[field.nameField] = field[field.nameField]
            return acc
        }, {}))
        loading.closeLoading()
        if(props.config?.isResetField && res.status == 'success'){
            input.forEach(item => {
                if(Array.isArray(item.type)){
                    item[item.nameField] = item.type[0]
                }else if(item[item.nameField] && typeof item[item.nameField] === 'object' && 'name' in item[item.nameField] && typeof item[item.nameField].name === 'string'){ //for file checking
                    item[item.nameField] = null
                }else if(typeof item.type == 'boolean'){
                    item[item.nameField] = false
                }else if(typeof item.type == 'number'){
                    item[item.nameField] = 0
                }else{
                    item[item.nameField] = ''
                }
            })
        }
        emit('response', res, CustomFormCom.value)
        if(res.status == 'success'){
            if(props.config?.isEditable) Object.assign(oldInput, input)
            if(props.config?.isNeedEmitField) emit('updateField', input)
        }
        setTimeout(function(){
            local.isRequestInProgress = false
        }, 3000)
    }, (err: any) => {
        let message = err.errors[Object.keys(err.errors)[0]]
        return emit('error', { from: 'validate', message: message == 'Required' ? `${input.find(item => item.nameField === Object.keys(err.errors)[0]).label} ${message}` : message })
    })
}
</script>