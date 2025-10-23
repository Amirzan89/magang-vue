import { defineStore } from 'pinia'
import useAxios from '@/composables/api/axios'
import RSAComposables from '@/composables/RSA'
import useEncryption from '@/composables/encryption'
const { genIV, decryptRes } = useEncryption()
const handleAuthResponse = async(res: any) => {
    const code = res?.code ?? 200
    const message = res?.message ?? ''
    switch(true){
        case code === 200:
            if(message === 'success auth'){
                return { isAuth: true }
            }else if(message === 'success public'){
                return { isAuth: false }
            }
        default:
            return { isAuth: false }
    }
}
export const useFetchDataStore = defineStore('FetchData', {
    state: () => ({
        isAuth: false as boolean,
        isFirstTime: true as boolean,
    }),
    actions: {
        async checkAuth(){
            const { reqData } = useAxios()
            const rsaComp = RSAComposables()
            try{
                if(this.isFirstTime && !sessionStorage.aes_key && !sessionStorage.hmac_key){
                    await rsaComp.handshake()
                }
                const iv = rsaComp.hexCus.enc(await genIV())
                const res = await reqData({
                    url: '/check-auth',
                    headers: { 'X-Auth-Check': 'true', 'X-UniqueId': iv },
                    isEncrypt: false,
                })
                res.message = decryptRes(res.message, iv).message
                if(res.code !== 302 && res.code !== 401){
                    const handARes = await handleAuthResponse(res)
                    this.isAuth = handARes.isAuth
                }
                if(this.isFirstTime) this.isFirstTime = false
                return
            }catch(err){
                this.isAuth = false
                return
            }
        },
        login(){
            this.isAuth = true
        },
        logout(){
            this.isAuth = false
        },
    },
})