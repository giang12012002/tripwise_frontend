import authorizedAxios from './authorizedAxios'

const blogAPI = {
    fetchBlogs: async () => {
        const response = await authorizedAxios.get('/api/Blog/GetBlogs')
        return response
    },
    fetchBlogById: async (id) => {
        const response = await authorizedAxios.get(
            `/api/Blog/GetBlogById/${id}`
        )
        console.log('Response from fetchBlogById:', response)
        return response
    },
    createBlog: async (blogData) => {
        const response = await authorizedAxios.post('/api/Blog', blogData)
        return response
    },
    updateBlog: async (id, blogData) => {
        const response = await authorizedAxios.put(`/api/Blog/${id}`, blogData)
        return response
    },
    deleteBlog: async (id) => {
        const response = await authorizedAxios.delete(`/api/Blog/${id}`)
        return response
    }
}

export default blogAPI
