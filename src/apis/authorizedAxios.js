import axios from 'axios'

let authorizedAxiosInstance = axios.create()

authorizedAxiosInstance.defaults.baseURL = import.meta.env.VITE_API_URL
authorizedAxiosInstance.defaults.timeout = 10 * 60 * 1000 // 10 minutes
// authorizedAxiosInstance.defaults.withCredentials = true

authorizedAxiosInstance.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

authorizedAxiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default authorizedAxiosInstance
