import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { travelFormAPI } from '@/apis'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import Swal from 'sweetalert2'
import { useAuth } from '@/AuthContext'

function History() {
    const navigate = useNavigate()
    const { isLoggedIn, isAuthLoading } = useAuth()
    const [histories, setHistories] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedMonth, setSelectedMonth] = useState('')
    const [selectedYear, setSelectedYear] = useState('')
    const itemsPerPage = 6

    // Kiểm tra trạng thái đăng nhập
    useEffect(() => {
        if (!isAuthLoading && !isLoggedIn) {
            Swal.fire({
                icon: 'success',
                text: 'Đăng xuất thành công!',
                showConfirmButton: false,
                timer: 1800
            })
            navigate('/')
        }
    }, [isLoggedIn, isAuthLoading, navigate])

    // Hàm lấy lịch sử
    const fetchHistory = async () => {
        const accessToken = localStorage.getItem('accessToken')
        if (!accessToken) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Vui lòng đăng nhập để xem lịch sử  trình.',
                showConfirmButton: false,
                timer: 1500
            })
            navigate('/signin')
            return
        }

        try {
            setLoading(true)
            const response = await travelFormAPI.getHistory()

            if (response.status === 200 && Array.isArray(response.data)) {
                const normalizedHistories = response.data
                    .map((item) => {
                        const id = item.id || item.Id || item._id
                        if (!id) {
                            console.warn('History item missing ID:', item)
                            return null
                        }
                        return {
                            Id: id,
                            Destination:
                                item.destination ||
                                item.Destination ||
                                'Chưa xác định',
                            TravelDate:
                                item.travelDate || item.TravelDate || null,
                            Days: item.days || item.Days || null,
                            Preferences:
                                item.preferences || item.Preferences || '',
                            BudgetVND: item.budgetVND || item.BudgetVND || 0,
                            CreatedAt: item.createdAt || item.CreatedAt || null
                        }
                    })
                    .filter((item) => item !== null)
                    .sort((a, b) => {
                        const dateA = a.CreatedAt
                            ? new Date(a.CreatedAt)
                            : new Date(0)
                        const dateB = b.CreatedAt
                            ? new Date(b.CreatedAt)
                            : new Date(0)
                        return dateB - dateA
                    })
                setHistories(normalizedHistories)
                if (normalizedHistories.length === 0) {
                    Swal.fire({
                        icon: 'info',
                        title: 'Thông báo',
                        text: 'Không tìm thấy hành trình hợp lệ.',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            } else {
                throw new Error('Dữ liệu lịch sử không hợp lệ.')
            }
        } catch (err) {
            const errorMessage =
                err.response?.data?.error ||
                err.message ||
                'Không thể tải hành trình.'
            console.error('Error in fetchHistory:', {
                errorMessage,
                status: err.response?.status,
                responseData: err.response?.data
            })
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: errorMessage,
                showConfirmButton: false,
                timer: 2000
            })
            if (
                err.response?.status === 401 ||
                err.response?.data?.error?.includes('token')
            ) {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('userId')
                navigate('/signin')
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isLoggedIn) {
            fetchHistory()
        }
    }, [isLoggedIn, navigate])

    // Hàm xóa lịch trình
    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Xác nhận xóa',
            text: 'Bạn có chắc muốn xóa  trình này? Hành động này không thể hoàn tác.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setLoading(true)

                    const response =
                        await travelFormAPI.deleteGenerateTravelPlans(id)

                    if (response.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            text: 'Xóa hành  thành công!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        await fetchHistory() // Refresh the history list
                        if (currentHistories.length === 1 && currentPage > 1) {
                            setCurrentPage(currentPage - 1)
                        }
                    }
                } catch (err) {
                    const errorMessage =
                        err.response?.status === 404
                            ? 'hành trình không tồn tại hoặc bạn không có quyền xóa. Vui lòng làm mới danh sách hoặc liên hệ hỗ trợ.'
                            : err.response?.data?.message ||
                              err.response?.data?.error ||
                              'Không thể xóa hành trình. Vui lòng kiểm tra lại hoặc liên hệ hỗ trợ.'
                    console.error('Error in handleDelete:', {
                        id: id,
                        errorMessage,
                        status: err.response?.status,
                        responseData: err.response?.data || 'No response data'
                    })
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: errorMessage,
                        showConfirmButton: false,
                        timer: 2000
                    })
                    if (
                        err.response?.status === 401 ||
                        err.response?.data?.error?.includes('token') ||
                        err.response?.data?.message?.includes('token')
                    ) {
                        localStorage.removeItem('accessToken')
                        localStorage.removeItem('userId')
                        navigate('/signin')
                        Swal.fire({
                            icon: 'error',
                            title: 'Lỗi',
                            text: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                } finally {
                    setLoading(false)
                }
            }
        })
    }

    const formatCurrency = (value) => {
        if (value == null || isNaN(value)) return '0 VND'
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value)
    }

    const formatDate = (date) => {
        if (!date) return 'Chưa xác định'
        try {
            return new Date(date).toLocaleDateString('vi-VN')
        } catch {
            return 'Chưa xác định'
        }
    }

    const formatPreferences = (preferences) => {
        if (
            !preferences ||
            typeof preferences !== 'string' ||
            preferences.trim() === ''
        ) {
            return <span className="text-gray-600">Chưa xác định</span>
        }
        const prefs = preferences.split(', ').filter((pref) => pref.trim())
        if (prefs.length === 0)
            return <span className="text-gray-600">Chưa xác định</span>
        return prefs.map((pref, index) => (
            <span
                key={`${pref}-${index}`}
                className="inline-block bg-indigo-100 text-indigo-800 text-sm px-2 py-1 rounded-full mr-2"
            >
                {pref}
            </span>
        ))
    }

    // Filter histories based on search term, month, and year
    const filteredHistories = histories.filter((history) => {
        const matchesSearch =
            history.Destination?.toLowerCase().includes(
                searchTerm.toLowerCase()
            ) || false
        const historyDate = history.CreatedAt
            ? new Date(history.CreatedAt)
            : null
        const monthMatch = selectedMonth
            ? historyDate &&
              historyDate.getMonth() + 1 === parseInt(selectedMonth)
            : true
        const yearMatch = selectedYear
            ? historyDate &&
              historyDate.getFullYear() === parseInt(selectedYear)
            : true
        return matchesSearch && monthMatch && yearMatch
    })

    // Pagination logic
    const totalPages = Math.ceil(filteredHistories.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentHistories = filteredHistories.slice(
        startIndex,
        startIndex + itemsPerPage
    )

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
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-grow flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                    <div className="flex items-center space-x-3 p-6 bg-white rounded-xl shadow-lg">
                        <svg
                            className="animate-spin h-8 w-8 text-indigo-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        <span className="text-lg font-medium text-gray-700">
                            Đang tải...
                        </span>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-grow flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                    <div className="flex items-center space-x-3 p-6 bg-white rounded-xl shadow-lg">
                        <svg
                            className="animate-spin h-8 w-8 text-indigo-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        <span className="text-lg font-medium text-gray-700">
                            Đang tải...
                        </span>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-extrabold text-indigo-700 inline-block px-6 py-2 bg-indigo-50 rounded-full shadow-sm">
                            Lịch Sử Hành Trình AI
                        </h2>
                    </div>
                    <div className="mb-5 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo địa điểm..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value)
                                    setCurrentPage(1)
                                }}
                                className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <svg
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                        <select
                            value={selectedMonth}
                            onChange={(e) => {
                                setSelectedMonth(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Chọn tháng</option>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(
                                (month) => (
                                    <option key={month} value={month}>
                                        Tháng {month}
                                    </option>
                                )
                            )}
                        </select>
                        <select
                            value={selectedYear}
                            onChange={(e) => {
                                setSelectedYear(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Chọn năm</option>
                            {Array.from(
                                { length: 10 },
                                (_, i) => new Date().getFullYear() - 5 + i
                            ).map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                    {filteredHistories.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {currentHistories.map((history, index) => (
                                <div
                                    key={history.Id}
                                    className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-lg font-bold text-indigo-600">
                                                    {startIndex + index + 1}.
                                                </span>
                                                <h3 className="text-xl font-semibold text-gray-800 truncate">
                                                    Địa điểm:{' '}
                                                    {history.Destination}
                                                </h3>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 flex items-center space-x-1"
                                                    onClick={() => {
                                                        navigate(
                                                            `/user/HistoryItineraryDetail/${history.Id}`
                                                        )
                                                    }}
                                                    disabled={
                                                        !history.Id || loading
                                                    }
                                                >
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M15 12c0-1.5-1.5-3-3-3s-3 1.5-3 3 1.5 3 3 3 3-1.5 3-3zm6 0c0 4.5-4.5 9-9 9s-9-4.5-9-9 4.5-9 9-9 9 4.5 9 9z"
                                                        />
                                                    </svg>
                                                    <span>Xem chi tiết</span>
                                                </button>
                                                <button
                                                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 flex items-center space-x-1"
                                                    onClick={() =>
                                                        handleDelete(history.Id)
                                                    }
                                                    disabled={
                                                        !history.Id || loading
                                                    }
                                                >
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0h4m-7 4h12"
                                                        />
                                                    </svg>
                                                    {/*<span>Xóa</span>*/}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-3 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <span className="font-medium w-24">
                                                    Ngày đi:
                                                </span>
                                                <span>
                                                    {formatDate(
                                                        history.TravelDate
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="font-medium w-24">
                                                    Số ngày:
                                                </span>
                                                <span>
                                                    {history.Days ||
                                                        'Chưa xác định'}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="font-medium w-24">
                                                    Sở thích:
                                                </span>
                                                <span>
                                                    {formatPreferences(
                                                        history.Preferences
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="font-medium w-24">
                                                    Ngân sách:
                                                </span>
                                                <span className="text-indigo-600 font-semibold">
                                                    {formatCurrency(
                                                        history.BudgetVND
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="font-medium w-24">
                                                    Ngày tạo:
                                                </span>
                                                <span>
                                                    {formatDate(
                                                        history.CreatedAt
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
                            <p className="text-lg text-gray-600">
                                {searchTerm || selectedMonth || selectedYear
                                    ? 'Không tìm thấy hành trình phù hợp với bộ lọc.'
                                    : 'Bạn chưa tạo hành trình nào. Hãy bắt đầu tạo một  trình mới!'}
                            </p>
                            <button
                                onClick={() =>
                                    navigate('/user/CreateItinerary')
                                }
                                className="mt-4 inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
                            >
                                Tạo Hành Trình Mới
                            </button>
                        </div>
                    )}
                    {totalPages > 1 && (
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
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default History
