import authorizedAxios from './authorizedAxios'

const appSettingAPI = {
    fetchKeys: async () => {
        const response = await authorizedAxios.get('/api/admin/appsettings')
        return response
    },
    fetchKey: async (key) => {
        const response = await authorizedAxios.get(
            `/api/admin/appsettings/${key}`
        )
        return response
    },
    updateKey: async (key, data) => {
        const response = await authorizedAxios.put(
            `/api/admin/appsettings/${key}`,
            data
        )
        return response
    },

    setFreePlan: async (planName) => {
        const response = await authorizedAxios.post(
            `/api/admin/appsettings/set-free-plan`,
            planName,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        return response
    },
    setTrialPlan: async (trialPlan) => {
        const response = await authorizedAxios.post(
            `/api/admin/appsettings/set-trial-plan`,
            JSON.stringify(trialPlan),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        return response
    },
    setTrialDuration: async (duration) => {
        const response = await authorizedAxios.put(
            `/api/admin/appsettings/trial-duration`,
            duration,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        return response
    }
}

export default appSettingAPI
