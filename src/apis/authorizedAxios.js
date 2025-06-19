import axios from 'axios'
import { authAPI } from '@/apis'

const authorizedAxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10 * 60 * 1000 // 10 minutes
})

authorizedAxiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken')
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

authorizedAxiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                const refreshToken = localStorage.getItem('refreshToken')
                const deviceId = localStorage.getItem('deviceId')
                if (!refreshToken || !deviceId) {
                    throw new Error('Missing refresh token or deviceId')
                }
                const response = await authAPI.refreshToken(
                    refreshToken,
                    deviceId
                )
                if (response.status === 200) {
                    const { AccessToken, RefreshToken } = response.data
                    localStorage.setItem('accessToken', AccessToken)
                    localStorage.setItem('refreshToken', RefreshToken)
                    originalRequest.headers['Authorization'] =
                        `Bearer ${AccessToken}`
                    return authorizedAxiosInstance(originalRequest)
                }
            } catch (refreshError) {
                console.error('Làm mới token thất bại:', refreshError)
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                localStorage.removeItem('auth')
                localStorage.removeItem('userId')
                window.location.href = '/signin'
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)

export default authorizedAxiosInstance
