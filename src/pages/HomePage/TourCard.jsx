import { useState, useEffect } from 'react'
import tourUserAPI from '@/apis/TourUserAPI'
import Swal from 'sweetalert2'

function TourCard({
    tour,
    onViewDetail,
    removeTourFromWishlist,
    validTourIds = []
}) {
    const [isLiked, setIsLiked] = useState(false)
    const [loading, setLoading] = useState(false)
    const [tourDetails, setTourDetails] = useState({})

    useEffect(() => {
        const fetchTourDetails = async () => {
            const accessToken = localStorage.getItem('accessToken')
            if (!tour?.id) {
                console.error('Lỗi: tour hoặc tour.id không hợp lệ:', tour)
                return
            }

            try {
                const response = await tourUserAPI.getApprovedTourDetail(
                    tour.id,
                    accessToken
                )
                setTourDetails(response.data || {})
            } catch (err) {
                console.error('Lỗi khi lấy chi tiết tour:', {
                    tourId: tour.id,
                    message: err.message,
                    response: err.response?.data,
                    status: err.response?.status
                })
            }
        }

        const checkIfLiked = async () => {
            const accessToken = localStorage.getItem('accessToken')
            if (!accessToken) {
                setIsLiked(false)
                return
            }

            try {
                const response = await tourUserAPI.getUserWishlist(accessToken)
                const wishlistTours = Array.isArray(response.data)
                    ? response.data
                    : []
                const isTourLiked = wishlistTours.some(
                    (wishlistTour) => wishlistTour.tourId === tour.id
                )
                setIsLiked(isTourLiked)
            } catch (err) {
                console.error('Lỗi khi kiểm tra danh sách yêu thích:', {
                    message: err.message,
                    response: err.response?.data,
                    status: err.response?.status
                })
                if (
                    err.response?.status === 401 ||
                    err.response?.data?.error?.includes('token')
                ) {
                    console.log(
                        'Token không hợp lệ hoặc hết hạn, xóa khỏi localStorage'
                    )
                    localStorage.removeItem('accessToken')
                    setIsLiked(false)
                } else {
                    setIsLiked(false)
                }
            }
        }

        if (tour && tour.id) {
            fetchTourDetails()
            checkIfLiked()
        } else {
            console.error('Lỗi: tour hoặc tour.id không hợp lệ:', tour)
            setIsLiked(false)
        }
    }, [tour?.id])

    const handleLikeToggle = async () => {
        const accessToken = localStorage.getItem('accessToken')
        if (!accessToken) {
            console.log(
                'Không tìm thấy accessToken khi thực hiện thao tác yêu thích'
            )
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Vui lòng đăng nhập để thêm vào danh sách yêu thích.',
                showConfirmButton: false,
                timer: 1800
            })
            return
        }

        if (!tour?.id) {
            console.error('Lỗi: tour hoặc tour.id không hợp lệ:', { tour })
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Thông tin tour không hợp lệ.',
                showConfirmButton: false,
                timer: 1800
            })
            return
        }

        let isTourValid =
            Array.isArray(validTourIds) && validTourIds.includes(tour.id)
        if (!isTourValid) {
            try {
                await tourUserAPI.getApprovedTourDetail(tour.id, accessToken)
                isTourValid = true
            } catch (err) {
                console.error('Lỗi khi xác thực tour:', {
                    tourId: tour.id,
                    message: err.message,
                    response: err.response?.data,
                    status: err.response?.status
                })
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Tour không hợp lệ hoặc không tồn tại trong hệ thống. Đang làm mới danh sách...',
                    showConfirmButton: false,
                    timer: 1800
                })
                if (removeTourFromWishlist) {
                    removeTourFromWishlist(tour.id)
                }
                return
            }
        }

        try {
            setLoading(true)

            if (isLiked) {
                await tourUserAPI.removeFromWishlist(tour.id, accessToken)
                setIsLiked(false)
                if (removeTourFromWishlist) {
                    removeTourFromWishlist(tour.id)
                }
            } else {
                await tourUserAPI.addToWishlist(tour.id, accessToken)
                setIsLiked(true)
            }
        } catch (err) {
            console.error('Lỗi khi cập nhật danh sách yêu thích:', {
                tourId: tour.id,
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            })
            let errorMessage =
                'Không thể cập nhật danh sách yêu thích. Vui lòng thử lại.'
            if (
                err.response?.status === 401 ||
                err.response?.data?.error?.includes('token')
            ) {
                errorMessage =
                    'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'
                localStorage.removeItem('accessToken')
            } else if (
                err.response?.status === 500 &&
                err.response?.data?.includes('FOREIGN KEY constraint')
            ) {
                errorMessage = `Tour với ID ${tour.id} không tồn tại trong hệ thống. Đang làm mới danh sách...`
                if (removeTourFromWishlist) {
                    removeTourFromWishlist(tour.id)
                }
            } else if (err.response?.status === 400) {
                errorMessage = 'Tour đã có trong danh sách yêu thích.'
            }
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: errorMessage,
                showConfirmButton: false,
                timer: 1800
            })
        } finally {
            setLoading(false)
        }
    }

    const imageUrl =
        tourDetails.image && tourDetails.image.trim()
            ? tourDetails.image
            : tour.image || null
    const tourName = tourDetails.name || tour.name || 'Tour không có tên'
    const tourPrice = tourDetails.price || tour.price || 'Giá không xác định'
    const tourAddress =
        tourDetails.address || tour.address || 'Địa chỉ không xác định'

    // Format startTime to "00:00 sáng - 30/08/2025"
    // Format startTime to "00:00 sáng - 30/08/2025" or "14:00 tối - 30/08/2025"
    const formatStartTime = (startTime) => {
        if (!startTime) return 'Ngày khởi hành không xác định'
        try {
            const date = new Date(startTime)
            if (isNaN(date.getTime())) return 'Ngày khởi hành không xác định'

            const hours = date.getHours()
            const period = hours < 12 ? 'sáng' : 'tối'

            const timeOptions = {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }
            const dateOptions = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }

            const timeString = date.toLocaleTimeString('vi-VN', timeOptions)
            const dateString = date
                .toLocaleDateString('vi-VN', dateOptions)
                .replace(/\//g, '/')
            return `${timeString} ${period} - ${dateString}`
        } catch (err) {
            console.error('Lỗi khi định dạng startTime:', err.message)
            return 'Ngày khởi hành không xác định'
        }
    }

    const tourStartTime = formatStartTime(
        tourDetails.startTime || tour.startTime || tour.StartTime
    )

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg">
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={tourName}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                        console.log(
                            `Lỗi tải ảnh cho tour ${tour.id}: ${e.target.src}`
                        )
                        e.target.style.display = 'none'
                    }}
                />
            ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Không có ảnh</span>
                </div>
            )}
            <div className="p-6">
                <p className="text-xl font-semibold text-red-600 mb-2">
                    {tourPrice}
                </p>
                <div className="flex items-center mb-3">
                    <span className="text-yellow-500">★★★★★</span>
                    <span className="ml-2 text-gray-600 text-sm">4.6</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {tourName}
                </h3>
                <div className="flex items-center text-gray-600 text-sm mb-2">
                    <svg
                        className="w-5 h-5 mr-2 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"
                        />
                    </svg>
                    <span>{tourAddress}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm mb-4">
                    <svg
                        className="w-5 h-5 mr-2 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    <span>{tourStartTime}</span>
                </div>
                <div className="flex justify-between mt-4">
                    <button
                        className={`flex items-center ${isLiked ? 'text-red-500' : 'text-gray-400'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleLikeToggle}
                        disabled={loading}
                    >
                        <svg
                            className="w-5 h-5 mr-1"
                            fill={isLiked ? 'currentColor' : 'none'}
                            stroke={isLiked ? 'none' : 'currentColor'}
                            strokeWidth="2"
                            viewBox="0 0 20 20"
                        >
                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                        </svg>
                        {isLiked ? 'Đã thích' : 'Yêu thích'}
                    </button>
                    <button
                        className="text-blue-600 font-semibold hover:underline hover:text-blue-800 transition-colors"
                        onClick={() => onViewDetail(tour.id)}
                    >
                        Xem chi tiết
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TourCard
