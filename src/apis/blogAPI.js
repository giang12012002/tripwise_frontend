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
        return response
    },
    createBlog: async ({ blogName, blogContent, images, imageLinks }) => {
        const formData = new FormData()
        formData.append('BlogName', blogName)
        formData.append('BlogContent', blogContent)
        images.forEach((file) => {
            formData.append('Images', file)
        })
        imageLinks.forEach((url) => {
            formData.append('ImageUrls', url)
        })

        const response = await authorizedAxios.post(
            '/api/Blog/CreateBlog',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
        return response
    },
    updateBlog: async (id, blogData) => {
        const response = await authorizedAxios.put(`/api/Blog/${id}`, blogData)
        return response
    },
    deleteBlog: async (id) => {
        const response = await authorizedAxios.delete(
            `/api/Blog/DeleteBlog/${id}`
        )
        return response
    }
}

export default blogAPI
