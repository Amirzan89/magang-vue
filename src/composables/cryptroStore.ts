let aesKey: any = null
let hmacKey: any = null
export const useCryptoStore = () => {
    return {
        get_aes: () => aesKey,
        get_hmac: () => hmacKey,
        setKeys: (newAes: CryptoKey, newHmac: CryptoKey) => {
            aesKey = newAes
            hmacKey = newHmac
        },
        clear: () => {
            aesKey = null
            hmacKey = null
        }
    }
}
