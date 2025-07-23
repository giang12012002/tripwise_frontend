import React, { useEffect, useState } from 'react'
import LoadingSpinner from '@/components/states/LoadingSpinner'
import { toast } from 'react-toastify'
import { Star } from 'lucide-react'

function ReviewDialog({ isOpen, onClose, onConfirm }) {
    const [isVisible, setIsVisible] = useState(false)
    const [animationClass, setAnimationClass] = useState('fade-in')
    const [loading, setLoading] = useState(false)

    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState('')

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
        if (rating === 0) {
            toast.warning('Vui lòng chọn số sao đánh giá!')
            return
        }

        setLoading(true)
        try {
            await onConfirm({ rating, comment })
        } catch (err) {
            toast.error(err.message || 'Có lỗi xảy ra khi gửi đánh giá!')
        } finally {
            setLoading(false)
            handleClose()
        }
    }

    const handleClose = () => {
        onClose()
        setRating(0)
        setHoverRating(0)
        setComment('')
    }

    if (!isVisible) return null

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center z-50 bg-white/10 backdrop-blur-sm ${animationClass}`}
        >
            <div className="relative bg-white rounded-lg p-8 shadow-lg max-w-lg w-full transition-transform">
                {loading && (
                    <div className="absolute inset-0 z-20 bg-white/40 backdrop-blur-sm flex items-center justify-center rounded-lg">
                        <LoadingSpinner />
                    </div>
                )}

                <div
                    className={`${loading ? 'opacity-50 pointer-events-none select-none' : ''}`}
                >
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                        Bạn thấy lịch trình này thế nào? Hãy để lại đánh giá cho
                        chúng tôi!
                    </h2>

                    <div className="flex justify-center space-x-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-8 h-8 cursor-pointer transition-colors ${
                                    (hoverRating || rating) >= star
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                }`}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                            />
                        ))}
                    </div>

                    <textarea
                        placeholder="Hãy để lại đánh giá ở đây..."
                        className="w-full p-3 border rounded resize-none text-sm text-gray-700"
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />

                    <div className="flex justify-end mt-6 gap-3">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 hover:cursor-pointer"
                        >
                            Thoát
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-5 py-2 rounded bg-black text-white hover:bg-gray-800 active:bg-gray-900 hover:cursor-pointer"
                        >
                            Lưu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReviewDialog
