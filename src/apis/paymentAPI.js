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
        const response = await authorizedAxios.post(
            '/api/payment/create-draft',
            {
                tourId,
                numAdults,
                numChildren5To10,
                numChildrenUnder5,
                paymentMethod
            }
        )
        return response
    },
    updateBookingRequest: async ({
        bookingId,
        firstName,
        lastName,
        phoneNumber,
        numAdults,
        numChildren5To10,
        numChildrenUnder5
    }) => {
        const response = await authorizedAxios.put(
            '/api/payment/update-draft',
            {
                bookingId,
                firstName,
                lastName,
                phoneNumber,
                numAdults,
                numChildren5To10,
                numChildrenUnder5
            }
        )
        return response
    },
    confirmAndPay: async ({ bookingId }) => {
        const response = await authorizedAxios.post(
            '/api/payment/confirm-and-pay/' + bookingId
        )
        return response
    },
    fetchPaymentHistory: async ({ status }) => {
        const response = await authorizedAxios.get(
            '/api/payment/payment-history',
            {
                params: status ? { status } : {} // chỉ thêm nếu có
            }
        )
        return response
    },
    fetchBookingDetail: async ({ bookingId }) => {
        const response = await authorizedAxios.get(`/api/payment/${bookingId}`)
        return response
    },

    sendRefundRequest: async ({ bookingId, refundMethod, cancelReason }) => {
        const response = await authorizedAxios.post(
            `/api/payment/${bookingId}/cancel`,
            {
                refundMethod,
                cancelReason
            }
        )
        return response
    }
}

export default paymentAPI
