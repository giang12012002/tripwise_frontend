import React, { useEffect, useState } from 'react'

function DeletedConfirmDialog({ isOpen, onClose, onConfirm }) {
    const [isVisible, setIsVisible] = useState(false)
    const [animationClass, setAnimationClass] = useState('fade-in')

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true)
            setAnimationClass('fade-in')
        } else {
            setAnimationClass('fade-out')
            setTimeout(() => setIsVisible(false), 300) // khớp với thời gian fade-out
        }
    }, [isOpen])

    if (!isVisible) return null

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center z-50 bg-white/10 backdrop-blur-sm ${animationClass}`}
        >
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full transition-transform">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Xác nhận xóa
                </h2>
                <p className="text-gray-600 mb-6">
                    Bạn có chắc chắn muốn xóa mục này? Hành động này không thể
                    hoàn tác.
                </p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 transition hover:cursor-pointer active:bg-gray-500"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white transition hover:cursor-pointer active:bg-red-700"
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeletedConfirmDialog
