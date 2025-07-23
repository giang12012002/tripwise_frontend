import React, { useEffect, useState } from 'react'
import LoadingSpinner from '@/components/states/LoadingSpinner'
import { toast } from 'react-toastify'

function BookingConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    tourId,
    tourName,
    dayNum,
    peopleNum
}) {
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

    const handleSubmit = async () => {
        setLoading(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            onConfirm(tourId, peopleNum, dayNum)
        } catch (err) {
            toast.error('Có lỗi xảy ra khi tạo gói')
        } finally {
            setLoading(false)
            handleClose()
        }
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
            <div className="relative bg-white rounded-lg p-6 shadow-lg max-w-2xl w-[90%] transition-transform">
                {loading && (
                    <div className="absolute inset-0 z-20 bg-white/20 backdrop-blur-[0.5px] flex items-center justify-center rounded-lg">
                        <LoadingSpinner />
                    </div>
                )}

                <div
                    className={`${loading ? 'opacity-50 pointer-events-none select-none' : ''}`}
                >
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                        Xác nhận đặt chỗ
                    </h2>

                    <div className="bg-gray-50 p-4 rounded text-gray-700 text-center space-y-2">
                        <p>
                            <strong>Tên tour:</strong> {tourName}
                        </p>
                        <p>
                            <strong>Số lượng người:</strong> {peopleNum}
                        </p>
                        <p>
                            <strong>Số ngày đi:</strong> {dayNum}
                        </p>
                    </div>

                    <div className="flex justify-end mt-6 gap-4">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
                            Quay lại
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-5 py-2 rounded bg-black text-white hover:bg-gray-800 active:bg-gray-900"
                        >
                            Tạo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookingConfirmDialog
