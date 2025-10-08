export const useConfig = () => {
    return {
        nodeEnv: import.meta.env.VITE_NODE_ENV,
        apiUrl: import.meta.env.VITE_APP_URL,
        appName: import.meta.env.VITE_APP_NAME,
        baseURL: import.meta.env.VITE_APP_URL || 'https://alcorys',
    }
}