import authorizedAxios from './authorizedAxios'

const planAdminAPI = {
    fetchPlans: async () => {
        const response = await authorizedAxios.get('/api/admin/plan/All')
        return response
    },
    fetchPlan: async (id) => {
        const response = await authorizedAxios.get(
            `/api/admin/plan/detail/${id}`
        )
        return response
    },
    createPlan: async (data) => {
        const response = await authorizedAxios.post(`/api/admin/plan`, data)
        return response
    },
    updatePlan: async (id, data) => {
        const response = await authorizedAxios.put(
            `/api/admin/plan/update/${id}`,
            data
        )
        return response
    },
    deletePlan: async (id) => {
        const response = await authorizedAxios.delete(
            `/api/admin/plan/delete/${id}`
        )
        return response
    }
}

export default planAdminAPI
