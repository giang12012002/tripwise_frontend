import authorizedAxios from './authorizedAxios'

const reviewAPI = {
    createTourReview: async ({ tourId, userId, rating, comment }) => {
        const response = await authorizedAxios.post('/api/Review/tour', {
            tourId,
            userId,
            rating,
            comment
        })
        return response
    },
    createTourAIReview: async ({ tourId, rating, comment }) => {
        const response = await authorizedAxios.post('/api/Review/tour-ai', {
            tourId,
            rating,
            comment
        })
        return response
    },
    fetchTourReview: async (tourId) => {
        const response = await authorizedAxios.get(`/api/Review/tour/${tourId}`)
        return response
    },
    fetchTourAIReview: async (tourId) => {
        const response = await authorizedAxios.get(
            `/api/Review/tour-ai/${tourId}`
        )
        return response
    }
}

export default reviewAPI
