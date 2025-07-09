import authorizedAxios from './authorizedAxios'

const getProfile = async () => {
    try {
        const response = await authorizedAxios.get('api/user/profile')
        return response
    } catch (err) {
        console.error('API Error (getProfile):', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status
        })
        throw err
    }
}

const updateProfile = async (dto) => {
    try {
        const response = await authorizedAxios.put('api/user/profile', dto)
        return response
    } catch (err) {
        console.error('API Error (updateProfile):', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            errors: err.response?.data?.errors || 'Không có chi tiết lỗi',
            payload: dto
        })
        throw err
    }
}

export default {
    getProfile,
    updateProfile
}
