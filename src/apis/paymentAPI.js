import authorizedAxios from './authorizedAxios'

const paymentAPI = {
    sendPlanRequest: async ({ planId, paymentMethod }) => {
        const response = await authorizedAxios.post('/api/payment/buy-plan', {
            planId,
            paymentMethod
        })
        return response
    },
    sendBookingRequest: async ({
        tourId,
        numAdults,
        numChildren5To10,
        numChildrenUnder5,
        paymentMethod
    }) => {
        const response = await authorizedAxios.post('/api/payment/booking', {
            tourId,
            numAdults,
            numChildren5To10,
            numChildrenUnder5,
            paymentMethod
        })
        return response
    },
    fetchPaymentHistory: async ({ status }) => {
        const response = await authorizedAxios.get(
            '/api/payment/payment-history?status=' + status
        )
        return response
    },
    fetchBookingDetail: async ({ bookingId }) => {
        const response = await authorizedAxios.get(`/api/payment/${bookingId}`)
        return response
    }
}

export default paymentAPI
