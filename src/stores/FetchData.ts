import { defineStore } from "pinia";
import { useRoute } from "vue-router";
import router from "@/router";
import createAxios from "@/composables/api/axios";
// import ImgBoy from '~/assets/images/profile/default_boy.jpg';
// import ImgGirl from '~/assets/images/profile/default_girl.png';
const { axiosJson, createCSRF } = createAxios();
import { useConfig } from '@/composables/useConfig';
const publicConfig = useConfig();
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
        isFirstTime: true,
        cacheAuth: {},
        cache: {
            admin: [],
            any: [],
        } as { [key: string]: Array<{url: string, [key: string]: any}> },
        retryCount: 0 as number,
    }),
    actions: {
        async fetchData(routePath: string, params?: {}, refer?: string): Promise<Response> {
            try{
                if(['/testing'].includes(routePath)){
                    this.processFetch = { isDone: 'success', message: ''}
                    return {status:'success'};
                }
                if(refer == 'userAuth'){
                }
                if(this.publicPath.includes(routePath) && Object.keys(this.cacheAuth).length !== 0){
                    return { status: 'error', message: 'Already Login', data: { redirect: '/login' }};
                }
                const res: Record<string, any> = await axiosJson.get(routePath, { params: {...params, _: Date.now()}});
                this.processFetch = { isDone: 'success', message: ''}
                return res.data;
            }catch(err: any){
                if (err.response){
                    let cusRedirect: string | null = null;
                    if([302, 301, 401].includes(err.response.status)){
                        cusRedirect = this.publicPath.includes(routePath) ? err.response.data.link : '/login';
                        await router.push(cusRedirect || '/login')
                    }
                    if(err.response.status === 404){
                        this.processFetch = { isDone: 'error', message: 'not found'};
                        return { status:'error', message: 'not found', code: 404 };
                    }
                    if([419, 429].includes(err.response.status)){
                        if (this.retryCount <= 3) {
                            this.retryCount++;
                            createCSRF();
                            return this.fetchData(routePath, params, refer);
                        } else {
                            this.retryCount = 0;
                            this.processFetch = { isDone: 'error', message: 'Request Failed'};
                            return { status: 'error', message: 'Request failed' };
                        }
                    }
                    if(err.response.status === 500){
                        return { status: 'error', message: err.response.data.message };
                    }
                    return { status:'error', message: err.response.data.message, code: err.response.status, data: { redirect: cusRedirect }};
                }
                return { status:'error', message: err };
            }
        },
        async fetchPage(routePath: string, params?: {}, req? :{}): Promise<Response>{
            if(this.publicPath.includes(routePath) && Object.keys(this.cacheAuth).length !== 0){
                return { status: 'error', message: 'Already Login', data: { redirect: '/login' }};
            }
            //search cache
            const sp = routePath.split('/');
            let keyC = sp.length > 1 ? Object.keys(this.cache).find(key => key == sp[1]) || 'any' : 'any';
            let lenghtK = this.cache[keyC].length;
            if(lenghtK > 0){
                let cacheDat: any = (this.cache[keyC] as {url: string}[]).find((item) => item.url == routePath);
                if(cacheDat) return { status: 'success', data: JSON.parse(JSON.stringify(cacheDat.data)) }
            }
            const res = await this.fetchData(routePath, params);
            if(res.code && res.code != 200) return res;
            //delete old cache
            if(lenghtK >= 3){
                this.cache[keyC].pop();
            }
            const isEmpty = (obj: any) => Array.isArray(obj) ? obj.length === 0 : Object.keys(obj).length === 0;
            if(!this.cache[keyC].some(item => item.url == routePath) && res.data && !isEmpty(res.data)){
                this.cache[keyC].push({ url: routePath, data: res.data });
            }
            return res;
        },
        // async fetchAuth(routePath: string){
        //     if(Object.keys(this.cacheAuth).length === 0 && (!this.isFirstTime || !this.publicPath.includes(routePath))){
        //         const res = await this.fetchData('/profil', { params: { _: Date.now() } }, 'userAuth');
        //         if(res.code && res.code != 200) return res;
        //         if(!res.data.photo){
        //             res.data.photo = res.data.jenis_kelamin == 'laki-laki' ? ImgBoy : ImgGirl;
        //         }else{
        //             if(res.data.role == 'super admin' || res.data.role == 'admin'){
        //                 res.data.photo = publicConfig.baseURL + '/admin/download/photo';
        //             }else{
        //                 res.data.photo = publicConfig.baseURL + '/download/photo';
        //             }
        //         }
        //         this.cacheAuth = res.data;
        //         this.isFirstTime = false;
        //         return res;
        //     }
        //     return { status: 'success', 'data': this.cacheAuth };
        // },
        resetFetchData() {
            Object.keys(this.cache).forEach(key => {
                this.cache[key].forEach((item: { url: string}, index: number) => {
                    if (item.url === useRoute().fullPath) {
                        this.cache[key].splice(index, 1);
                    }
                });
            });
        },
        resetCacheAuth(){
            this.cacheAuth = {};
        }
    },
});