import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import appSettingAPI from '@/apis/appSettingAPI.js'
import HotNewsDialog from '@/pages/Admin/HotNews/HotNewsDialog.jsx'

const AdminHotNewsList = () => {
    const [hotNews, setHotNews] = useState([])
    const [loading, setLoading] = useState(true)
    const [showHotNewsDialog, setShowHotNewsDialog] = useState(false)
    const [editingNews, setEditingNews] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6

    const fetchHotNews = async () => {
        try {
            const response = await appSettingAPI.fetchAllHotNews()
            setHotNews(response.data)
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Lỗi khi tải danh sách tin tức nổi bật.',
                showConfirmButton: true,
                confirmButtonText: 'Đóng',
                confirmButtonColor: '#2563eb'
            })
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Xác nhận',
            text: 'Bạn có chắc muốn xóa tin tức này?',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
            confirmButtonColor: '#2563eb'
        })

        if (result.isConfirmed) {
            try {
                await appSettingAPI.deleteHotNews(id)
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Xóa tin tức thành công.',
                    showConfirmButton: true,
                    confirmButtonText: 'Đóng',
                    confirmButtonColor: '#2563eb'
                })
                fetchHotNews()
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Lỗi khi xóa tin tức.',
                    showConfirmButton: true,
                    confirmButtonText: 'Đóng',
                    confirmButtonColor: '#2563eb'
                })
                console.error(error)
            }
        }
    }

    const handleAddOrUpdate = async (data, newsId) => {
        try {
            if (newsId) {
                await appSettingAPI.updateHotNews(newsId, data)
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Cập nhật tin tức thành công.',
                    showConfirmButton: true,
                    confirmButtonText: 'Đóng',
                    confirmButtonColor: '#2563eb'
                })
            } else {
                await appSettingAPI.createHotNews(data)
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Tạo tin tức thành công.',
                    showConfirmButton: true,
                    confirmButtonText: 'Đóng',
                    confirmButtonColor: '#2563eb'
                })
            }
            fetchHotNews()
            setShowHotNewsDialog(false)
            setEditingNews(null)
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: newsId
                    ? 'Lỗi khi cập nhật tin tức.'
                    : 'Lỗi khi tạo tin tức.',
                showConfirmButton: true,
                confirmButtonText: 'Đóng',
                confirmButtonColor: '#2563eb'
            })
            console.error(error)
        }
    }

    useEffect(() => {
        fetchHotNews()
    }, [])

    // Pagination logic
    const totalPages = Math.ceil(hotNews.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentHotNews = hotNews.slice(startIndex, startIndex + itemsPerPage)

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    Danh sách tin tức nổi bật
                </h1>
                <button
                    onClick={() => {
                        setEditingNews(null)
                        setShowHotNewsDialog(true)
                    }}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1"
                >
                    Thêm tin tức
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
                </div>
            ) : (
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Hình ảnh
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    URL chuyển hướng
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Ngày tạo
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentHotNews.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-6 py-4 text-center text-gray-500 text-lg"
                                    >
                                        Không có tin tức nổi bật
                                    </td>
                                </tr>
                            ) : (
                                currentHotNews.map((news) => (
                                    <tr
                                        key={news.id}
                                        className="hover:bg-gray-50 transition duration-200"
                                    >
                                        <td className="px-6 py-4 text-gray-700">
                                            {news.id}
                                        </td>
                                        <td className="px-6 py-4">
                                            {news.imageUrl ? (
                                                <img
                                                    src={news.imageUrl}
                                                    alt="Hot News"
                                                    className="h-20 w-20 object-cover rounded-md shadow-sm"
                                                />
                                            ) : (
                                                <span className="text-gray-500">
                                                    Không có hình ảnh
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">
                                            {news.redirectUrl || 'Không có URL'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">
                                            {news.createdDate
                                                ? new Date(
                                                      news.createdDate
                                                  ).toLocaleDateString(
                                                      'vi-VN',
                                                      {
                                                          year: 'numeric',
                                                          month: '2-digit',
                                                          day: '2-digit'
                                                      }
                                                  )
                                                : 'Không có ngày'}
                                        </td>
                                        <td className="px-6 py-4 flex space-x-2">
                                            <button
                                                onClick={() => {
                                                    setEditingNews(news)
                                                    setShowHotNewsDialog(true)
                                                }}
                                                className="text-yellow-500 hover:text-yellow-600 transition duration-300 ease-in-out p-2 rounded-full hover:bg-yellow-100"
                                                title="Chỉnh sửa"
                                            >
                                                <svg
                                                    className="w-6 h-6"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(news.id)
                                                }
                                                className="text-red-500 hover:text-red-600 transition duration-300 ease-in-out p-2 rounded-full hover:bg-red-100"
                                                title="Xóa"
                                            >
                                                <svg
                                                    className="w-6 h-6"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && hotNews.length > 0 && (
                <div className="flex justify-center mt-8 space-x-2">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gradient-to-r from-gray-400 to-gray-600 text-white rounded-lg hover:from-gray-500 hover:to-gray-700 transition-all duration-300 shadow-md flex items-center disabled:opacity-50"
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        Trước
                    </button>
                    {Array.from(
                        { length: totalPages },
                        (_, index) => index + 1
                    ).map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                                currentPage === page
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg hover:from-blue-500 hover:to-blue-700 transition-all duration-300 shadow-md flex items-center disabled:opacity-50"
                    >
                        Sau
                        <svg
                            className="w-5 h-5 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </div>
            )}

            <HotNewsDialog
                isOpen={showHotNewsDialog}
                onClose={() => {
                    setShowHotNewsDialog(false)
                    setEditingNews(null)
                }}
                onConfirm={handleAddOrUpdate}
                news={editingNews}
            />
        </div>
    )
}

export default AdminHotNewsList
