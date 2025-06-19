import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { travelFormAPI } from '@/apis'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/AuthContext'

function MyTours() {
    const { userId } = useAuth()
    const [tours, setTours] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchTours = async () => {
            try {
                if (!userId) {
                    toast.error('Vui lòng đăng nhập để xem danh sách tour.')
                    navigate('/signin')
                    return
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
            } finally {
                setLoading(false)
            }
        }

        fetchTours()
    }, [userId, navigate])

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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
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
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-indigo-700 inline-block px-6 py-2 bg-indigo-50 rounded-full shadow-sm">
                        Lịch Trình Yêu Thích Được Tạo Bằng AI
                    </h2>
                </div>
                {tours.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tours.map((tour) => (
                            <div
                                key={tour.tourId}
                                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-semibold text-gray-800 truncate">
                                            {tour.tourName || 'Tour Yêu Thích'}
                                        </h3>
                                        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                            Xem chi tiết
                                        </button>
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
                                                Loại tour:
                                            </span>
                                            <span>
                                                {tour.category || 'N/A'}
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
                                                {formatDate(tour.createdDate)}
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
                            Bạn chưa có tour nào. Hãy lưu một lịch trình để tạo
                            tour!
                        </p>
                        <button
                            onClick={() => navigate('/TravelForm')}
                            className="mt-4 inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
                        >
                            Tạo Tour Mới
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyTours
