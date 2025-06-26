import React, { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

const paymentMethods = [
    { id: 'vnpay', name: 'VNPAY', icon: '/vnpay-logo.svg' },
    { id: 'visa', name: 'VISA', icon: '/visa-logo.svg' }
]

function ConfirmDialog({
    plan,
    billingPeriod,
    multiplier,
    isOpen,
    onClose,
    onConfirm
}) {
    const [isVisible, setIsVisible] = useState(false)
    const [animationClass, setAnimationClass] = useState('fade-in')
    const [selectedMethod, setSelectedMethod] = useState('vnpay')

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true)
            setAnimationClass('fade-in')
        } else {
            setAnimationClass('fade-out')
            setTimeout(() => setIsVisible(false), 300)
        }
    }, [isOpen])

    if (!isVisible || !plan) return null

    return (
        <div
            className={`fixed inset-0 z-50 bg-black/30 flex justify-center items-center ${animationClass}`}
        >
            <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-6 md:p-8 transition-transform duration-300">
                <h2 className="text-lg font-semibold mb-4">
                    Plan bạn đã chọn:
                </h2>

                <p className="text-gray-700 mb-4 text-base">
                    Tổng giá:{' '}
                    <span className="font-bold text-green-600">
                        {plan.price.toLocaleString()} VND
                    </span>
                </p>

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
                                        className="h-5"
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

                    {/* Quyền lợi */}
                    <div className="flex-1 bg-gray-100 p-4 rounded-lg">
                        <p className="font-semibold mb-2">Bạn sẽ nhận được:</p>
                        <ul className="space-y-2 text-sm">
                            {plan.features.map((f, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <Check
                                        size={16}
                                        className="text-green-600"
                                    />
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
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
                            if (selectedMethod === 'visa') {
                                toast.error('Hiện tại chưa hỗ trợ VISA')
                                return
                            }
                            onConfirm({
                                plan,
                                method: selectedMethod
                            })
                        }}
                        className="px-5 py-2 rounded bg-black text-white hover:bg-gray-800 hover:cursor-pointer active:bg-gray-900"
                    >
                        Thanh toán →
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDialog
