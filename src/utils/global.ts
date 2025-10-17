import { useConfig } from '@/composables/useConfig'
const publicConfig = useConfig()
export const formatTgl = (inpTgl: Date) => {
    const inpDate = typeof inpTgl === 'string' ? new Date(inpTgl) : inpTgl
    if(isNaN(inpDate.getTime())) return '-'
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
    const day = inpDate.getDate()
    const month = monthNames[inpDate.getMonth()]
    const year = inpDate.getFullYear()
    return `${day} ${month} ${year}`
}
export const getImgURL = (inpImg: string) => {
    try{
        const url = new URL(inpImg)
        return url.href
    }catch (e){
        return publicConfig.baseURL + inpImg
    }
}