export interface Base64File {
    data: string
    meta: {
        name: string
        type: string
        size: number
        lastModified: number
    }
}
export async function base64_encode(file: File): Promise<Base64File> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1]
            resolve({
                data: base64,
                meta: {
                    name: file.name,
                    type: file.type && file.type.trim() !== '' ? file.type : 'application/octet-stream',
                    size: file.size,
                    lastModified: file.lastModified
                }
            })
        }
        reader.onerror = () => reject(reader.error)
        reader.readAsDataURL(file)
    })
}
export function base64_decode_to_blob(encoded: Base64File): Blob {
    const binary = atob(encoded.data)
    const len = binary.length
    const bytes = new Uint8Array(len)
    for(let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i)
    return new Blob([bytes], { type: encoded.meta.type })
}
export function base64_decode_to_file(encoded: Base64File): File {
    const blob = base64_decode_to_blob(encoded)
    return new File([blob], encoded.meta.name, {
        type: encoded.meta.type,
        lastModified: encoded.meta.lastModified
    })
}
export function isImageFile(meta: Base64File['meta']): boolean {
    if(!meta?.type) return false
    return meta.type.startsWith('image/')
}
