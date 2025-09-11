import CryptoJS from 'crypto-js'
import RSAComposables from '@/composables/RSA'
const rsaComp = RSAComposables()
export default () => {
    const genIV = async(idUser?: string) => {
        const encoder = new TextEncoder()
        const hmacKey = atob(sessionStorage.hmac_key)
        const cryptoKey = await crypto.subtle.importKey(
            "raw",
            typeof hmacKey === "string" ? encoder.encode(hmacKey) : hmacKey,
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"]
        )
        const timestamp = Date.now().toString()
        const random = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))))
        const mergedInput = encoder.encode(idUser + timestamp + random)
        return new Uint8Array(await crypto.subtle.sign('HMAC', cryptoKey, mergedInput)).slice(0, 16)
    }
    const encryptReq = async (requestBody: any) => {
        const iv = await genIV()
        const cipherHex = CryptoJS.AES.encrypt(requestBody, CryptoJS.enc.Hex.parse(sessionStorage.aes_key), { iv: CryptoJS.enc.Hex.parse(rsaComp.hexCus.enc(iv)), mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }).ciphertext.toString(CryptoJS.enc.Hex)
        const hmacKey = await crypto.subtle.importKey('raw', rsaComp.hexCus.dec(sessionStorage.hmac_key), { name:'HMAC', hash:'SHA-256' }, false, ['sign'])
        const payload = new Uint8Array(iv.length + (cipherHex.length/2))
        payload.set(iv, 0)
        payload.set(rsaComp.hexCus.dec(cipherHex), iv.length)
        const mac = new Uint8Array(await crypto.subtle.sign('HMAC', hmacKey, payload))
        return { iv: rsaComp.hexCus.enc(iv), data: cipherHex, mac: rsaComp.hexCus.enc(mac) }
    }
    const decryptRes = (cipher: any, iv: any) => {
        return JSON.parse(CryptoJS.AES.decrypt({ ciphertext: CryptoJS.enc.Hex.parse(cipher) }, CryptoJS.enc.Hex.parse(sessionStorage.aes_key), { iv: CryptoJS.enc.Hex.parse(iv) }).toString(CryptoJS.enc.Utf8))
    }
    return { encryptReq, decryptRes }
}