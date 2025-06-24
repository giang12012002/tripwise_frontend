import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import { useParams, useNavigate } from 'react-router-dom'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import blogAPI from '@/apis/blogAPI'
import { formatDate } from '@/utils/format'
import { sortBlogsByLatest } from '@/utils/sort'
import { splitToParagraphs } from '@/utils/text'

function Id() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [blogs, setBlogs] = useState([])
    const [blog, setBlog] = useState({
        id: null,
        blogName: '',
        blogParagraphs: [],
        blogImage: [],
        createdDate: '',
        createdBy: ''
    })

    useEffect(() => {
        const fetchBlogs = async () => {
            const response = await blogAPI.fetchBlogs()
            if (response.status === 200 && response.data.data) {
                setBlogs(sortBlogsByLatest(response.data.data).slice(0, 3))
            }
        }
        fetchBlogs()
    }, [])

    useEffect(() => {
        if (!id) return
        const fetchBlogById = async () => {
            setLoading(true)
            try {
                const response = await blogAPI.fetchBlogById(id)
                if (response.status === 200 && response.data.data) {
                    const blogData = response.data.data
                    setBlog({
                        id: blogData.blogID,
                        blogName: blogData.blogName,
                        blogParagraphs: splitToParagraphs(blogData.blogContent),
                        blogImage: blogData.blogImages,
                        createdDate: blogData.createdDate,
                        createdBy: blogData.createdBy
                    })
                } else {
                    setError(response.data.message || 'Không tìm thấy bài viết')
                }
            } catch (error) {
                setError('Không thể lấy bài viết')
            } finally {
                setLoading(false)
            }
        }
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
                ) : blog.id ? (
                    // Hiển thị nội dung blog
                    <>
                        <h1 className="text-3xl font-bold text-center">
                            {blog.blogName}
                        </h1>
                        {/* TODO: Thiếu phần cập nhật thông tin của người cập nhật */}
                        <p className="mt-4 text-gray-600 text-right">
                            Được đăng ngày{' '}
                            <span className="text-red-500">
                                {formatDate(blog.createdDate) || '01/01/2025'}
                            </span>{' '}
                            bởi{' '}
                            <span className="font-bold text-blue-500">
                                {blog.createdBy || 'admin'}
                            </span>
                        </p>
                        <div className="space-y-6 py-6">
                            <p className="text-gray-700 text-justify">
                                {blog.blogParagraphs[0]}
                            </p>

                            {blog.blogParagraphs
                                .slice(1, blog.blogParagraphs.length - 1)
                                .map((paragraph, index) => {
                                    const paragraphImage = blog.blogImage[index]
                                    return (
                                        <div key={index}>
                                            {paragraphImage && (
                                                <div className="flex flex-col items-center">
                                                    <img
                                                        src={
                                                            paragraphImage.imageURL ||
                                                            '/image.png'
                                                        }
                                                        alt={
                                                            paragraphImage.alt ||
                                                            'Ảnh bài viết'
                                                        }
                                                        className="my-4 rounded w-full max-w-[80%] object-cover"
                                                    />
                                                    <p className="text-gray-600 italic text-sm text-center">
                                                        {paragraphImage.alt ||
                                                            `Ảnh bài viết ${index + 1}`}
                                                    </p>
                                                </div>
                                            )}

                                            <p
                                                key={index}
                                                className="text-gray-700 text-justify"
                                            >
                                                {paragraph}
                                            </p>
                                        </div>
                                    )
                                })}

                            {blog.blogImage
                                .slice(
                                    blog.blogParagraphs.length - 2,
                                    blog.blogImage.length
                                )
                                .map((img, idx) => (
                                    <div
                                        key={`extra-${idx}`}
                                        className="flex flex-col items-center"
                                    >
                                        <img
                                            src={img.imageURL || '/image.png'}
                                            alt={img.alt || 'Ảnh bài viết'}
                                            className="my-4 rounded w-full max-w-[80%] object-cover"
                                        />
                                        <p className="text-gray-600 italic text-sm text-center">
                                            {img.alt}
                                        </p>
                                    </div>
                                ))}

                            {blog.blogParagraphs.length !== 1 && (
                                <p className="text-gray-700 text-justify">
                                    {
                                        blog.blogParagraphs[
                                            blog.blogParagraphs.length - 1
                                        ]
                                    }
                                </p>
                            )}

                            {/* Phần ký tên cuối bài */}
                            <p className="text-right mt-8 text-gray-700 italic">
                                — {blog.createdBy || 'admin'},{' '}
                            </p>
                        </div>
                    </>
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
