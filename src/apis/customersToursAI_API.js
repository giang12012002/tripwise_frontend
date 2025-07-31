import authorizedAxios from './authorizedAxios'

const createItinerary = async (formData) => {
    const payload = {
        destination: formData.destination,
        travelDate: formData.travelDate, // Chuỗi ISO (YYYY-MM-DD)
        days: parseInt(formData.days, 10), // Số nguyên
        preferences: formData.preferences || 'General sightseeing',
        budgetVND: Number(formData.budgetVND), // Số
        transportation: formData.transportation || '',
        diningStyle: formData.diningStyle || '',
        groupType: formData.groupType || '',
        accommodation: formData.accommodation || ''
    }
    console.log('Payload gửi đi:', payload)
    try {
        const response = await authorizedAxios.post(
            'api/AIGeneratePlan/CreateItinerary',
            payload
        )
        return response
    } catch (err) {
        console.error('API Error:', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            errors: err.response?.data?.errors || {},
            payload
        })
        throw err
    }
}

const generateItineraryChunk = async (chunkRequest) => {
    console.log('Payload gửi đi:', chunkRequest)
    try {
        const response = await authorizedAxios.post(
            'api/AIGeneratePlan/GenerateItineraryChunk',
            chunkRequest
        )
        return response
    } catch (err) {
        console.error('API Error (generateItineraryChunk):', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            errors: err.response?.data?.errors || 'Không có chi tiết lỗi',
            payload: chunkRequest
        })
        throw err
    }
}

const saveTourFromGenerated = async (generatePlanId) => {
    const response = await authorizedAxios.post(
        `api/AIGeneratePlan/SaveTourFromGenerated/${generatePlanId}`
    )
    console.log('saveTourFromGenerated response:', response.data)
    return response
}

const updateItinerary = async (generatePlanId, message) => {
    try {
        console.log('Payload gửi đi:', { Message: message, generatePlanId })
        const response = await authorizedAxios.post(
            `api/AIGeneratePlan/UpdateItinerary/${generatePlanId}`,
            { Message: message }
        )
        return response
    } catch (err) {
        console.error('API Error (updateItinerary):', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            errors: err.response?.data?.errors || 'Không có chi tiết lỗi',
            payload: { Message: message, generatePlanId }
        })
        throw err
    }
}
const updateItineraryChunk = async (
    generatePlanId,
    userMessage,
    startDay,
    chunkSize
) => {
    try {
        console.log('Payload gửi đi:', { userMessage, startDay, chunkSize })
        const response = await authorizedAxios.post(
            `api/AIGeneratePlan/UpdateItineraryChunk/${generatePlanId}`,
            { userMessage, startDay, chunkSize }
        )
        return response
    } catch (err) {
        console.error('API Error (updateItineraryChunk):', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            errors: err.response?.data?.errors || 'Không có chi tiết lỗi',
            payload: { userMessage, startDay, chunkSize }
        })
        throw err
    }
}
const getToursByUserId = async (userId) => {
    return await authorizedAxios.get(
        `api/AIGeneratePlan/GetToursByUserId?userId=${userId}`
    )
}

const deleteTour = async (tourId) => {
    return await authorizedAxios.delete(
        `api/AIGeneratePlan/DeleteTour/${tourId}`
    )
}

const getTourDetailById = async (id) => {
    try {
        const response = await authorizedAxios.get(
            `api/AIGeneratePlan/GetTourDetailById?tourId=${id}`
        )
        return response
    } catch (err) {
        console.error('API Error (getTourDetailById):', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status
        })
        throw err
    }
}

const getHistory = async () => {
    try {
        const response = await authorizedAxios.get(
            'api/AIGeneratePlan/GetHistoryByUser'
        )
        return response
    } catch (err) {
        console.error('API Error (getHistory):', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status
        })
        throw err
    }
}

const getHistoryDetail = async (id) => {
    try {
        const response = await authorizedAxios.get(
            `api/AIGeneratePlan/GetHistoryDetailById/${id}`
        )
        return response
    } catch (err) {
        console.error('API Error (getHistoryDetail):', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status
        })
        throw err
    }
}

export default {
    createItinerary,
    generateItineraryChunk,
    saveTourFromGenerated,
    updateItinerary,
    updateItineraryChunk,
    getToursByUserId,
    deleteTour,
    getTourDetailById,
    getHistory,
    getHistoryDetail
}
