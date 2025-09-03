/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_APP_NAME: string
  // tambahin env lain kalo perlu
}
interface ImportMeta {
    readonly env: ImportMetaEnv
}