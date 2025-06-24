import { useParams, useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import blogAPI from '@/apis/blogAPI'
import DeletedConfirmDialog from './DeletedConfirmDialog'
import { toast } from 'react-toastify'
import { formatDate } from '@/utils/format'
import { splitToParagraphs } from '@/utils/text'

function Id() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    // TODO: thiếu phần lọc ngày theo created, modified
    const [blog, setBlog] = useState({
        id: null,
        blogName: '',
        blogParagraphs: [],
        blogImage: [],
        createdDate: '',
        createdBy: ''
    })

    const [showDialog, setShowDialog] = useState(false)

    const handleDelete = async () => {
        try {
            const response = await blogAPI.deleteBlog(id)
            if (response.status === 200) {
                toast.success(response.data.message)
                navigate('/admin/blogs', { state: { refetch: true } })
            } else {
                toast.error(response.data.message || 'Xóa bài viết thất bại!')
            }
        } catch (error) {
            toast.error(error.message || 'Xóa bài viết thất bại!')
        } finally {
            setShowDialog(false)
        }
    }

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
            console.error('Lỗi khi lấy bài viết:', error)
            setError('Không thể lấy bài viết')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!id) return
        fetchBlogById()
    }, [id])

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
            <div className="bg-white shadow-md py-4 px-6 flex justify-center items-center gap-6">
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 hover:cursor-pointer active:scale-95 transition duration-200 ease-in-out"
                    title="Quay lại trang trước"
                >
                    Quay lại
                </button>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 hover:cursor-pointer active:scale-95 transition duration-200 ease-in-out"
                    title="Chỉnh sửa blog này"
                >
                    Chỉnh sửa
                </button>
                <button
                    onClick={() => setShowDialog(true)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 hover:cursor-pointer active:scale-95 transition duration-200 ease-in-out"
                    title="Xóa blog này"
                >
                    Xóa
                </button>
            </div>
            <main className="flex-grow py-10 px-[20%]">
                {loading ? (
                    <p className="text-center text-gray-500">Đang tải...</p>
                ) : blog.id ? (
                    // Hiển thị nội dung blog
                    <>
                        <h1 className="text-3xl font-bold text-center">
                            {blog.blogName}
                        </h1>
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
            </main>

            <DeletedConfirmDialog
                isOpen={showDialog}
                onClose={() => setShowDialog(false)}
                onConfirm={handleDelete}
            />
        </div>
    )
}

export default Id
