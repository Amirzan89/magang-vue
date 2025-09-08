export function useConfig() {
    return {
        apiUrl: import.meta.env.VITE_APP_URL,
        appName: import.meta.env.VITE_APP_NAME,
        baseURL: import.meta.env.VITE_APP_URL || 'https://alcorys',
    }
}