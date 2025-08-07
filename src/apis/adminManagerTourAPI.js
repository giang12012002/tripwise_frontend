import authorizedAxios from './authorizedAxios'

// Lấy danh sách tất cả các tour với tùy chọn lọc theo trạng thái và partnerId
const getAllTours = async (status = null, partnerId = null) => {
    try {
        let url = 'api/admin/tours/all-tour'
        const params = new URLSearchParams()
        if (status) {
            params.append('status', encodeURIComponent(status))
        }
        if (partnerId) {
            params.append('partnerId', encodeURIComponent(partnerId))
        }
        if (params.toString()) {
            url += `?${params.toString()}`
        }
        const response = await authorizedAxios.get(url)
        console.log('All tours fetched:', response.data)
        return response
    } catch (err) {
        console.error('API Error (getAllTours):', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            errors: err.response?.data?.errors || 'Không có chi tiết lỗi'
        })
        throw err
    }
}

// Lấy danh sách các tour đang chờ duyệt
const getPendingTours = async () => {
    try {
        const response = await authorizedAxios.get('api/admin/tours/pending')
        console.log('Pending tours fetched:', response.data)
        return response
    } catch (err) {
        console.error('API Error (getPendingTours):', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            errors: err.response?.data?.errors || 'Không có chi tiết lỗi'
        })
        throw err
    }
}

// Lấy chi tiết tour theo tourId
const getTourDetail = async (tourId) => {
    try {
        if (!tourId || isNaN(tourId) || parseInt(tourId) <= 0) {
            throw new Error('ID tour không hợp lệ')
        }
        console.log('Fetching tour with ID:', tourId)
        const response = await authorizedAxios.get(`api/admin/tours/${tourId}`)
        console.log('API Response:', response)
        return response
    } catch (err) {
        console.error('API Error (getTourDetail):', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            errors: err.response?.data?.errors || 'Không có chi tiết lỗi'
        })
        throw err
    }
}

// Phê duyệt tour, chuyển trạng thái sang Approved và cập nhật ModifiedDate, ModifiedBy
const approveTour = async (tourId) => {
    try {
        const response = await authorizedAxios.post(
            `api/admin/tours/${tourId}/approve`
        )
        return response
    } catch (err) {
        console.error('API Error (approveTour):', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            errors: err.response?.data?.errors || 'Không có chi tiết lỗi'
        })
        throw err
    }
}

// Từ chối tour, chuyển trạng thái sang Rejected
const rejectTour = async (tourId, reason) => {
    try {
        console.log('Gửi yêu cầu từ chối tour:', { tourId, reason })
        const response = await authorizedAxios.post(
            `api/admin/tours/${tourId}/reject`,
            reason, // Gửi chuỗi thuần túy
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        console.log('Phản hồi từ chối tour:', response.data)
        return response
    } catch (err) {
        console.error('Lỗi API (rejectTour):', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            errors: err.response?.data?.errors || 'Không có chi tiết lỗi'
        })
        throw err
    }
}

export default {
    getAllTours,
    getPendingTours,
    getTourDetail,
    approveTour,
    rejectTour
}
