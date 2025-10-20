import createAxios from '@/composables/api/axios'
const { reqData } = createAxios()
export const CreateForgotPassword = async(data: { email:string }) => {
    return await reqData({
        url: '/verify/create/password',
        method: 'POST',
        reqBody: {
            email: data.email,
        },
        reqType: 'Json',
    })
}
export const VerifyChange = async(data: { nama?: string, email: string, link?: string, code?: string, password: string, ulangiPassword: string }) => {
    return await reqData({
        url: '/verify/password',
        method: 'POST',
        reqBody: {
            nama: data.nama,
            email: data.email,
            link: data.link,
            code: data.code,
            password: data.password,
            password_confirm: data.ulangiPassword,
        },
        reqType: 'Json',
    })
}
export const ReSendOtp = async(data: { email: string, link: string, }) => {
    return reqData({
        url: data.link,
        method: 'POST',
        reqBody: {
            email: data.email
        },
        reqType: 'Json',
    })
}
export const VerifyOtp = async(data: { link: string, email: string, otp:string }) => {
    return reqData({
        url: data.link,
        method: 'POST',
        reqBody: {
            email: data.email,
            otp: data.otp
        },
        reqType: 'Json',
    })
}
export const CheckAuth = async(link: string): Promise<{ status: string, data?: any, message: string, code?: number, link?:string }> => {
    return reqData({
        url: link,
        method: 'GET',
        reqType: 'Json',
    })
}
export const updateProfile = async(data: FormData) => {
    return reqData({
        url: '/update/profile',
        method: 'PUT',
        reqBody: data,
        reqType: 'Json',
    })
}
export const updatePassword = async(data: {old_password: string, new_password: string, repeat_password: string}) => {
    return reqData({
        url: '/update/password',
        method: 'PUT',
        reqBody: {
            old_password: data.old_password,
            new_password: data.new_password,
            repeat_password: data.repeat_password,
        },
        reqType: 'Json',
    })
}
export const Logout = async() => {
    return reqData({
        url: '/logout',
        method: 'POST',
        reqBody: {},
        reqType: 'Json',
    })
}