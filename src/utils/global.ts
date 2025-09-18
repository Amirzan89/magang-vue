import { useConfig } from '@/composables/useConfig'
const publicConfig = useConfig()
export const formatTgl = (inpTgl: Date) => {
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const day = inpTgl.getDate();
    const month = monthNames[inpTgl.getMonth()];
    const year = inpTgl.getFullYear();
    return `${day} ${month} ${year}`;
};
export const getImgURL = (inpImg: string) => {
    try{
        const url = new URL(inpImg);
        return url.href;
    }catch (e){
        return publicConfig.baseURL + inpImg;
    }
};