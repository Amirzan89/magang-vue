export function useConfig() {
    return {
        apiUrl: import.meta.env.APP_URL,
        appName: import.meta.env.APP_NAME,
        baseURL: import.meta.env.env.APP_URL || 'https://alcorys',
    }
}