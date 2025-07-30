import authorizedAxios from './authorizedAxios'

const partnerManagerApi = {
    // Lấy danh sách tất cả đối tác
    fetchAllPartners: async () => {
        try {
            const response = await authorizedAxios.get(
                '/api/admin/all-partners'
            )
            return response
        } catch (err) {
            console.error('API Error (fetchAllPartners):', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            })
            throw err
        }
    },

    // Lấy danh sách đối tác không active
    fetchNonActivePartners: async () => {
        try {
            const response = await authorizedAxios.get(
                '/api/admin/partners/nonactive'
            )
            return response
        } catch (err) {
            console.error('API Error (fetchNonActivePartners):', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            })
            throw err
        }
    },

    // Tạo đối tác mới
    createPartner: async (partnerData) => {
        try {
            const response = await authorizedAxios.post(
                '/api/admin/create-partner',
                partnerData
            )
            return response
        } catch (err) {
            console.error('API Error (createPartner):', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            })
            throw err
        }
    },

    // Xóa đối tác
    deletePartner: async (partnerId, reason) => {
        try {
            const response = await authorizedAxios.delete(
                `/api/admin/delete-partner/${partnerId}`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: reason // Gửi reason dưới dạng raw string
                }
            )
            return response
        } catch (err) {
            console.error('API Error (deletePartner):', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                payload: { partnerId, reason }
            })
            throw err
        }
    },

    // Kích hoạt đối tác
    activatePartner: async (partnerId) => {
        try {
            const response = await authorizedAxios.put(
                `/api/admin/activate-partner/${partnerId}`
            )
            return response
        } catch (err) {
            console.error('API Error (activatePartner):', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            })
            throw err
        }
    },

    // Lấy chi tiết đối tác
    fetchPartnerDetail: async (partnerId) => {
        try {
            const response = await authorizedAxios.get(
                `/api/admin/detail-partner/${partnerId}`
            )
            return response
        } catch (err) {
            console.error('API Error (fetchPartnerDetail):', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            })
            throw err
        }
    },

    // Cập nhật thông tin đối tác
    updatePartner: async (partnerId, partnerData) => {
        try {
            const response = await authorizedAxios.put(
                `/api/admin/update-partner/${partnerId}`,
                partnerData
            )
            return response
        } catch (err) {
            console.error('API Error (updatePartner):', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            })
            throw err
        }
    }
}

export default partnerManagerApi
