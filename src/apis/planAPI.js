import authorizedAxios from './authorizedAxios'

const planAPI = {
    fetchPlans: async () => {
        const response = await authorizedAxios.get('/api/plan/available')
        return response
    },
    upgrade: async (planId) => {
        const response = await authorizedAxios.post(
            `/api/plan/upgrade/${planId}`
        )
        return response
    }
}

export default planAPI
