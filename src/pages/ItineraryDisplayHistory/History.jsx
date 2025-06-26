import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { travelFormAPI } from '@/apis'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { useAuth } from '@/AuthContext' // Import useAuth

function History() {
    const navigate = useNavigate()
    const { isLoggedIn } = useAuth() // Lấy isLoggedIn từ AuthContext
    const [histories, setHistories] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6

    // Kiểm tra trạng thái đăng nhập
    useEffect(() => {
        if (!isLoggedIn) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Vui lòng đăng nhập để xem lịch sử lịch trình.',
                confirmButtonColor: '#2563eb'
            })
            navigate('/')
        }
    }, [isLoggedIn, navigate])

    useEffect(() => {
        const fetchHistory = async () => {
            const accessToken = localStorage.getItem('accessToken')
            if (!accessToken) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Vui lòng đăng nhập để xem lịch sử lịch trình.',
                    confirmButtonColor: '#2563eb'
                })
                navigate('/signin')
                return
            }

            try {
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
                                BudgetVND:
                                    item.budgetVND || item.BudgetVND || 0,
                                CreatedAt:
                                    item.createdAt || item.CreatedAt || null
                            }
                        })
                        .filter((item) => item !== null)
                    setHistories(normalizedHistories)
                    if (normalizedHistories.length === 0) {
                        toast.error('Không tìm thấy lịch trình hợp lệ.')
                    }
                } else {
                    throw new Error('Dữ liệu lịch sử không hợp lệ.')
                }
            } catch (err) {
                const errorMessage =
                    err.response?.data?.error ||
                    err.message ||
                    'Không thể tải lịch sử lịch trình.'
                toast.error(errorMessage)
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
                        confirmButtonColor: '#2563eb'
                    })
                }
            } finally {
                setLoading(false)
            }
        }

        if (isLoggedIn) {
            fetchHistory()
        }
    }, [isLoggedIn, navigate])

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

    // Pagination logic
    const totalPages = Math.ceil(histories.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentHistories = histories.slice(
        startIndex,
        startIndex + itemsPerPage
    )

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
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

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-extrabold text-indigo-700 inline-block px-6 py-2 bg-indigo-50 rounded-full shadow-sm">
                            Lịch Sử Lịch Trình AI
                        </h2>
                    </div>
                    {histories.length > 0 ? (
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
                                                    className="px-3 py-1 border-2 border-indigo-600 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 hover:border-indigo-700 transition duration-200"
                                                    onClick={() => {
                                                        console.log(
                                                            'Navigating to History Detail with ID:',
                                                            history.Id
                                                        )
                                                        navigate(
                                                            `/HistoryItineraryDetail/${history.Id}`
                                                        )
                                                    }}
                                                    disabled={
                                                        !history.Id || loading
                                                    }
                                                >
                                                    Xem chi tiết
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
                                Bạn chưa tạo lịch trình nào. Hãy bắt đầu tạo một
                                lịch trình mới!
                            </p>
                            <button
                                onClick={() => navigate('/CreateItinerary')}
                                className="mt-4 inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
                            >
                                Tạo Lịch Trình Mới
                            </button>
                        </div>
                    )}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-8 space-x-2">
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
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default History
