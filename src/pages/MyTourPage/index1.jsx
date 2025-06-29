import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { travelFormAPI } from '@/apis'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/AuthContext'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'

function MyTours() {
    const { userId, isLoggedIn } = useAuth()
    const [tours, setTours] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedMonth, setSelectedMonth] = useState('')
    const [selectedYear, setSelectedYear] = useState('')
    const toursPerPage = 6
    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoggedIn) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Vui lòng đăng nhập để xem danh sách tour.',
                showConfirmButton: false,
                timer: 1500
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
                    const sortedTours = response.data.data.sort((a, b) => {
                        const dateA = a.createdDate
                            ? new Date(a.createdDate)
                            : new Date(0)
                        const dateB = b.createdDate
                            ? new Date(b.createdDate)
                            : new Date(0)
                        return dateB - dateA
                    })
                    setTours(sortedTours)
                } else {
                    throw new Error(
                        response.data.message || 'Không thể lấy danh sách tour.'
                    )
                }
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: err.message || 'Lỗi khi lấy danh sách tour.',
                    showConfirmButton: false,
                    timer: 1500
                })
                if (err.response?.status === 401) {
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
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Xóa tour thành công!',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else {
                throw new Error(response.data.message || 'Không thể xóa tour.')
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: err.message || 'Lỗi khi xóa tour.',
                showConfirmButton: false,
                timer: 1500
            })
            if (err.response?.status === 401) {
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

    // Filter tours based on search term, month, and year
    const filteredTours = tours.filter((tour) => {
        const matchesSearch =
            tour.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            false
        const tourDate = tour.createdDate ? new Date(tour.createdDate) : null
        const monthMatch = selectedMonth
            ? tourDate && tourDate.getMonth() + 1 === parseInt(selectedMonth)
            : true
        const yearMatch = selectedYear
            ? tourDate && tourDate.getFullYear() === parseInt(selectedYear)
            : true
        return matchesSearch && monthMatch && yearMatch
    })

    // Pagination logic
    const totalPages = Math.ceil(filteredTours.length / toursPerPage)
    const indexOfLastTour = currentPage * toursPerPage
    const indexOfFirstTour = indexOfLastTour - toursPerPage
    const currentTours = filteredTours.slice(indexOfFirstTour, indexOfLastTour)

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
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
                    <div className="mb-5 flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo địa điểm..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="flex-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
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
                    {filteredTours.length > 0 ? (
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
                                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 flex items-center space-x-1"
                                                    onClick={() =>
                                                        navigate(
                                                            `/TourDetail/${tour.tourId}`
                                                        )
                                                    }
                                                    disabled={loading}
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
                                                        handleDelete(
                                                            tour.tourId
                                                        )
                                                    }
                                                    disabled={loading}
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
                                                    <span>Xóa</span>
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
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
                            <p className="text-lg text-gray-600">
                                {searchTerm || selectedMonth || selectedYear
                                    ? 'Không tìm thấy tour phù hợp với bộ lọc.'
                                    : 'Bạn chưa có tour nào. Hãy lưu một lịch trình để tạo tour!'}
                            </p>
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

export default MyTours
