import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { travelFormAPI } from '@/apis'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/AuthContext'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import Swal from 'sweetalert2'

function MyTours() {
    const { userId, isLoggedIn } = useAuth() // Lấy isLoggedIn và userId
    const [tours, setTours] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const toursPerPage = 6
    const navigate = useNavigate()

    // Kiểm tra trạng thái đăng nhập
    useEffect(() => {
        if (!isLoggedIn) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Vui lòng đăng nhập để xem danh sách tour.',
                confirmButtonColor: '#2563eb'
            })
            navigate('/')
        }
    }, [isLoggedIn, navigate])

    useEffect(() => {
        const fetchTours = async () => {
            try {
                if (!userId) {
                    throw new Error('Vui lòng đăng nhập để xem danh sách tour.')
                }

                const response = await travelFormAPI.getToursByUserId(userId)
                if (
                    response.status === 200 &&
                    response.data.message.includes('thành công')
                ) {
                    setTours(response.data.data)
                } else {
                    throw new Error(
                        response.data.message || 'Không thể lấy danh sách tour.'
                    )
                }
            } catch (err) {
                toast.error(err.message || 'Lỗi khi lấy danh sách tour.')
                if (err.response?.status === 401) {
                    localStorage.removeItem('accessToken')
                    localStorage.removeItem('userId')
                    navigate('/signin')
                    toast.error(
                        'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'
                    )
                }
            } finally {
                setLoading(false)
            }
        }

        if (isLoggedIn && userId) {
            fetchTours()
        }
    }, [isLoggedIn, userId, navigate])
    const formatCurrency = (value) => {
        if (!value || isNaN(value)) return 'Không xác định'
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value)
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Không xác định'
        return new Date(dateString).toLocaleDateString('vi-VN')
    }

    const formatPreferences = (category) => {
        if (
            !category ||
            typeof category !== 'string' ||
            category.trim() === ''
        ) {
            return <span className="text-gray-600">Không xác định</span>
        }
        const prefs = category.split(', ').filter((pref) => pref.trim())
        if (prefs.length === 0)
            return <span className="text-gray-600">Không xác định</span>
        return prefs.map((pref, index) => (
            <span
                key={`${pref}-${index}`}
                className="inline-block bg-indigo-100 text-indigo-800 text-sm px-2 py-1 rounded-full mr-2"
            >
                {pref}
            </span>
        ))
    }

    const handleDelete = async (tourId) => {
        const result = await Swal.fire({
            title: 'Xác nhận xóa tour',
            text: 'Bạn có chắc muốn xóa tour này? Hành động này không thể hoàn tác.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#2563eb',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        })

        if (!result.isConfirmed) return

        try {
            setLoading(true)
            const response = await travelFormAPI.deleteTour(tourId)
            if (response.status === 200 && response.data.success) {
                setTours(tours.filter((tour) => tour.tourId !== tourId))
                toast.success('Xóa tour thành công!')
            } else {
                throw new Error(response.data.message || 'Không thể xóa tour.')
            }
        } catch (err) {
            toast.error(err.message || 'Lỗi khi xóa tour.')
            if (err.response?.status === 401) {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('userId')
                navigate('/signin')
                toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.')
            }
        } finally {
            setLoading(false)
        }
    }

    // Pagination logic
    const totalPages = Math.ceil(tours.length / toursPerPage)
    const indexOfLastTour = currentPage * toursPerPage
    const indexOfFirstTour = indexOfLastTour - toursPerPage
    const currentTours = tours.slice(indexOfFirstTour, indexOfLastTour)

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
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
                            Tour Yêu Thích Được Tạo Bằng AI
                        </h2>
                    </div>
                    {tours.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {currentTours.map((tour, index) => (
                                <div
                                    key={tour.tourId}
                                    className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-lg font-bold text-indigo-600">
                                                    {indexOfFirstTour +
                                                        index +
                                                        1}
                                                    .
                                                </span>
                                                <h3 className="text-xl font-semibold text-gray-800 truncate">
                                                    {tour.tourName ||
                                                        'Tour Yêu Thích'}
                                                </h3>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    className="px-1 py-1 border-2 border-indigo-600 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 hover:border-indigo-700 transition duration-200"
                                                    onClick={() =>
                                                        navigate(
                                                            `/TourDetail/${tour.tourId}`
                                                        )
                                                    }
                                                    disabled={loading}
                                                >
                                                    Xem chi tiết
                                                </button>
                                                <button
                                                    className="px-2 py-2 border-2 border-red-600 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 hover:border-red-700 transition duration-200"
                                                    onClick={() =>
                                                        handleDelete(
                                                            tour.tourId
                                                        )
                                                    }
                                                    disabled={loading}
                                                >
                                                    X
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-3 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <span className="font-medium w-24">
                                                    Địa điểm:
                                                </span>
                                                <span>
                                                    {tour.location || 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="font-medium w-24">
                                                    Sở thích:
                                                </span>
                                                <span>
                                                    {formatPreferences(
                                                        tour.category
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="font-medium w-24">
                                                    Giá:
                                                </span>
                                                <span className="text-indigo-600 font-semibold">
                                                    {formatCurrency(tour.price)}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="font-medium w-24">
                                                    Ngày tạo:
                                                </span>
                                                <span>
                                                    {formatDate(
                                                        tour.createdDate
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-indigo-50 px-6 py-3">
                                        <button className="w-full text-center text-indigo-700 font-medium hover:text-indigo-900 transition">
                                            Chỉnh sửa tour
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
                            <p className="text-lg text-gray-600">
                                Bạn chưa có tour nào. Hãy lưu một lịch trình để
                                tạo tour!
                            </p>
                        </div>
                    )}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-8 space-x-2">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                                        currentPage === index + 1
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50'
                                    }`}
                                >
                                    {index + 1}
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

export default MyTours
