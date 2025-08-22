// PartnerBookingDetail.jsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { bookingTourAPI } from '@/apis'
import { status } from '../bookingStatus'

function Index() {
    const location = useLocation()
    const navigate = useNavigate()
    const { bookingId } = useParams()
    const { tourId } = location.state
    const [booking, setBooking] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const getStatusConfig = (value) => {
        return (
            status.find((s) => s.value === value) || {
                background: 'bg-gray-100',
                text: 'text-gray-800',
                vietnamese: value
            }
        )
    }

    const stt = getStatusConfig(booking?.paymentStatus)

    const fetchBookingDetail = async () => {
        try {
            const response = await bookingTourAPI.getBookingDetail({
                bookingId
            })
            if (response.status === 200) {
                setBooking(response.data)
                console.log('Booking detail:', response.data)
            } else {
                setBooking(null)
            }
        } catch (error) {
            console.error(error)
            setBooking(null)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchBookingDetail()
    }, [bookingId])

    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) {
            return 'Chưa có'
        }
        return amount.toLocaleString('vi-VN') + ' đ'
    }
    const formatPriceLine = (numPeople, pricePerPerson) => {
        if (numPeople === null || numPeople === undefined) return 'Chưa có'
        if (numPeople === 0) return numPeople
        return `${numPeople} x ${formatCurrency(pricePerPerson)}`
    }

    // Hiển thị trạng thái tải
    if (isLoading) {
        return (
            <div className="text-center py-10">
                Đang tải chi tiết booking...
            </div>
        )
    }

    // Hiển thị trạng thái không tìm thấy booking
    if (!booking) {
        return (
            <div className="text-center py-10">
                Không tìm thấy thông tin booking.
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
            <main className="flex-grow py-10 max-w-4xl mx-auto w-full px-4">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate('/admin/bookings')}
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                        <svg
                            className="w-5 h-5 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            ></path>
                        </svg>
                        Quay lại
                    </button>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-xl">
                    <div className="flex justify-between items-start mb-6 border-b pb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Booking
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Mã đơn hàng:{' '}
                                <span className="font-semibold text-gray-700">
                                    {booking.orderCode || 'Chưa có'}
                                </span>
                            </p>
                        </div>
                        <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${stt.background} ${stt.text}`}
                        >
                            {stt.vietnamese}
                        </span>
                    </div>

                    {/* Thông tin Booking */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-700 mb-4">
                            Thông tin Booking
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-sm">
                                    Tên Tour
                                </span>
                                <div className="flex items-center gap-2">
                                    {' '}
                                    {/* Thêm div để căn chỉnh tên tour và nút */}
                                    <span className="text-gray-800 font-medium">
                                        {booking.tourName || 'Chưa có'}
                                    </span>
                                    {/* Nút xem chi tiết tour mới được thêm */}
                                    {tourId && (
                                        <Link
                                            to={`/partner/detailTour/${tourId}`}
                                            className="px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors duration-200"
                                        >
                                            Xem tour
                                        </Link>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-sm">
                                    Ngày khởi hành
                                </span>
                                <span className="text-gray-800 font-medium">
                                    {booking.startDate
                                        ? new Date(
                                              booking.startDate
                                          ).toLocaleDateString('vi-VN')
                                        : 'Chưa có'}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-sm">
                                    Ngày tạo
                                </span>
                                <span className="text-gray-800 font-medium">
                                    {booking.createdDate
                                        ? new Date(
                                              booking.createdDate
                                          ).toLocaleString('vi-VN')
                                        : 'Chưa có'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Thông tin Khách hàng */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-700 mb-4">
                            Thông tin Khách hàng
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-sm">
                                    Họ và tên
                                </span>
                                <span className="text-gray-800 font-medium">
                                    {booking.firstName || booking.lastName
                                        ? `${booking.firstName || ''} ${
                                              booking.lastName || ''
                                          }`.trim()
                                        : 'Chưa có'}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-sm">
                                    Email
                                </span>
                                <span className="text-gray-800 font-medium">
                                    {booking.userEmail || 'Chưa có'}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-sm">
                                    Số điện thoại
                                </span>
                                <span className="text-gray-800 font-medium">
                                    {booking.phoneNumber || 'Chưa có'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Chi tiết thanh toán */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-700 mb-4">
                            Chi tiết thanh toán
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-sm">
                                    Giá người lớn
                                </span>
                                <span className="text-gray-800 font-medium">
                                    {formatPriceLine(
                                        booking.numAdults,
                                        booking.priceAdult
                                    )}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-sm">
                                    Giá trẻ em (5-10 tuổi)
                                </span>
                                <span className="text-gray-800 font-medium">
                                    {formatPriceLine(
                                        booking.numChildren5To10,
                                        booking.priceChild5To10
                                    )}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-sm">
                                    Giá trẻ em (dưới 5 tuổi)
                                </span>
                                <span className="text-gray-800 font-medium">
                                    {formatPriceLine(
                                        booking.numChildrenUnder5,
                                        booking.priceChildUnder5
                                    )}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-sm">
                                    Tổng số tiền
                                </span>
                                <span className="text-green-600 font-bold text-lg">
                                    {formatCurrency(booking.amount)}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-sm">
                                    Mã ngân hàng
                                </span>
                                <span className="text-gray-800 font-medium">
                                    {booking.bankCode || 'Chưa có'}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-sm">
                                    Mã giao dịch
                                </span>
                                <span className="text-gray-800 font-medium">
                                    {booking.vnpTransactionNo || 'Chưa có'}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-sm">
                                    Thời gian thanh toán
                                </span>
                                <span className="text-gray-800 font-medium">
                                    {booking.paymentTime
                                        ? new Date(
                                              booking.paymentTime
                                          ).toLocaleString('vi-VN')
                                        : 'Chưa có'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Index
