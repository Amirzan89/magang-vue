import createAxios from '@/composables/api/axios';
const { reqData } = createAxios();
export async function FooterMail(data: { email: string }){
    return reqData({
        url: '/footer-mail',
        method: 'POST',
        reqBody: {
            email: data.email
        },
        reqType: 'Json',
    })
}