import authorizedAxios from './authorizedAxios'

const logAPI = {
    check: async () => {
        const response = await authorizedAxios.get('/api/logs/Check')
        return response
    },
    get: async ({ page = 1, pageSize = 1000 } = {}) => {
        const response = await authorizedAxios.get('/api/logs/raw', {
            params: { page, pageSize }
        })
        return response
    },
    delete: async (id) => {
        const response = await authorizedAxios.delete(`/api/logs/${id}`)
        return response
    },
    clear: async () => {
        const response = await authorizedAxios.post('/api/logs/cleanup')
        return response
    }
}

export default logAPI
