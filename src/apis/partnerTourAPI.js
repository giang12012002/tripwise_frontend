import authorizedAxios from './authorizedAxios'

const getAllTours = async (status = '') => {
    try {
        const response = await authorizedAxios.get(
            `api/partner/tours${status ? `?status=${status}` : ''}`
        )
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

const getTopDestinations = async (top = 10) => {
    try {
        const response = await authorizedAxios.get(
            `api/partner/tours/top-destinations?top=${top}`
        )
        return response
    } catch (err) {
        console.error('API Error (getTopDestinations):', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            errors: err.response?.data?.errors || 'Không có chi tiết lỗi'
        })
        throw err
    }
}

const createTour = async (dto) => {
    try {
        const response = await authorizedAxios.post(
            'api/partner/tours/create-tour',
            dto,
            {
                headers: { 'Content-Type': 'multipart/form-data' }
            }
        )
        return response
    } catch (err) {
        console.error('API Error (createTour):', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            errors: err.response?.data?.errors || 'Không có chi tiết lỗi',
            payload: dto
        })
        throw err
    }
}

const createActivity = async (itineraryId, dto) => {
    try {
        const response = await authorizedAxios.post(
            `api/partner/tours/itinerary/${itineraryId}/create-activity`,
            dto,
            {
                headers: { 'Content-Type': 'multipart/form-data' }
            }
        )
        return response
    } catch (err) {
        console.error('Lỗi API (createActivity):', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            errors: err.response?.data?.errors || 'Không có chi tiết lỗi',
            payload: dto
        })
        throw err
    }
}

const updateActivity = async (activityId, dto) => {
    try {
        const response = await authorizedAxios.put(
            `api/partner/tours/update-activity/${activityId}`,
            dto,
            {
                headers: { 'Content-Type': 'multipart/form-data' }
            }
        )
        return response
    } catch (err) {
        console.error('Lỗi API (updateActivity):', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            errors: err.response?.data?.errors || 'Không có chi tiết lỗi',
            payload: dto
        })
        throw err
    }
}

const submitTour = async (tourId) => {
    try {
        const response = await authorizedAxios.post(
            `api/partner/tours/${tourId}/submit`
        )
        return response
    } catch (err) {
        console.error('API Error (submitTour):', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            errors: err.response?.data?.errors || 'Không có chi tiết lỗi'
        })
        throw err
    }
}

const getTourDetail = async (tourId) => {
    try {
        if (!tourId || isNaN(tourId) || parseInt(tourId) <= 0) {
            throw new Error('ID tour không hợp lệ')
        }
        const response = await authorizedAxios.get(
            `api/partner/tours/${tourId}`
        )
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

const updateTour = async (tourId, dto) => {
    try {
        const response = await authorizedAxios.put(
            `api/partner/tours/update-tour/${tourId}`,
            dto,
            {
                headers: { 'Content-Type': 'multipart/form-data' }
            }
        )
        return response
    } catch (err) {
        console.error('Lỗi API (updateTour):', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            errors: err.response?.data?.errors || 'Không có chi tiết lỗi',
            payload: dto
        })
        throw err
    }
}

const deleteTourImage = async (imageId) => {
    try {
        const response = await authorizedAxios.delete(
            `api/partner/tours/delete-tour-images/${imageId}`
        )
        return response
    } catch (err) {
        console.error('API Error (deleteTourImage):', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            errors: err.response?.data?.errors || 'Không có chi tiết lỗi'
        })
        throw err
    }
}

const deleteMultipleTourImages = async (imageIds) => {
    try {
        const response = await authorizedAxios.delete(
            'api/partner/tours/delete-multiple-images',
            {
                data: imageIds
            }
        )
        return response
    } catch (err) {
        console.error('API Error (deleteMultipleTourImages):', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            errors: err.response?.data?.errors || 'Không có chi tiết lỗi'
        })
        throw err
    }
}

const createItinerary = async (tourId, dto) => {
    try {
        const response = await authorizedAxios.post(
            `api/partner/tours/${tourId}/create-itinerary`,
            dto
        )
        return response
    } catch (err) {
        console.error('API Error (createItinerary):', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            errors: err.response?.data?.errors || 'Không có chi tiết lỗi',
            payload: dto
        })
        throw err
    }
}

const updateItinerary = async (itineraryId, dto) => {
    try {
        const response = await authorizedAxios.put(
            `api/partner/tours/update-itinerary/${itineraryId}`,
            dto
        )
        return response
    } catch (err) {
        console.error('API Error (updateItinerary):', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            errors: err.response?.data?.errors || 'Không có chi tiết lỗi',
            payload: dto
        })
        throw err
    }
}

const deleteItinerary = async (itineraryId) => {
    try {
        const response = await authorizedAxios.delete(
            `api/partner/tours/delete-itinerary/${itineraryId}`
        )
        return response
    } catch (err) {
        console.error('API Error (deleteItinerary):', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            errors: err.response?.data?.errors || 'Không có chi tiết lỗi'
        })
        throw err
    }
}

const deleteActivity = async (activityId) => {
    try {
        const response = await authorizedAxios.delete(
            `api/partner/tours/delete-activity/${activityId}`
        )
        return response
    } catch (err) {
        console.error('API Error (deleteActivity):', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            errors: err.response?.data?.errors || 'Không có chi tiết lỗi'
        })
        throw err
    }
}

const deleteActivityImage = async (imageId) => {
    try {
        const response = await authorizedAxios.delete(
            `api/partner/tours/delete-activity-images/${imageId}`
        )
        return response
    } catch (err) {
        console.error('API Error (deleteActivityImage):', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            errors: err.response?.data?.errors || 'Không có chi tiết lỗi'
        })
        throw err
    }
}

const deleteMultipleActivityImages = async (imageIds) => {
    try {
        const response = await authorizedAxios.delete(
            'api/partner/tours/attraction/delete-multiple-images',
            {
                data: imageIds
            }
        )
        return response
    } catch (err) {
        console.error('API Error (deleteMultipleActivityImages):', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            errors: err.response?.data?.errors || 'Không có chi tiết lỗi'
        })
        throw err
    }
}

const deleteOrDraftTour = async (tourId, action) => {
    try {
        const response = await authorizedAxios.delete(
            `api/partner/tours/delete-or-draft-tour/${tourId}?action=${action}`
        )
        return response
    } catch (err) {
        console.error('API Error (deleteOrDraftTour):', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            errors: err.response?.data?.errors || 'Không có chi tiết lỗi'
        })
        throw err
    }
}

const getStatistics = async (fromDate = null, toDate = null) => {
    try {
        const params = new URLSearchParams()
        if (fromDate) params.append('fromDate', fromDate)
        if (toDate) params.append('toDate', toDate)

        const response = await authorizedAxios.get(
            `api/partner/tours/statistics${params.toString() ? `?${params.toString()}` : ''}`
        )
        return response
    } catch (err) {
        console.error('API Error (getStatistics):', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            errors: err.response?.data?.errors || 'Không có chi tiết lỗi'
        })
        throw err
    }
}

const createOrGet = async ({ tourId }) => {
    const response = await authorizedAxios.post(
        `/api/partner/tours/${tourId}/create-or-get`
    )
    return response
}

const resubmitTourRejected = async ({ tourId }) => {
    const response = await authorizedAxios.post(
        `/api/partner/tours/resubmit-rejected/${tourId}`
    )
    return response
}

export default {
    getAllTours,
    getTopDestinations,
    createTour,
    submitTour,
    getTourDetail,
    updateTour,
    deleteTourImage,
    deleteMultipleTourImages,
    createItinerary,
    updateItinerary,
    deleteItinerary,
    createActivity,
    updateActivity,
    deleteActivity,
    deleteActivityImage,
    deleteMultipleActivityImages,
    deleteOrDraftTour,
    getStatistics,
    createOrGet,
    resubmitTourRejected
}
