import authorizedAxios from './authorizedAxios'

const appSettingAPI = {
    fetchBlogs: async () => {
        const response = await authorizedAxios.get('/api/Blog/GetBlogs')
        return response
    }
}

export default appSettingAPI
