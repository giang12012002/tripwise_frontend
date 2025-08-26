import React from 'react'
import { Star } from 'lucide-react'

function ReviewDetail({ review, onSend }) {
    if (!review) return <div>Không tìm thấy đánh giá.</div>

    const { comment, createdBy, createdAt, rating, userName } = review

    const renderStars = (count) => {
        return (
            <div className="flex gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={18}
                        fill={i < count ? 'currentColor' : 'none'}
                        stroke="currentColor"
                    />
                ))}
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
            <h2 className="text-xl font-bold mb-4">Chi tiết đánh giá</h2>

            <div className="mb-4">
                <label className="text-sm text-gray-500">Người đánh giá:</label>
                <p className="text-lg font-semibold">
                    {userName || 'Không rõ'}
                </p>
            </div>

            <div className="mb-4">
                <label className="text-sm text-gray-500">Số sao:</label>
                {renderStars(rating)}
            </div>

            <div className="mb-4">
                <label className="text-sm text-gray-500">
                    Nội dung đánh giá:
                </label>
                <p className="text-gray-700">
                    {comment || 'Không có nội dung'}
                </p>
            </div>

            <div className="mb-6">
                <label className="text-sm text-gray-500">Ngày tạo:</label>
                <p className="text-gray-600">
                    {new Date(createdAt).toLocaleString('vi-VN')}
                </p>
            </div>

            {/* Ẩn */}
            <div className="text-right hidden">
                <button
                    onClick={onSend}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Gửi đến người dùng
                </button>
            </div>
        </div>
    )
}

export default ReviewDetail
