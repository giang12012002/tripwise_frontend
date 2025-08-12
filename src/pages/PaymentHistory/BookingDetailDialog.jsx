import React, { useEffect, useState } from 'react'
import LoadingSpinner from '@/components/states/LoadingSpinner'
import { Link } from 'react-router-dom'

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
                    {/* Wrapper để giữ padding cho nội dung, nhưng vùng cuộn sát viền */}
                    <div className="">
                        <div className="max-h-[80vh] overflow-y-auto p-6">
                            <div className="space-y-4">
                                {/* Tiêu đề */}
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Chi tiết Booking
                                </h2>

                                {/* Thông tin tour */}
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <p className="text-sm text-gray-500">
                                        Tên tour
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {payment?.tourName || 'N/A'}
                                    </p>
                                </div>

                                {/* Mã đơn & Trạng thái */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <p className="text-sm text-gray-500">
                                            Mã đơn
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {payment?.orderCode || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <p className="text-sm text-gray-500">
                                            Trạng thái thanh toán
                                        </p>
                                        <span
                                            className={`px-2 py-1 text-sm rounded ${
                                                payment?.paymentStatus ===
                                                'Success'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {payment?.paymentStatus || 'N/A'}
                                        </span>
                                    </div>
                                </div>

                                {/* Thông tin thanh toán */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <p className="text-sm text-gray-500">
                                            Ngân hàng
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {payment?.bankCode || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <p className="text-sm text-gray-500">
                                            Số tiền
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {(
                                                payment?.amount || 0
                                            ).toLocaleString('vi-VN')}
                                            ₫
                                        </p>
                                    </div>
                                </div>

                                {/* Thời gian */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <p className="text-sm text-gray-500">
                                            Ngày tạo
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {payment?.createdDate
                                                ? new Date(
                                                      payment.createdDate
                                                  ).toLocaleString('vi-VN')
                                                : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <p className="text-sm text-gray-500">
                                            Thời gian thanh toán
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {payment?.paymentTime
                                                ? new Date(
                                                      payment?.paymentTime
                                                  ).toLocaleString('vi-VN')
                                                : 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                {/* Transaction ID & Booking ID */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <p className="text-sm text-gray-500">
                                            Transaction ID
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {payment?.vnpTransactionNo || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <p className="text-sm text-gray-500">
                                            Booking ID
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {payment?.bookingId || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                {/* Thông tin bổ sung */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <p className="text-sm text-gray-500">
                                            Số điện thoại
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {payment?.phoneNumber || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <p className="text-sm text-gray-500">
                                            Email người dùng
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {payment?.userEmail || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                {/* Giá chi tiết */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <p className="text-sm text-gray-500">
                                            Giá người lớn
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {(
                                                payment?.priceAdult || 0
                                            ).toLocaleString('vi-VN')}
                                            ₫
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <p className="text-sm text-gray-500">
                                            Giá trẻ em (5-10 tuổi)
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {(
                                                payment?.priceChild5To10 || 0
                                            ).toLocaleString('vi-VN')}
                                            ₫
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <p className="text-sm text-gray-500">
                                            Giá trẻ em (dưới 5 tuổi)
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {(
                                                payment?.priceChildUnder5 || 0
                                            ).toLocaleString('vi-VN')}
                                            ₫
                                        </p>
                                    </div>
                                </div>

                                {/* Ngày khởi hành */}
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <p className="text-sm text-gray-500">
                                        Ngày khởi hành
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {payment?.startDate
                                            ? new Date(
                                                  payment?.startDate
                                              ).toLocaleString('vi-VN', {
                                                  dateStyle: 'full',
                                                  timeStyle: 'short'
                                              })
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end m-6 gap-4">
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                            >
                                Quay lại
                            </button>
                            <Link
                                to={`/tour-detail/${payment?.tourId}`}
                                // onClick={handleSubmit}
                                className="px-5 py-2 rounded bg-black text-white hover:bg-gray-800 active:bg-gray-900"
                            >
                                Tour đã đặt
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookingDetailDialog
