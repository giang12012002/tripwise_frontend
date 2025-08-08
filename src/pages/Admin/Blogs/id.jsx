import { useParams, useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import blogAPI from '@/apis/blogAPI'
import DeletedConfirmDialog from './DeletedConfirmDialog'
import { toast } from 'react-toastify'

function Id() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    // TODO: thiếu phần lọc ngày theo created, modified
    const [blog, setBlog] = useState(null)

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
            console.log(response.data.data)
            if (response.status === 200 && response.data.data) {
                setBlog(response.data.data)
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
            <main className="flex-grow py-10 px-4">
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
                    <div className="flex justify-center items-center h-full">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-4">{error}</h2>
                            <button
                                onClick={() => navigate(-1)}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 hover:cursor-pointer active:scale-95 transition duration-200 ease-in-out"
                            >
                                Quay lại trang trước
                            </button>
                        </div>
                    </div>
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
