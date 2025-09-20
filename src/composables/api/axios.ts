import axios from 'axios'
import Cookies from 'js-cookie'
import { useConfig } from '@/composables/useConfig'
import RSAComposables from '@/composables/RSA'
const publicConfig = useConfig()
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
const axiosJson = async () => {
    if(!sessionStorage.aes_key && !sessionStorage.hmac_key){
        const rsaComp = RSAComposables()
        await rsaComp.handshake()
    }
    api.defaults.headers.common['Accept'] = 'application/json'
    return api
}
const reqData = async (url: string, method: string, data: any = '', isJson = false, reqHeaders: any = null) => {
    let retryCount = 0
    const headers = Object.assign({}, isJson ? { Accept: 'application/json' } : {}, reqHeaders)
    const req = async (): Promise<any> => {
        try{
            const response = await api.request({ url, method, data, headers})
            return { status: 'success', message: response.data.message, data: response.data.data }
        }catch(err: any){
            if(err.response){
                switch (err.response.status) {
                case 404: return { status: 'error', message: 'not found', code: 404 }
                case 419:
                case 429:
                    if (retryCount <= 3) {
                    retryCount++
                    await fetchCsrfToken()
                    return await req()
                    }
                    return { status: 'error', message: 'Request failed' }
                case 500: return { status: 'error', message: err.response.message, code: 500 }
                }
            }
            return { status: 'error', message: err.message }
        }
    }
    return await req()
}

const handshakeAPI = async (data: { pubB64: any, clientNonceB64: any }) => {
    return (await api.post('/handshake', {
        clientPublicSpkiB64: data.pubB64,
        clientNonce: data.clientNonceB64,
    })).data
}

export default () => {
    return {
        axios: api,
        axiosJson,
        fetchCsrfToken,
        reqData,
        handshakeAPI,
    }
}