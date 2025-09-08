import createAxios from '@/composables/api/axios';
const { reqData } = createAxios();
export async function FooterMail(data: { email: string }){
    return reqData('/footer-mail', 'post', {
        email: data.email,
    }, true);
}