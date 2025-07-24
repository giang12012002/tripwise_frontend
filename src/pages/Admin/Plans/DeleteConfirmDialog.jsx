import React, { useEffect, useState } from 'react'

function DeleteConfirmDialog({ plan, isOpen, onClose, onConfirm }) {
    const [isVisible, setIsVisible] = useState(false)
    const [animationClass, setAnimationClass] = useState('fade-in')

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
                    Xác nhận xóa gói {plan.planName}
                </h2>

                <div className="flex justify-end mt-6 gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 hover:cursor-pointer"
                    >
                        Thoát
                    </button>
                    <button
                        onClick={() => {
                            onConfirm(plan)
                            onClose()
                        }}
                        className="px-5 py-2 rounded bg-black text-white hover:bg-gray-800 hover:cursor-pointer active:bg-gray-900"
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteConfirmDialog
