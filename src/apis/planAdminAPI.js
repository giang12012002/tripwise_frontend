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
    // TODO: vì sao update này lại phải truyền createdBy ?
    createPlan: async (
        planName,
        price,
        description,
        maxResquests,
        createdBy
    ) => {
        const response = await authorizedAxios.put(`/api/admin/plan`, {
            planName,
            price,
            description,
            maxResquests,
            createdBy
        })
        return response
    },
    updatePlan: async (
        id,
        planName,
        price,
        description,
        maxResquests,
        modifiedBy
    ) => {
        const response = await authorizedAxios.put(`/api/admin/plan/${id}`, {
            planName,
            price,
            description,
            maxResquests,
            modifiedBy
        })
        return response
    }
}

export default planAdminAPI
