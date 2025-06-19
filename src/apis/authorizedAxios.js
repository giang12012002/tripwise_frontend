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

// authorizedAxios.js
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
                    throw new Error('Thiếu refresh token hoặc deviceId')
                }

                // Ngăn chặn các yêu cầu làm mới token đồng thời
                if (authorizedAxiosInstance.isRefreshing) {
                    return new Promise((resolve, reject) => {
                        authorizedAxiosInstance.refreshQueue.push({
                            resolve,
                            reject,
                            originalRequest
                        })
                    })
                }
                authorizedAxiosInstance.isRefreshing = true
                authorizedAxiosInstance.refreshQueue = []

                const response = await authAPI.refreshToken(
                    refreshToken,
                    deviceId
                )
                authorizedAxiosInstance.isRefreshing = false

                if (response.status === 200) {
                    const { accessToken, refreshToken } = response.data
                    localStorage.setItem('accessToken', accessToken)
                    localStorage.setItem('refreshToken', refreshToken)
                    originalRequest.headers['Authorization'] =
                        `Bearer ${accessToken}`

                    // Thử lại tất cả các yêu cầu trong hàng đợi
                    authorizedAxiosInstance.refreshQueue.forEach(
                        ({ resolve, originalRequest }) => {
                            originalRequest.headers['Authorization'] =
                                `Bearer ${accessToken}`
                            resolve(authorizedAxiosInstance(originalRequest))
                        }
                    )
                    authorizedAxiosInstance.refreshQueue = []

                    return authorizedAxiosInstance(originalRequest)
                }
            } catch (refreshError) {
                authorizedAxiosInstance.isRefreshing = false
                authorizedAxiosInstance.refreshQueue.forEach(({ reject }) =>
                    reject(refreshError)
                )
                authorizedAxiosInstance.refreshQueue = []

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

// Thêm thuộc tính để theo dõi trạng thái làm mới
authorizedAxiosInstance.isRefreshing = false
authorizedAxiosInstance.refreshQueue = []
export default authorizedAxiosInstance
