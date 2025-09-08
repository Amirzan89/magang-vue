import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
export const useCustomForm = (schema: any, initialValues = {}) => {
    const { values, setFieldValue, setFieldError, handleSubmit, validate } = useForm({
        validationSchema: toTypedSchema(schema),
        initialValues,
    });
    const inpChange = async() => await validate();
    const cusHandleSubmit = (submitHandler: any, errorHandler: any) => {
        return handleSubmit(async (values) => {
            if(submitHandler) await submitHandler(values);
        }, (errors) => {
            console.error('Validation Errors:', errors);
            if(errorHandler) errorHandler(errors);
        })();
    };
    return { values, setFieldValue, inpChange, cusHandleSubmit, setFieldError };
};