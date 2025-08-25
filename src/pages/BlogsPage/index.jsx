import React, { useEffect, useState } from 'react'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import { useNavigate } from 'react-router-dom'
import blogAPI from '@/apis/blogAPI'
import { sortBlogsByLatest } from '@/utils/sort'
import { formatDate } from '@/utils/format'

function Index() {
    const [blogs, setBlogs] = useState([])
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchBlogs = async () => {
            const response = await blogAPI.fetchBlogs()
            if (response.status === 200 && response.data.data) {
                setBlogs(sortBlogsByLatest(response.data.data))
                console.log(response.data.data)
            } else {
                setError(response.data.message || 'Không thể tải bài viết')
            }
        }
        fetchBlogs()
    }, [])

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const blogsPerPage = 2 // số blog mỗi trang

    const totalPages = Math.ceil(blogs.length / blogsPerPage)
    const startIndex = (currentPage - 1) * blogsPerPage
    const currentBlogs = blogs.slice(startIndex, startIndex + blogsPerPage)

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
            <Header />
            <main className="flex-grow py-10">
                <h1 className="text-3xl font-bold text-center">
                    Danh sách các bài viết
                </h1>
                <p className="mt-4 text-gray-600 text-center">
                    Cập nhật thường xuyên các bài viết mới nhất về du lịch và
                    khám phá thế giới.
                </p>
                <div className="mt-8 max-w-4xl mx-auto px-4">
                    {blogs.length === 0 ? (
                        <p className="text-center text-gray-500">
                            Không có bài viết nào.
                        </p>
                    ) : (
                        <>
                            <ul className="space-y-6">
                                {currentBlogs.map((blog) => (
                                    <li
                                        key={blog.blogID}
                                        className="flex bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-200 cursor-pointer hover:ring-2 hover:ring-blue-400 active:scale-95 gap-6"
                                        onClick={() =>
                                            setTimeout(() => {
                                                navigate(
                                                    `/blogs/${blog.blogID}`
                                                )
                                            }, 100)
                                        }
                                    >
                                        <div className="w-3/10 max-w-[30%] aspect-[4/3] bg-gray-200 overflow-hidden rounded-md flex items-center justify-center">
                                            <img
                                                src={
                                                    blog.blogImages.length > 0
                                                        ? blog.blogImages[0]
                                                              .imageURL
                                                        : '/image.png'
                                                }
                                                alt={`Image for ${blog.blogName}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="w-7/10">
                                            <h2
                                                className="text-xl font-semibold line-clamp-2"
                                                title={blog.blogName}
                                            >
                                                {blog.blogName}
                                            </h2>
                                            <p className="mt-2 text-gray-600 line-clamp-3">
                                                {formatDate(blog.createdDate)}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* Pagination */}
                            <div className="flex justify-center mt-8 space-x-2">
                                <button
                                    onClick={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 hover:cursor-pointer"
                                >
                                    Trước
                                </button>

                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`px-4 py-2 rounded hover:cursor-pointer ${
                                            currentPage === i + 1
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-200 hover:bg-gray-300'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 hover:cursor-pointer"
                                >
                                    Tiếp
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default Index
