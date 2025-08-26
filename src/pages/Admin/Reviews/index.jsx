import React, { useEffect, useRef, useState } from 'react'
import { reviewAPI } from '@/apis'
import { Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function Index() {
    const navigate = useNavigate()
    const [reviews, setReviews] = useState([])
    const [average, setAverage] = useState(0)
    const [ratingFilter, setRatingFilter] = useState('')
    const [tourFilter, setTourFilter] = useState('') // <-- thêm
    const [tourTypeFilter, setTourTypeFilter] = useState('')
    const [open, setOpen] = useState(false)
    const dropdownRef = useRef(null)
    const [currentPage, setCurrentPage] = useState(1)
    const reviewsPerPage = 5

    const getReviews = async () => {
        try {
            const response = await reviewAPI.getAllReview()
            setReviews(response.data.data)
            console.log('Reviews:', response)
        } catch (error) {
            console.error('Error fetching reviews:', error)
        }
    }

    const calculateAverage = (data) => {
        if (!data.length) return 0
        const total = data.reduce((sum, r) => sum + r.rating, 0)
        return (total / data.length).toFixed(1)
    }

    const getEmojiByAverage = (avg) => {
        if (avg >= 4.5) return '🤩'
        if (avg >= 3.5) return '😄'
        if (avg >= 2.5) return '😐'
        if (avg > 0) return '😢'
        return '😶'
    }

    const getCommentByAverage = (avg) => {
        if (avg >= 4.5) return 'Tuyệt vời'
        if (avg >= 3.5) return 'Khá tốt'
        if (avg >= 2.5) return 'Trung bình'
        if (avg > 0) return 'Tệ'
        return 'Chưa có đánh giá'
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    // lọc dữ liệu theo rating + tour
    const filteredReviews = reviews.filter((r) => {
        const matchRating = ratingFilter
            ? r.rating === Number(ratingFilter)
            : true
        const matchTour = tourFilter ? r.tourName === tourFilter : true
        const matchType = tourTypeFilter ? r.tourType === tourTypeFilter : true
        return matchRating && matchTour && matchType
    })

    const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage)
    const currentReviews = filteredReviews.slice(
        (currentPage - 1) * reviewsPerPage,
        currentPage * reviewsPerPage
    )

    // Lấy danh sách tour duy nhất
    const uniqueTours = [
        ...new Map(
            reviews.map((r) => [
                r.tourId,
                { id: r.tourId, name: r.tourName, type: r.tourType }
            ])
        ).values()
    ]

    useEffect(() => {
        getReviews()
    }, [])

    useEffect(() => {
        setAverage(calculateAverage(filteredReviews))
    }, [filteredReviews])

    // đóng khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-center">
                Quản lý đánh giá
            </h1>

            {/* Thống kê */}
            <div className="bg-white shadow p-4 rounded-lg mb-6 flex items-center justify-between">
                <p className="text-gray-700 text-lg">
                    ⭐ Điểm trung bình:{' '}
                    <span className="font-bold">
                        {average} {getEmojiByAverage(average)}
                    </span>
                </p>
                <p className="text-gray-500 text-sm italic">
                    {getCommentByAverage(average)}
                </p>
            </div>

            {/* Bộ lọc */}
            <div className="mb-4 flex gap-3 items-center">
                <label className="text-sm font-medium">Loại tour:</label>
                <select
                    value={tourTypeFilter}
                    onChange={(e) => {
                        setTourTypeFilter(e.target.value)
                        setCurrentPage(1)
                    }}
                    className="border px-3 py-1 rounded"
                >
                    <option value="">Tất cả</option>
                    <option value="Chatbot">🤖 Lịch trình AI</option>
                    <option value="Partner">🏢 Tour đối tác</option>
                </select>

                <label className="text-sm font-medium">Đánh giá:</label>
                <select
                    value={ratingFilter}
                    onChange={(e) => {
                        setRatingFilter(e.target.value)
                        setCurrentPage(1)
                    }}
                    className="border px-3 py-1 rounded"
                >
                    <option value="">Tất cả</option>
                    <option value="5">🤩 Tuyệt vời (5 sao)</option>
                    <option value="4">😄 Tuyệt (4 sao)</option>
                    <option value="3">😐 Khá (3 sao)</option>
                    <option value="2">😢 Tệ (2 sao)</option>
                    <option value="1">😠 Rất tệ (1 sao)</option>
                </select>

                <label className="text-sm font-medium">Tour:</label>

                <div ref={dropdownRef} className="relative w-82">
                    <button
                        className="border px-3 py-1 rounded w-full truncate text-left"
                        onClick={() => setOpen(!open)}
                    >
                        {tourFilter || 'Tất cả'}
                    </button>

                    {open && (
                        <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto border rounded bg-white shadow">
                            <li
                                className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setTourFilter('')
                                    setOpen(false)
                                }}
                            >
                                Tất cả
                            </li>
                            {uniqueTours.map((tour, idx) => (
                                <li
                                    key={idx}
                                    className="px-3 py-1 hover:bg-gray-100 cursor-pointer truncate"
                                    onClick={() => {
                                        setTourFilter(tour.name)
                                        setOpen(false)
                                    }}
                                    title={tour.name}
                                >
                                    {tour.type === 'Chatbot' ? '🤖' : '🏢'}{' '}
                                    {tour.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded ml-auto p-1"
                    onClick={() => {
                        setTourFilter('')
                        setRatingFilter('')
                        setTourTypeFilter('')
                    }}
                >
                    Đặt lại
                </button>
            </div>

            {/* Danh sách review */}
            <div className="grid gap-4">
                {currentReviews.map((review) => (
                    <div
                        key={review.reviewId}
                        className="bg-white p-4 rounded-lg shadow flex flex-col gap-2 border-l-4 border-blue-500"
                    >
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">
                                {review.userName || 'Người dùng'}
                            </h2>
                            <div className="flex gap-1 text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={18}
                                        fill={
                                            i < review.rating
                                                ? 'currentColor'
                                                : 'none'
                                        }
                                        stroke="currentColor"
                                    />
                                ))}
                            </div>
                        </div>
                        <p
                            className="text-gray-600 line-clamp-1"
                            title={review.comment}
                        >
                            Đánh giá: {review.comment || 'Không rõ'}
                        </p>
                        <p
                            className="text-sm text-gray-500 italic line-clamp-1"
                            title={review.tourName}
                        >
                            📍 {review.tourName}
                        </p>
                        <div className="flex justify-end gap-2 mt-2">
                            <button
                                onClick={() =>
                                    navigate(`/admin/review-detail`, {
                                        state: { review }
                                    })
                                }
                                className="px-4 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 hover:cursor-pointer"
                            >
                                Xem
                            </button>
                            <button
                                onClick={() =>
                                    navigate(
                                        `/admin/tourDetail/${review.tourId}`
                                    )
                                }
                                disabled={review.tourType === 'Chatbot'} // <-- vô hiệu hóa nếu là chatbot
                                className={`px-4 py-1 text-sm rounded
                                    ${
                                        review.tourType === 'Chatbot'
                                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                    }`}
                            >
                                Xem tour
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    <button
                        onClick={() =>
                            handlePageChange(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Trước
                    </button>
                    <span className="text-sm">
                        Trang {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() =>
                            handlePageChange(
                                Math.min(totalPages, currentPage + 1)
                            )
                        }
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Sau
                    </button>
                </div>
            )}
        </div>
    )
}

export default Index
