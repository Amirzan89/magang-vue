import axios from 'axios'
import Cookies from 'js-cookie'
import { useConfig } from '@/composables/useConfig'
import RSAComposables from '@/composables/RSA'
import useEncryption from '@/composables/encryption'
import { useLoadingStore } from '@/stores/Loading'
const publicConfig = useConfig()
const { encryptReq, decryptRes } = useEncryption()
const api = axios.create({
    baseURL: publicConfig.baseURL || 'http://localhost:8000',
    withCredentials: true,
})
const fetchCsrfToken = async () => {
    return await axios.get(`${publicConfig.baseURL}/sanctum/csrf-cookie`, { withCredentials: true })
}
api.interceptors.request.use(async (config) => {
    let token = Cookies.get('XSRF-TOKEN')
    if(!token){
        await fetchCsrfToken()
        token = Cookies.get('XSRF-TOKEN')
    }
    if(token) config.headers['X-XSRF-TOKEN'] = token
    return config
})
const reqData = async({
    url,
    method = 'GET',
    reqBody = {},
    headers = {},
    signal = undefined,
    isEncrypt = true,
    includeQuery = {},
    maxRetry = 3,
    isNeedLoading = false,
    callbackResFn = null,
    callbackFinalFn = null,
}: Partial<{
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    reqBody?: any,
    reqType: 'Json' | 'FormData'
    headers?: Record<string, any>,
    signal?: AbortSignal | undefined,
    isEncrypt: boolean,
    includeQuery?: Record<string, any>,
    maxRetry?: number,
    isNeedLoading: boolean,
    callbackResFn?: Function | null
    callbackFinalFn?: { isRoute: (url: string) => boolean; fn: () => Promise<void> } | null
}> = {}) => {
    let retryCount = 0
    const makeRequest = async (): Promise<any> => {
        const loading = useLoadingStore()
        try {
            let data = reqBody
            let encr: any = null
            if(isEncrypt){
                if(!sessionStorage.aes_key && !sessionStorage.hmac_key){
                    const rsaComp = RSAComposables()
                    await rsaComp.handshake()
                }
                encr = await encryptReq(reqBody)
                data = {
                    uniqueid: encr.iv,
                    cipher: encr.data,
                    mac: encr.mac,
                }
            }
            if(isNeedLoading){
                loading.setLoading(true)
            }
            const res = (await api.request({ url, method, data, params: {
                    ...(includeQuery ? includeQuery : {}),
                    _: Date.now(),
                }, signal, headers: {
                    'X-Merseal': sessionStorage.merseal,
                    Accept: 'application/json',
                    ...headers,
                }})).data
            const responseData = isEncrypt ? decryptRes(res.message, encr.iv) : res
            if(callbackResFn && typeof callbackResFn === 'function') callbackResFn()
            if(isEncrypt){
                return { status: 'success', data: responseData }
            }
            return { status: 'success', ...responseData }
        }catch(err: any){
            if(axios.isCancel(err) || err.name === 'CanceledError'){
                return { status: 'error', message: 'Request dibatalkan' }
            }
            if(err.response){
                const { status, data } = err.response
                switch(status){
                    case 404:
                        return { status: 'error', message: 'Not found', code: 404 }
                    case 419:
                    case 429:
                        if (retryCount < maxRetry) {
                            retryCount++
                            await fetchCsrfToken()
                            return await makeRequest()
                        }
                        return { status: 'error', message: 'Request failed after retries' }
                    case 500:
                        return { status: 'error', message: data?.message || 'Server error', code: 500 }
                    default:
                        return { status: 'error', message: data?.message || 'Unknown error', code: status }
                }
            }
            return { status: 'error', message: err.message || 'Network error' }
        }finally{
            if(isNeedLoading) loading.setLoading(false)
            if(callbackFinalFn && typeof callbackFinalFn.isRoute === 'function' && typeof callbackFinalFn.fn === 'function' && callbackFinalFn.isRoute(url!)){
                await callbackFinalFn.fn()
            }
        }
    }
    return await makeRequest()
}
export default () => {
    return {
        axios: api,
        fetchCsrfToken,
        reqData,
    }
}