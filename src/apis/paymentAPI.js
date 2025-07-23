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
        numberOfPeople,
        numberOfDays,
        paymentMethod
    }) => {
        const response = await authorizedAxios.post('/api/payment/booking', {
            tourId,
            numberOfPeople,
            numberOfDays,
            paymentMethod
        })
        return response
    }
}

export default paymentAPI
