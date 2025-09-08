import createAxios from '@/composables/api/axios';
const { reqData } = createAxios();
export async function Login(data: { email: string, password: string, recaptcha: string }){
    return reqData('/login', 'post', {
        email: data.email,
        password: data.password,
        recaptcha: data.recaptcha,
    }, true);
}
export async function CreateLoginGoogle(data: { email: string, nama: string, password: string, password_confirm: string, file: string }){
    return reqData('/register/google', 'post', {
        email: data.email,
        nama: data.nama,
        password: data.password,
        password_confirm: data.password_confirm,
        file: data.file,
    }, true);
}
export async function CreateLoginGoogleTap(credential: string){
    return reqData('/auth/google-tap', 'post', {
        credential: credential,
    }, true);
}
export async function Register(data: { nama: string, email: string, password: string, ulangiPassword: string }){
    return reqData('/register', 'post', {
        nama: data.nama,
        email: data.email,
        password: data.password,
        password_confirm: data.ulangiPassword,
    }, true);
}
export async function CreateForgotPassword(data: { email:string }){
    return reqData('/verify/create/password', 'post', {
        email: data.email,
    }, true);
}
export async function VerifyChange(data: { nama?: string, email: string, link?: string, code?: string, password: string, ulangiPassword: string }){
    return reqData('/verify/password', 'post', {
        nama: data.nama,
        email: data.email,
        link: data.link,
        code: data.code,
        password: data.password,
        password_confirm: data.ulangiPassword,
    }, true);
}
export async function ReSendOtp(data: { email: string, link: string, }){
    return reqData(data.link, 'post',{
        email: data.email,
    }, true);
}
export async function VerifyOtp(data: { link: string, email: string, otp:string }){
    return reqData(data.link, 'post', {
        email: data.email,
        otp: data.otp
    }, true);
}
export async function CheckAuth(link: string): Promise<{ status: string, data?: any, message: string, code?: number, link?:string }>{
    return reqData(link, 'get', '', true);
}
export async function updateProfile(data: FormData){
    return reqData('/update/profile', 'post', data, true);
}
export async function updatePassword(data: {old_password: string, new_password: string, repeat_password: string}){
    return reqData('/update/password', 'put', {
        old_password: data.old_password,
        new_password: data.new_password,
        repeat_password: data.repeat_password,
    }, true);
}
export async function Logout(){
    return reqData('/logout', 'post', {}, true);
}