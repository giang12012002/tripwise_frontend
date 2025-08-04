import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import { useParams, useNavigate } from 'react-router-dom'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import blogAPI from '@/apis/blogAPI'
import { formatDate } from '@/utils/format'
import { sortBlogsByLatest } from '@/utils/sort'
import { splitTextByType } from '@/utils/text'

// TODO: cần chuyển thành 1 page editor
function Id() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [blogs, setBlogs] = useState([])
    const [blog, setBlog] = useState(null)

    const fetchBlogs = async () => {
        const response = await blogAPI.fetchBlogs()
        if (response.status === 200 && response.data.data) {
            setBlogs(sortBlogsByLatest(response.data.data).slice(0, 3))
        }
    }

    useEffect(() => {
        fetchBlogs()
    }, [])

    const fetchBlogById = async () => {
        setLoading(true)
        try {
            const response = await blogAPI.fetchBlogById(id)
            if (response.status === 200 && response.data.data) {
                setBlog(response.data.data)
                console.log(response.data.data)
            } else {
                setError(response.data.message || 'Không tìm thấy bài viết')
            }
        } catch (error) {
            setError('Không thể lấy bài viết')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!id) return
        fetchBlogById()
    }, [id])

    useLayoutEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
            <Header />
            <main className="flex-grow py-10 px-[20%]">
                {loading ? (
                    <p className="text-center text-gray-500">Đang tải...</p>
                ) : blog.blogContent ? (
                    // Hiển thị nội dung blog
                    <div
                        className="flex-1 overflow-y-auto"
                        dangerouslySetInnerHTML={{
                            __html: blog.blogContent
                        }}
                    />
                ) : (
                    // Hiển thị thông báo không tìm thấy bài viết
                    <>
                        <div className="flex justify-center items-center h-full">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-4">
                                    {error}
                                </h2>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 hover:cursor-pointer active:scale-95 transition duration-200 ease-in-out"
                                >
                                    Quay lại trang trước
                                </button>
                            </div>
                        </div>
                    </>
                )}
                {/* TODO: Khi render lại components, thì không cuộn lại lên đầu trang */}
                <div className="mt-10 flex">
                    <section className="py-12 max-w-7xl w-full mx-auto">
                        <div className="container mx-auto px-4">
                            <h2 className="text-2xl font-bold text-center mb-8">
                                CÁC BÀI VIẾT KHÁC
                            </h2>
                            <p className="text-center max-w-xl mx-auto mb-6 hidden">
                                TripeWise là nền tảng trực tuyến tiên phong
                                trong việc sử dụng trí tuệ nhân tạo (AI) để tạo
                                ra lịch trình du lịch cá nhân hóa.
                            </p>

                            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
                                {blogs.map((blog) => (
                                    <div
                                        key={blog.id}
                                        className="max-w-sm bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
                                        onClick={() =>
                                            navigate(`/blogs/${blog.blogID}`)
                                        }
                                        title={blog.blogName}
                                    >
                                        <img
                                            src={
                                                blog.blogImages[0].imageURL ||
                                                '/image.png'
                                            }
                                            alt={`Ảnh của ${blog.blogName}`}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <h3
                                                    className="text-xl font-bold line-clamp-1 mb-2 max-w-[40%] text-gray-800"
                                                    title={blog.blogName}
                                                >
                                                    {blog.blogName}
                                                </h3>
                                                <p className="text-gray-400 text-sm font-light mb-2 max-w-[40%]">
                                                    {formatDate(blog.createdAt)}
                                                </p>
                                            </div>
                                            <p className="text-gray-600 text-sm line-clamp-4 mb-4">
                                                {blog.blogContent}
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
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default Id
