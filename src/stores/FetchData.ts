import { defineStore } from 'pinia'
import useAxios from '@/composables/api/axios'
import RSAComposables from '@/composables/RSA'
import useEncryption from '@/composables/encryption'
import{ isImageFile, base64_decode_to_blob, type Base64File } from '@/utils/Base64File'
import Im_DefaultBoy from '@/assets/images/default_boy.jpg'
import Im_DefaultGirl from '@/assets/images/default_girl.png'
interface AuthData{
    nama_lengkap: string
    jenis_kelamin: string
    no_telpon: string
    email: string
    foto: Base64File | null,
}
const { genIV, decryptRes } = useEncryption()
const handleAuthResponse = async(res: any) => {
    const code = res?.code ?? 200
    const data = res?.data ?? ''
    switch(true){
        case code === 200:
            if(typeof data === 'object' && data !== null && ['nama_lengkap', 'jenis_kelamin', 'no_telpon', 'email', 'foto'].every(key => key in data)){
                return { isAuth: true, data: data as AuthData }
            }else if(data === 'success public'){
                return { isAuth: false, data: {} }
            }
        default:
            return { isAuth: false, data: {} }
    }
}
export const useFetchDataStore = defineStore('FetchData', {
    state: () => ({
        cacheAuth: {} as Partial<AuthData>,
        isAuth: false as boolean,
        isFirstTime: true as boolean,
        imgUrl: null as string | null,
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
                res.data = decryptRes(res.message, iv).data
                if(![302, 401].includes(res.code)){
                    const handARes = await handleAuthResponse(res)
                    this.isAuth = handARes.isAuth
                    this.cacheAuth = handARes.data
                    if(this.cacheAuth.foto && this.cacheAuth.foto !== null && isImageFile(this.cacheAuth.foto.meta)){
                        this.setDecryptedImage(base64_decode_to_blob(this.cacheAuth.foto))
                    }else{
                        this.imgUrl = this.cacheAuth.jenis_kelamin === 'perempuan' ? Im_DefaultGirl : Im_DefaultBoy
                    }
                }
            }catch(err){
                this.isAuth = false
            }finally{
                this.isFirstTime = false
            }
        },
        login(){
            this.isAuth = true
        },
        setDecryptedImage(blob: Blob){
            if(this.imgUrl) URL.revokeObjectURL(this.imgUrl)
            this.imgUrl = URL.createObjectURL(blob)
        },
        clearDecryptedImage(){
            if(this.imgUrl) URL.revokeObjectURL(this.imgUrl)
            this.imgUrl = null
        },
        logout(){
            this.isAuth = false
            this.cacheAuth = {}
            this.clearDecryptedImage()
        },
    },
})