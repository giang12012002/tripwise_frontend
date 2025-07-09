import authorizedAxios from './authorizedAxios'

const paymentAPI = {
    sendRequest: async ({ planId, paymentMethod }) => {
        const response = await authorizedAxios.post('/api/payment/buy-plan', {
            planId,
            paymentMethod
        })
        return response
    },
    callback: async (planId) => {
        const response = await authorizedAxios.post(
            `/api/plan/upgrade/${planId}`
        )
        return response
    }
}

export default paymentAPI
