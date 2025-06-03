import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

export const signup = (data) => api.post('/api/Authentication/signup', data)
export const verifyOtp = (otp, signupData) =>
    api.post(`/api/Authentication/verifyOtp/${otp}`, signupData)
export const login = (data) => api.post('/api/Authentication/login', data)
export const googleLogin = (data) =>
    api.post('/api/Authentication/google-login', data)
export const logout = (deviceId) =>
    api.post(`/api/Authentication/logout/${deviceId}`)

export default api
