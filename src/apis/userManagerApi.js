import authorizedAxios from './authorizedAxios'

const userManagerApi = {
    // Lấy danh sách tất cả người dùng
    fetchAllUsers: async () => {
        try {
            const response = await authorizedAxios.get('/api/admin/allusers')
            return response
        } catch (err) {
            console.error('API Error (fetchAllUsers):', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            })
            throw err
        }
    },

    // Lấy danh sách người dùng không active
    fetchNonActiveUsers: async () => {
        try {
            const response = await authorizedAxios.get(
                '/api/admin/users/nonactive'
            )
            return response
        } catch (err) {
            console.error('API Error (fetchNonActiveUsers):', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            })
            throw err
        }
    },

    // Tạo người dùng mới
    createUser: async (userData) => {
        try {
            const response = await authorizedAxios.post(
                '/api/admin/create',
                userData
            )
            return response
        } catch (err) {
            console.error('API Error (createUser):', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            })
            throw err
        }
    },

    // Xóa người dùng
    deleteUser: async (userId, reason) => {
        try {
            const response = await authorizedAxios.delete(
                `/api/admin/delete/${userId}`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: reason // Send reason as a raw string
                }
            )
            return response
        } catch (err) {
            console.error('API Error (deleteUser):', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                payload: { userId, reason }
            })
            throw err
        }
    },

    // Kích hoạt người dùng
    activateUser: async (userId) => {
        try {
            const response = await authorizedAxios.put(
                `/api/admin/${userId}/activate`
            )
            return response
        } catch (err) {
            console.error('API Error (activateUser):', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            })
            throw err
        }
    },

    // Lấy chi tiết người dùng
    fetchUserDetail: async (userId) => {
        try {
            const response = await authorizedAxios.get(
                `/api/admin/user-detail/${userId}`
            )
            return response
        } catch (err) {
            console.error('API Error (fetchUserDetail):', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            })
            throw err
        }
    },

    // Cập nhật thông tin người dùng
    updateUser: async (userId, userData) => {
        try {
            const response = await authorizedAxios.put(
                `/api/admin/update/${userId}`,
                userData
            )
            return response
        } catch (err) {
            console.error('API Error (updateUser):', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            })
            throw err
        }
    }
}

export default userManagerApi
