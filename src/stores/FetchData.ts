import { defineStore } from "pinia"
import { useRoute } from "vue-router"
import router from "@/router"
import createAxios from "@/composables/api/axios"
import encryption from "@/composables/encryption"
import RSAComposables from '@/composables/RSA'
const { axiosJson, fetchCsrfToken } = createAxios()
const { encryptReq, decryptRes } = encryption()
interface Response{
    status: 'success' | 'error',
    code?: number,
    message?: string,
    data?: any,
}
export const useFetchDataStore = defineStore('fetchDataStore', {
    state: () => ({
        publicPath: ['/', '/login'],
        processFetch: { isDone: 'loading' as 'error' | 'loading' | 'success', message: '' as string},
        retryCount: 0 as number,
    }),
    actions: {
        async fetchData(routePath: string, params?: {}, reqBody?: any, refer?: string): Promise<Response> {
            try{
                if(['/testing'].includes(routePath)){
                    this.processFetch = { isDone: 'success', message: ''}
                    return {status:'success'}
                }
                if(!sessionStorage.aes_key && !sessionStorage.hmac_key){
                    const rsaComp = RSAComposables()
                    await rsaComp.handshake()
                }
                const encr = await encryptReq(reqBody || {})
                const res: Record<string, any> = (await (await axiosJson()).post(routePath, {
                    uniqueid: encr.iv,
                    cipher: encr.data,
                    mac: encr.mac,
                }, { params: {...params, _: Date.now()}, headers: { 'X-Merseal': sessionStorage.merseal }})).data
                this.processFetch = { isDone: 'success', message: ''}
                return { status: 'success', data: decryptRes(res.data, encr.iv) }
            }catch(err: any){
                if (err.response){
                    let cusRedirect: string | null = null
                    if([302, 301].includes(err.response.status)){
                        cusRedirect = this.publicPath.includes(routePath) ? err.response.data.link : '/login'
                        await router.push(cusRedirect || '/login')
                    }
                    if(err.response.status === 404){
                        this.processFetch = { isDone: 'error', message: 'not found'}
                        return { status:'error', message: 'not found', code: 404 }
                    }
                    if([419, 429].includes(err.response.status)){
                        if(this.retryCount <= 3){
                            this.retryCount++
                            await fetchCsrfToken()
                            return this.fetchData(routePath, params, reqBody, refer)
                        }else{
                            this.retryCount = 0
                            this.processFetch = { isDone: 'error', message: 'Request Failed'}
                            return { status: 'error', message: 'Request failed' }
                        }
                    }
                    if(err.response.status === 500){
                        return { status: 'error', message: err.response.data.message }
                    }
                    return { status:'error', message: err.response.data.message, code: err.response.status, data: { redirect: cusRedirect }}
                }
                return { status:'error', message: err }
            }
        },
        async fetchPage(routePath: string, params?: {}, reqBody? :{}): Promise<Response>{
            return await this.fetchData(routePath, params, reqBody)
        },
    },
})