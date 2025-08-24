import React, { useState, useEffect } from 'react'
import { reviewAPI } from '@/apis'
import { useAuth } from '@/AuthContext'
import Swal from 'sweetalert2'

const ReviewSection = ({ tourId }) => {
    const [reviews, setReviews] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [newReview, setNewReview] = useState({ rating: 0, comment: '' })
    const [submitting, setSubmitting] = useState(false)
    const [showAllReviews, setShowAllReviews] = useState(false)
    const { isLoggedIn, isAuthLoading, token } = useAuth() // Added token for API calls

    const fetchReviews = async () => {
        try {
            const response = await reviewAPI.getReviewsByTour(tourId)
            if (response.status === 200) {
                setReviews(response.data || [])
            } else {
                setReviews([]) // fallback
            }
        } catch (err) {
            if (err.response && err.response.status === 404) {
                // Không có review, coi như mảng rỗng
                setReviews([])
            } else {
                console.error('API Error (fetchReviews):', err)
                setError(
                    'Không thể tải danh sách đánh giá. Vui lòng thử lại sau.'
                )
            }
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchReviews()
    }, [tourId])

    const formatDate = (dateString) => {
        if (!dateString) return 'Không xác định'
        try {
            const date = new Date(dateString)
            return date.toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })
        } catch {
            return dateString
        }
    }

    const renderStars = (rating) => {
        return (
            <div className="flex">
                {[...Array(5)].map((_, index) => (
                    <svg
                        key={index}
                        className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.357 2.44a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.539 1.118l-3.357-2.44a1 1 0 00-1.175 0l-3.357 2.44c-.784.57-1.838-.197-1.539-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.51 9.397c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.97z" />
                    </svg>
                ))}
            </div>
        )
    }

    const handleStarClick = (rating) => {
        setNewReview((prev) => ({ ...prev, rating }))
    }

    const handleCommentChange = (e) => {
        setNewReview((prev) => ({ ...prev, comment: e.target.value }))
    }

    const handleSubmitReview = async (e) => {
        e.preventDefault()
        if (newReview.rating === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Vui lòng chọn số sao',
                text: 'Bạn cần chọn số sao để đánh giá tour.',
                confirmButtonText: 'OK'
            })
            return
        }
        if (!newReview.comment.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Vui lòng nhập nhận xét',
                text: 'Bạn cần nhập nhận xét để gửi đánh giá.',
                confirmButtonText: 'OK'
            })
            return
        }

        setSubmitting(true)
        try {
            const newReviewData = {
                tourId,
                rating: newReview.rating,
                comment: newReview.comment
            }
            // Use token for authenticated API call
            const response = await reviewAPI.addTourReview(newReviewData)
            if (response.status === 200) {
                // Assuming 201 for created

                fetchReviews()

                setNewReview({ rating: 0, comment: '' })
                setShowAllReviews(true)
                Swal.fire({
                    icon: 'success',
                    title: 'Đánh giá đã được gửi',
                    text:
                        response.data.message ||
                        'Cảm ơn bạn đã chia sẻ đánh giá!',
                    confirmButtonText: 'OK'
                })
            } else {
                throw new Error('Yêu cầu không thành công')
            }
        } catch (err) {
            console.error('API Error (submitReview):', err)
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text:
                    err.response?.data?.message ||
                    'Không thể gửi đánh giá. Vui lòng thử lại.',
                confirmButtonText: 'OK'
            })
        } finally {
            setSubmitting(false)
        }
    }

    const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3)

    if (isLoading || isAuthLoading) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                <svg
                    className="animate-spin h-8 w-8 text-indigo-600 mx-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
                <p className="mt-2 text-gray-600">Đang tải đánh giá...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                <p className="text-red-600">{error}</p>
            </div>
        )
    }

    return (
        <div className="mt-12">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-5 rounded-t-2xl font-bold uppercase text-center text-xl shadow-lg">
                Đánh Giá Tour
            </div>
            <div className="bg-white p-8 rounded-b-2xl shadow-2xl border-t-4 border-indigo-600">
                {/* Nếu chưa đăng nhập thì hiện gợi ý login */}
                {!isLoggedIn && (
                    <div className="mb-8 text-center">
                        <p className="text-gray-600">
                            Bạn cần{' '}
                            <a
                                href="/signin"
                                className="text-indigo-600 hover:underline font-medium"
                            >
                                đăng nhập
                            </a>{' '}
                            để thêm đánh giá cho tour này.
                        </p>
                    </div>
                )}

                {/* Nếu đã đăng nhập thì hiện form thêm review */}
                {isLoggedIn && (
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Thêm đánh giá của bạn
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Đánh giá sao
                                </label>
                                <div className="flex space-x-1">
                                    {[...Array(5)].map((_, index) => (
                                        <svg
                                            key={index}
                                            className={`w-6 h-6 cursor-pointer ${
                                                index < newReview.rating
                                                    ? 'text-yellow-400'
                                                    : 'text-gray-300'
                                            } hover:text-yellow-300`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            onClick={() =>
                                                handleStarClick(index + 1)
                                            }
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.357 2.44a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.539 1.118l-3.357-2.44a1 1 0 00-1.175 0l-3.357 2.44c-.784.57-1.838-.197-1.539-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.51 9.397c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.97z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Nhận xét
                                </label>
                                <textarea
                                    value={newReview.comment}
                                    onChange={handleCommentChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    rows="4"
                                    placeholder="Chia sẻ trải nghiệm của bạn về tour này..."
                                />
                            </div>
                            <button
                                onClick={handleSubmitReview}
                                disabled={submitting}
                                className={`w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors ${
                                    submitting
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                }`}
                            >
                                {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Luôn hiển thị danh sách review */}
                {reviews.length === 0 ? (
                    <p className="text-gray-600 text-center">
                        Chưa có đánh giá nào cho tour này.
                    </p>
                ) : (
                    <>
                        <div
                            className={`space-y-6 ${
                                showAllReviews ? 'max-h-96 overflow-y-auto' : ''
                            } scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-gray-100 pr-2`}
                        >
                            {displayedReviews.map((review) => (
                                <div
                                    key={review.reviewId}
                                    className="border-b border-gray-200 pb-6 last:border-b-0"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                    <span className="text-indigo-600 font-semibold">
                                                        {review.userName[0].toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-lg font-semibold text-gray-900">
                                                    {review.userName}
                                                </p>
                                                <div className="flex items-center space-x-2">
                                                    {renderStars(review.rating)}
                                                    <span className="text-sm text-gray-500">
                                                        {formatDate(
                                                            review.createdDate
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mt-3 text-gray-700">
                                        {review.comment}
                                    </p>
                                </div>
                            ))}
                        </div>
                        {reviews.length > 3 && (
                            <div className="mt-4 text-center">
                                <button
                                    onClick={() =>
                                        setShowAllReviews(!showAllReviews)
                                    }
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                                >
                                    {showAllReviews ? 'Thu gọn' : 'Xem thêm'}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default ReviewSection
