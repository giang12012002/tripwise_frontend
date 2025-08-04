import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { blogAPI } from '@/apis'
import { formatDate } from '@/utils/format'
import { sortBlogsByLatest } from '@/utils/sort'

function BlogsSection() {
    const navigate = useNavigate()
    const [blogs, setBlogs] = useState([])

    const fetchBlogs = async () => {
        const response = await blogAPI.fetchBlogs()
        if (response.status === 200 && response.data.data) {
            setBlogs(sortBlogsByLatest(response.data.data).slice(0, 3))
            console.log(response.data.data)
        }
    }

    useEffect(() => {
        fetchBlogs()
    }, [])

    return (
        <section className="py-12 max-w-7xl w-full mx-auto">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-center mb-8">
                    CÁC BÀI VIẾT MỚI NHẤT
                </h2>
                <p className="text-center max-w-xl mx-auto mb-6 hidden">
                    TripeWise là nền tảng trực tuyến tiên phong trong việc sử
                    dụng trí tuệ nhân tạo (AI) để tạo ra lịch trình du lịch cá
                    nhân hóa.
                </p>

                <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
                    {blogs.map((blog) => (
                        <div
                            key={blog.blogID}
                            className="max-w-sm bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 hover:scale-105 cursor-pointer"
                            onClick={() => navigate(`/blogs/${blog.blogID}`)}
                            title={blog.blogName}
                        >
                            <img
                                src={
                                    blog.blogImages > 0
                                        ? blog.blogImages[0].imageURL
                                        : '/image.png'
                                }
                                alt={
                                    blog.blogImages[0].imageAlt ||
                                    `Image for ${blog.blogName}`
                                }
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h3
                                        className="text-xl font-bold line-clamp-1 mb-2 w-full text-gray-800"
                                        title={blog.blogName}
                                    >
                                        {blog.blogName}
                                    </h3>
                                    <p className="text-gray-400 text-sm font-light mb-2 max-w-[40%]"></p>
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-4 mb-4">
                                    {formatDate(blog.createdDate)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-6">
                    <a
                        href="/blogs"
                        className="text-blue-600 font-semibold transition duration-200 ease-in-out hover:text-blue-800 active:scale-95"
                    >
                        Xem thêm
                    </a>
                </div>
            </div>
        </section>
    )
}

export default BlogsSection
