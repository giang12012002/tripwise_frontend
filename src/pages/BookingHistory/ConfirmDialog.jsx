import React, { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { toast } from 'react-toastify'

const paymentMethods = [
    { id: 'chuyển khoản', name: 'Chuyển khoản', icon: '/credit-card-logo.svg' },
    { id: 'tiền mặt', name: 'Tiền mặt', icon: '/cash-logo.svg' }
]

function ConfirmDialog({ booking, isOpen, onClose, onConfirm }) {
    const [isVisible, setIsVisible] = useState(false)
    const [animationClass, setAnimationClass] = useState('fade-in')
    const [selectedMethod, setSelectedMethod] = useState('chuyển khoản')
    const [refundReason, setRefundReason] = useState('')

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true)
            setAnimationClass('fade-in')
        } else {
            setAnimationClass('fade-out')
            setTimeout(() => setIsVisible(false), 300)
        }
    }, [isOpen])

    if (!isVisible || !booking) return null
    console.log('Booking:', booking)

    return (
        <div
            className={`fixed inset-0 z-50 bg-black/30 flex justify-center items-center ${animationClass}`}
        >
            <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-6 md:p-8 transition-transform duration-300">
                <h2 className="text-lg font-semibold mb-4">Hoàn tiền:</h2>

                <div className="flex flex-col md:flex-row justify-between gap-4">
                    {/* Chọn phương thức thanh toán */}
                    <div className="flex-1 bg-gray-100 p-4 rounded-lg">
                        <p className="font-semibold mb-2">
                            Chọn phương thức thanh toán:
                        </p>
                        <div className="space-y-3">
                            {paymentMethods.map((method) => (
                                <label
                                    key={method.id}
                                    className={`flex items-center justify-between border px-4 py-3 rounded-lg cursor-pointer ${
                                        selectedMethod === method.id
                                            ? 'border-green-500 bg-white'
                                            : 'border-gray-300 bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`w-4 h-4 rounded-full border ${
                                                selectedMethod === method.id
                                                    ? 'bg-green-500 border-green-500'
                                                    : 'bg-white'
                                            }`}
                                        />
                                        <span>{method.name}</span>
                                    </div>
                                    <img
                                        src={method.icon}
                                        alt={method.name}
                                        className="h-7"
                                    />
                                    <input
                                        type="radio"
                                        name="payment"
                                        value={method.id}
                                        checked={selectedMethod === method.id}
                                        onChange={() =>
                                            setSelectedMethod(method.id)
                                        }
                                        className="hidden"
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Lý do */}
                    <div className="flex-1 bg-gray-100 p-4 rounded-lg">
                        <p className="font-semibold mb-2">Lý do hoàn tiền:</p>
                        <textarea
                            className="w-full h-28 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            placeholder="Nhập lý do hoàn tiền..."
                            onChange={(e) => setRefundReason(e.target.value)}
                        />
                    </div>
                </div>

                {/* Chính sách hoàn tiền */}
                <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700">
                    <p className="font-semibold mb-2">Chính sách hoàn tiền:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>
                            Hủy từ 20 ngày trở lên trước ngày khởi hành: khấu
                            trừ 10% giá tour
                        </li>
                        <li>
                            Hủy trong vòng 15–19 ngày trước ngày khởi hành: khấu
                            trừ 50% giá tour
                        </li>
                        <li>
                            Hủy trong vòng 7–14 ngày trước ngày khởi hành: khấu
                            trừ 70% giá tour
                        </li>
                        <li>
                            Hủy dưới 7 ngày trước ngày khởi hành: không hoàn
                            tiền (100% giá tour)
                        </li>
                    </ul>
                    <span className="font-semibold text-red-500 mt-2 block">
                        {booking.refundMessage || 'Chưa có'}
                    </span>
                </div>

                {/* Footer */}
                <div className="flex justify-end mt-6 gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 hover:cursor-pointer"
                    >
                        Thoát
                    </button>
                    <button
                        onClick={() => {
                            onConfirm({
                                bookingId: booking.bookingId,
                                cancelReason: refundReason,
                                refundMethod: selectedMethod
                            })
                        }}
                        className="px-5 py-2 rounded bg-black text-white hover:bg-gray-800 hover:cursor-pointer active:bg-gray-900"
                    >
                        Xác nhận →
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDialog
