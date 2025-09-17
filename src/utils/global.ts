export function formatTgl(inpTgl: Date){
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const day = inpTgl.getDate();
    const month = monthNames[inpTgl.getMonth()];
    const year = inpTgl.getFullYear();
    return `${day} ${month} ${year}`;
};