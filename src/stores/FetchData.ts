import { defineStore } from 'pinia'
import useAxios from '@/composables/api/axios'
import RSAComposables from '@/composables/RSA'
import useEncryption from '@/composables/encryption'
const { genIV, decryptRes } = useEncryption()
const { reqData } = useAxios()
const handleAuthResponse = async(res: any) => {
    const code = res?.code ?? 200
    const message = res?.message ?? ''
    switch(true){
        case code === 200 && message === 'success':
            return { isAuth: false, redirect: null, reason: 'public_access' }
        case code === 401 && message === 'Unauthorized':
            return { isAuth: false, redirect: '/login', reason: 'unauthorized' }
        case code === 302 && message === 'redirect':
            return { isAuth: true, redirect: '/dashboard', reason: 'already_logged_in' }
        case code === 401:
            return { isAuth: false, redirect: '/login', reason: 'token_invalid' }
        default:
            return { isAuth: false, redirect: null, reason: 'unknown_response' }
    }
}
export const useFetchDataStore = defineStore('FetchData', {
    state: () => ({
        isAuth: false as boolean,
        checked: false as boolean,
        isFirstTime: true as boolean,
    }),
    actions: {
        async checkAuth(url: string){
            const rsaComp = RSAComposables()
            try{
                if(this.isFirstTime && !sessionStorage.aes_key && !sessionStorage.hmac_key){
                    await rsaComp.handshake()
                }
                const iv = rsaComp.hexCus.enc(await genIV())
                const res = await reqData({
                    url,
                    headers: { 'X-Auth-Check': 'true', 'X-UniqueId': iv },
                    isEncrypt: false,
                })
                res.message = decryptRes(res.message, iv).message
                const handARes = await handleAuthResponse(res)
                this.isAuth = handARes.isAuth
                this.checked = true
                if(this.isFirstTime) this.isFirstTime = false
                return
            }catch(err){
                this.isAuth = false
                this.checked = true
                return
            }
        },
        login(){
            this.isAuth = true
            this.checked = true
        },
        logout(){
            this.isAuth = false
            this.checked = false
        },
    },
})