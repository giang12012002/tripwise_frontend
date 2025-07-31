import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AddBlogDialog from './AddBlog/AddBlogDialog'
import { blogAPI } from '@/apis'
import { toast } from 'react-toastify'
import { formatDate } from '@/utils/format'
import { useLocation } from 'react-router-dom'
import { sortBlogsByLatest } from '@/utils/sort'

function Index() {
    const navigate = useNavigate()
    const location = useLocation()

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [blogs, setBlogs] = useState([])
    const [showAddBlogDialog, setShowAddBlogDialog] = useState(false)
    const [contextMenu, setContextMenu] = useState(null)
    const [selectedBlog, setSelectedBlog] = useState(null)

    const fetchBlogs = async () => {
        setLoading(true)
        try {
            const response = await blogAPI.fetchBlogs()
            if (response.status === 200 && response.data.data) {
                setBlogs(sortBlogsByLatest(response.data.data))
            } else {
                setError('Không thể lấy danh sách bài viết')
            }
        } catch (error) {
            setError('Không thể lấy danh sách bài viết')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBlogs()
    }, [])

    useEffect(() => {
        if (location.state?.refetch) {
            fetchBlogs()
        }
    }, [location.state])

    useEffect(() => {
        const handleClick = () => {
            setContextMenu(null)
        }
        window.addEventListener('click', handleClick)
        return () => {
            window.removeEventListener('click', handleClick)
        }
    }, [])

    const handleContextMenu = (e, blog) => {
        e.preventDefault()
        setSelectedBlog(blog)
        setContextMenu({
            x: e.pageX,
            y: e.pageY
        })
    }

    const handleView = () => {
        navigate(`/admin/blogs/${selectedBlog.blogID}`)
        setContextMenu(null)
    }

    const handleEdit = () => {
        navigate(`/admin/blogs/edit/${selectedBlog.blogID}`)
        setContextMenu(null)
    }

    const handleDelete = async () => {
        const confirm = window.confirm('Bạn có chắc muốn xóa bài viết này?')
        if (confirm) {
            try {
                const res = await blogAPI.deleteBlogById(selectedBlog.blogID)
                if (res.status === 200) {
                    setBlogs(
                        blogs.filter((b) => b.blogID !== selectedBlog.blogID)
                    )
                }
            } catch (err) {
                alert('Xóa thất bại')
            }
        }
        setContextMenu(null)
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 font-sans relative">
            <main className="flex-grow py-10">
                <h1 className="text-3xl font-bold text-center mb-8">
                    Danh sách các bài viết
                </h1>

                <div className="py-4 px-8 flex justify-end">
                    <button
                        onClick={() => setShowAddBlogDialog(true)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 hover:cursor-pointer active:scale-95 transition duration-200 ease-in-out"
                        title="Thêm blog"
                    >
                        Thêm
                    </button>
                </div>

                {loading ? (
                    <div className="text-center text-gray-500">
                        Đang tải danh sách bài viết...
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500">{error}</div>
                ) : blogs.length > 0 ? (
                    <ul className="space-y-4 px-8">
                        {blogs.map((blog) => (
                            <li
                                key={blog.blogID}
                                onContextMenu={(e) =>
                                    handleContextMenu(e, blog)
                                }
                                onClick={() =>
                                    navigate(`/admin/blogs/${blog.blogID}`)
                                }
                                className="bg-white p-4 rounded shadow hover:shadow-lg transition hover:scale-105 active:scale-95 duration-200 cursor-pointer"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <h2
                                        className="text-xl font-bold line-clamp-1 mb-2 max-w-[40%] text-gray-800"
                                        title={blog.blogName}
                                    >
                                        {blog.blogName}
                                    </h2>
                                    <p className="text-gray-400 text-sm font-light mb-2 max-w-[40%]">
                                        {formatDate(blog.createdDate)}
                                    </p>
                                </div>

                                <p className="text-gray-600 line-clamp-2">
                                    {blog.blogContent}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center text-gray-500">
                        Không có bài viết nào.
                    </div>
                )}
            </main>

            {contextMenu && (
                <ul
                    className="absolute bg-white border shadow-lg rounded-md z-50"
                    style={{
                        top: contextMenu.y,
                        left: contextMenu.x,
                        width: 160
                    }}
                >
                    <li
                        onClick={handleView}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                        🔍 Xem
                    </li>
                    <li
                        onClick={handleEdit}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                        ✏️ Sửa
                    </li>
                    <li
                        onClick={handleDelete}
                        className="px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer"
                    >
                        🗑️ Xóa
                    </li>
                </ul>
            )}

            <AddBlogDialog
                isOpen={showAddBlogDialog}
                onClose={() => setShowAddBlogDialog(false)}
            />
        </div>
    )
}

export default Index
