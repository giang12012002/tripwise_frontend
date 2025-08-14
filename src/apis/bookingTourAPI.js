import authorizedAxios from './authorizedAxios'

const bookingTourAPI = {
    getBookings: async () => {
        const response = await authorizedAxios.get('/api/BookingTours')
        return response
    },
    getBookingDetail: async ({ bookingId }) => {
        const response = await authorizedAxios.get(
            `/api/BookingTours/booking-detail/${bookingId}`
        )
        return response
    },
    getBookingByTour: async ({ tourId }) => {
        const response = await authorizedAxios.get(
            `/api/BookingTours/by-tour/${tourId}`
        )
        return response
    }
}

export default bookingTourAPI
