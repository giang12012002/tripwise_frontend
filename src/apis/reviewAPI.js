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
    },
    fetch: async () => {
        const response = await authorizedAxios.get('/api/Review/tour-ai')
        return response
    },
    getAverageReview: async () => {
        const response = await authorizedAxios.get('/api/Review/GetAVGReview')
        return response
    },

    getReviewsByTour: async (tourId) => {
        const response = await authorizedAxios.get(
            `/api/Review/tour-partner/${tourId}`
        )
        return response
    },

    addTourReview: async ({ tourId, rating, comment }) => {
        const response = await authorizedAxios.post(
            '/api/Review/tour-partner',
            {
                tourId,
                rating,
                comment
            }
        )
        return response
    },

    getAvgReviewByTour: async (tourId) => {
        const response = await authorizedAxios.get(
            `/api/Review/GetAVGReview-partner/${tourId}`
        )
        return response
    },

    getAllReviewsByPartner: async () => {
        const response = await authorizedAxios.get(
            '/api/Review/GetAllreviewtour-partner'
        )
        return response
    }
}

export default reviewAPI
