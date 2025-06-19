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
                // Lấy userId từ localStorage (được thiết lập khi đăng nhập trong SignIn.jsx)

                if (!userId) {
                    toast.error('Vui lòng đăng nhập để xem danh sách tour.')
                    navigate('/signin') // Chuyển hướng đến trang đăng nhập nếu chưa xác thực
                    return
                }

                // Gọi API để lấy danh sách tour theo userId
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
    }, [navigate])

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
            <div className="max-w-6xl w-full mx-auto p-8 bg-gradient-to-b from-blue-50 to-white rounded-2xl shadow-xl mt-8">
                <div className="flex items-center justify-center">
                    <svg
                        className="animate-spin h-8 w-8 text-blue-600 mr-3"
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
                    <span className="text-xl text-gray-700">Đang tải...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl w-full mx-auto p-8 bg-gradient-to-b from-blue-50 to-white rounded-2xl shadow-xl mt-8">
            <h2 className="text-3xl font-extrabold text-blue-900 tracking-tight mb-6">
                Danh sách tour của bạn
            </h2>
            {tours.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tours.map((tour) => (
                        <div
                            key={tour.tourId}
                            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <h3 className="text-xl font-semibold text-blue-800 mb-3">
                                {tour.tourName}
                            </h3>
                            <div className="space-y-2">
                                <p className="text-gray-700">
                                    <strong>Địa điểm:</strong>{' '}
                                    {tour.location || 'Không xác định'}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Loại tour:</strong>{' '}
                                    {tour.category || 'Không xác định'}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Giá:</strong>{' '}
                                    <span className="text-blue-600">
                                        {formatCurrency(tour.price)}
                                    </span>
                                </p>
                                <p className="text-gray-700">
                                    <strong>Ghi chú:</strong>{' '}
                                    {tour.tourNote || 'Không có ghi chú'}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Ngày tạo:</strong>{' '}
                                    {formatDate(tour.createdDate)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600">
                    Bạn chưa có tour nào. Hãy lưu một lịch trình để tạo tour!
                </p>
            )}
        </div>
    )
}

export default MyTours
