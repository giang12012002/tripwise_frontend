import authorizedAxios from './authorizedAxios'

const tourUserAPI = {
    getApprovedTours: async () => {
        const response = await authorizedAxios.get('/api/TourUser/approved')
        return response
    },
    getApprovedTourDetail: async (tourId, token) => {
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const response = await authorizedAxios.get(
            `/api/TourUser/approved/${tourId}`,
            { headers }
        )
        return response
    },
    getBookedTours: async (token) => {
        const response = await authorizedAxios.get(
            '/api/TourUser/booked-tours',
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        )
        return response
    },
    addToWishlist: async (tourId, token) => {
        const response = await authorizedAxios.post(
            `/api/TourUser/addWishlist?tourId=${tourId}`, // 👈 query string
            null, // 👈 không gửi body
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        )
        return response
    },

    removeFromWishlist: async (tourId, token) => {
        const response = await authorizedAxios.delete(
            `/api/TourUser/removeFromWishlist?tourId=${tourId}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        )
        return response
    },
    getUserWishlist: async (token) => {
        const response = await authorizedAxios.get('/api/TourUser/Wishlist', {
            headers: { Authorization: `Bearer ${token}` }
        })
        return response
    }
}

export default tourUserAPI
