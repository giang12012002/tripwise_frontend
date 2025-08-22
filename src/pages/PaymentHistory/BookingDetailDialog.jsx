import React, { useEffect, useState } from 'react'
import LoadingSpinner from '@/components/states/LoadingSpinner'
import { Link } from 'react-router-dom'

import { bookingStatus, paymentStatus } from './status'

const getBookingStatusConfig = (value) => {
    return (
        bookingStatus.find((s) => s.value === value) || {
            background: 'bg-gray-100',
            text: 'text-gray-800',
            vietnamese: value
        }
    )
}

const getPaymentStatusConfig = (value) => {
    return (
        paymentStatus.find((s) => s.value === value) || {
            background: 'bg-gray-100',
            text: 'text-gray-800',
            vietnamese: value
        }
    )
}

function BookingDetailDialog({ isOpen, onClose, payment }) {
    const [isVisible, setIsVisible] = useState(false)
    const [animationClass, setAnimationClass] = useState('fade-in')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true)
            setAnimationClass('fade-in')
        } else {
            setAnimationClass('fade-out')
            setTimeout(() => setIsVisible(false), 300)
        }
    }, [isOpen])

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

    const resetFields = () => {}

    const handleClose = () => {
        onClose()
        resetFields()
    }

    if (!isVisible) return null

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center z-50 bg-white/10 backdrop-blur-sm ${animationClass}`}
        >
            <div className="relative bg-white rounded-lg shadow-lg max-w-2xl w-[90%] transition-transform">
                {loading && (
                    <div className="absolute inset-0 z-20 bg-white/20 backdrop-blur-[0.5px] flex items-center justify-center rounded-lg">
                        <LoadingSpinner />
                    </div>
                )}

                <div
                    className={`${loading ? 'opacity-50 pointer-events-none select-none' : ''}`}
                >
                    <div className="">
                        <div className="max-h-[90vh] overflow-y-auto p-6">
                            <div className="bg-white p-8 rounded-2xl shadow-xl">
                                <div className="flex justify-between items-start mb-6 border-b pb-4">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-800">
                                            Booking
                                        </h1>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Mã đơn hàng:{' '}
                                            <span className="font-semibold text-gray-700">
                                                {payment?.orderCode ||
                                                    'Chưa có'}
                                            </span>
                                        </p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 font-semibold rounded-full text-sm ${
                                            payment?.paymentStatus === 'Success'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                    >
                                        {payment?.paymentStatus === 'Success'
                                            ? 'Đã thanh toán'
                                            : payment?.paymentStatus ||
                                              'Chưa có'}
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
                                                <span className="text-gray-800 font-medium">
                                                    {payment?.tourName ||
                                                        'Chưa có'}
                                                </span>
                                                {payment?.tourId && (
                                                    <Link
                                                        to={`/tour-detail/${payment?.tourId}`}
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
                                                {payment?.startDate
                                                    ? new Date(
                                                          payment?.startDate
                                                      ).toLocaleDateString(
                                                          'vi-VN'
                                                      )
                                                    : 'Chưa có'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 text-sm">
                                                Ngày tạo
                                            </span>
                                            <span className="text-gray-800 font-medium">
                                                {payment?.createdDate
                                                    ? new Date(
                                                          payment?.createdDate
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
                                                {payment?.firstName ||
                                                payment?.lastName
                                                    ? `${payment?.firstName || ''} ${payment?.lastName || ''}`.trim()
                                                    : 'Chưa có'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 text-sm">
                                                Email
                                            </span>
                                            <span className="text-gray-800 font-medium">
                                                {payment?.userEmail ||
                                                    'Chưa có'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 text-sm">
                                                Số điện thoại
                                            </span>
                                            <span className="text-gray-800 font-medium">
                                                {payment?.phoneNumber ||
                                                    'Chưa có'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Chi tiết thanh toán */}
                                <div className="mb-8">
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
                                                    payment?.numAdults,
                                                    payment?.priceAdult
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 text-sm">
                                                Giá trẻ em (5-10 tuổi)
                                            </span>
                                            <span className="text-gray-800 font-medium">
                                                {formatPriceLine(
                                                    payment?.numChildren5To10,
                                                    payment?.priceChild5To10
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 text-sm">
                                                Giá trẻ em (dưới 5 tuổi)
                                            </span>
                                            <span className="text-gray-800 font-medium">
                                                {formatPriceLine(
                                                    payment?.numChildrenUnder5,
                                                    payment?.priceChildUnder5
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 text-sm">
                                                Tổng số tiền
                                            </span>
                                            <span className="text-green-600 font-bold text-lg">
                                                {formatCurrency(
                                                    payment?.amount
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 text-sm">
                                                Mã ngân hàng
                                            </span>
                                            <span className="text-gray-800 font-medium">
                                                {payment?.bankCode || 'Chưa có'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 text-sm">
                                                Mã giao dịch
                                            </span>
                                            <span className="text-gray-800 font-medium">
                                                {payment?.vnpTransactionNo ||
                                                    'Chưa có'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 text-sm">
                                                Thời gian thanh toán
                                            </span>
                                            <span className="text-gray-800 font-medium">
                                                {payment?.paymentTime
                                                    ? new Date(
                                                          payment?.paymentTime
                                                      ).toLocaleString('vi-VN')
                                                    : 'Chưa có'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Thông tin hoàn tiền */}
                                {payment?.refundStatus && (
                                    <div className="mb-8">
                                        <h2 className="text-xl font-bold text-gray-700 mb-4">
                                            Thông tin hoàn tiền
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-gray-500 text-sm">
                                                    Số tiền hoàn
                                                </span>
                                                <span className="text-gray-800 font-medium">
                                                    {formatCurrency(
                                                        payment?.refundAmount
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-gray-500 text-sm">
                                                    Trạng thái hoàn tiền
                                                </span>
                                                <span
                                                    className={`font-medium ${
                                                        payment?.refundStatus ===
                                                        'Approved'
                                                            ? 'text-green-600'
                                                            : 'text-yellow-600'
                                                    }`}
                                                >
                                                    {payment?.refundStatus ===
                                                    'Approved'
                                                        ? 'Đã duyệt'
                                                        : payment?.refundStatus ||
                                                          'Chưa có'}
                                                </span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-gray-500 text-sm">
                                                    Phương thức hoàn tiền
                                                </span>
                                                <span className="text-gray-800 font-medium">
                                                    {payment?.refundMethod ||
                                                        'Chưa có'}
                                                </span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-gray-500 text-sm">
                                                    Lý do hủy
                                                </span>
                                                <span className="text-gray-800 font-medium">
                                                    {payment?.cancelReason ||
                                                        'Chưa có'}
                                                </span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-gray-500 text-sm">
                                                    Ngày hoàn tiền
                                                </span>
                                                <span className="text-gray-800 font-medium">
                                                    {payment?.refundDate
                                                        ? new Date(
                                                              payment?.refundDate
                                                          ).toLocaleString(
                                                              'vi-VN'
                                                          )
                                                        : 'Chưa có'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end m-4">
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                            >
                                Quay lại
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookingDetailDialog
