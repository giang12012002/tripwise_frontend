import React, { useEffect, useState } from 'react'
import LoadingSpinner from '@/components/states/LoadingSpinner' // dùng chung spinner với AddBlogDialog

function DeletedConfirmDialog({ isOpen, onClose, onConfirm }) {
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

    const handleDelete = async () => {
        setLoading(true)
        try {
            await onConfirm()
        } finally {
            setLoading(false)
            onClose()
        }
    }

    if (!isVisible) return null

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center z-50 bg-white/10 backdrop-blur-sm ${animationClass}`}
        >
            <div className="relative bg-white rounded-lg p-6 shadow-lg max-w-md w-full transition-transform">
                {/* Loading overlay */}
                {loading && (
                    <div className="absolute inset-0 z-20 bg-white/20 backdrop-blur-[1px] flex items-center justify-center rounded-lg">
                        <LoadingSpinner />
                    </div>
                )}

                {/* Dialog content */}
                <div
                    className={`${
                        loading
                            ? 'opacity-50 pointer-events-none select-none'
                            : ''
                    }`}
                >
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Xác nhận xóa
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Bạn có chắc chắn muốn xóa mục này? Hành động này không
                        thể hoàn tác.
                    </p>
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 transition hover:cursor-pointer active:bg-gray-500 disabled:opacity-50"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={loading}
                            className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white transition hover:cursor-pointer active:bg-red-700 disabled:opacity-50"
                        >
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeletedConfirmDialog
