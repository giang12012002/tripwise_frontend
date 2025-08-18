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
    },
    fetchAllHotNews: async () => {
        const response = await authorizedAxios.get(
            '/api/admin/appsettings/hot-new'
        )
        return response
    },
    fetchHotNewsById: async (id) => {
        const response = await authorizedAxios.get(
            `/api/admin/appsettings/hot-new-by/${id}`
        )
        return response
    },
    createHotNews: async (hotNewsData) => {
        const formData = new FormData()
        if (hotNewsData.imageFile) {
            formData.append('ImageFile', hotNewsData.imageFile)
        } else if (hotNewsData.imageUrl) {
            formData.append('ImageUrl', hotNewsData.imageUrl)
        }
        if (hotNewsData.redirectUrl) {
            formData.append('RedirectUrl', hotNewsData.redirectUrl)
        }
        const response = await authorizedAxios.post(
            '/api/admin/appsettings/create-hot-new',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
        return response
    },
    updateHotNews: async (id, hotNewsData) => {
        const formData = new FormData()
        if (hotNewsData.imageFile) {
            formData.append('ImageFile', hotNewsData.imageFile)
        } else if (hotNewsData.imageUrl) {
            formData.append('ImageUrl', hotNewsData.imageUrl)
        }
        if (hotNewsData.redirectUrl) {
            formData.append('RedirectUrl', hotNewsData.redirectUrl)
        }
        const response = await authorizedAxios.put(
            `/api/admin/appsettings/hot-new-update/${id}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
        return response
    },
    deleteHotNews: async (id) => {
        const response = await authorizedAxios.delete(
            `/api/admin/appsettings/hot-new-delete/${id}`
        )
        return response
    }
}

export default appSettingAPI
