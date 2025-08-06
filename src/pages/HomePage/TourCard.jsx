import { useState, useEffect } from 'react'
import tourUserAPI from '@/apis/TourUserAPI'
import Swal from 'sweetalert2'

function TourCard({ tour, onViewDetail, refreshTours, validTourIds = [] }) {
    const [isLiked, setIsLiked] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const checkIfLiked = async () => {
            const accessToken = localStorage.getItem('accessToken')
            if (!accessToken) {
                console.log('Không tìm thấy accessToken trong localStorage')
                setIsLiked(false) // Đặt isLiked về false nếu không có token
                return
            }

            try {
                console.log(
                    'Bắt đầu kiểm tra trạng thái yêu thích cho tour:',
                    tour?.id
                )
                const response = await tourUserAPI.getUserWishlist(accessToken)
                console.log('Phản hồi từ getUserWishlist:', response.data)

                // Đảm bảo response.data là mảng, nếu không thì đặt về mảng rỗng
                const wishlistTours = Array.isArray(response.data)
                    ? response.data
                    : []
                const isTourLiked = wishlistTours.some(
                    (wishlistTour) => wishlistTour.tourId === tour.id
                )
                console.log(
                    `Tour ${tour.id} ${isTourLiked ? 'đã' : 'chưa'} được yêu thích`
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
                    setIsLiked(false) // Đặt isLiked về false nếu token không hợp lệ
                } else {
                    setIsLiked(false) // Đặt về false trong trường hợp lỗi khác
                }
            }
        }

        // Chỉ chạy nếu tour và tour.id hợp lệ
        if (tour && tour.id) {
            checkIfLiked()
        } else {
            console.error('Lỗi: tour hoặc tour.id không hợp lệ:', tour)
            setIsLiked(false) // Đặt isLiked về false nếu tour không hợp lệ
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

        // Kiểm tra tour và validTourIds
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

        // Ghi log để debug validTourIds
        console.log('Kiểm tra validTourIds:', {
            tourId: tour.id,
            validTourIds,
            isValidTour:
                Array.isArray(validTourIds) && validTourIds.includes(tour.id)
        })

        // Kiểm tra validTourIds và xác thực tour nếu cần
        let isTourValid =
            Array.isArray(validTourIds) && validTourIds.includes(tour.id)
        if (!isTourValid) {
            try {
                // Gọi API để xác thực tour nếu không có trong validTourIds
                console.log(
                    `Xác thực tour ${tour.id} qua API /api/TourUser/approved/${tour.id}`
                )
                await tourUserAPI.getApprovedTourDetail(tour.id, accessToken)
                isTourValid = true // Tour hợp lệ nếu API không trả về lỗi
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
                if (refreshTours) {
                    await refreshTours()
                }
                return
            }
        }

        try {
            setLoading(true)
            console.log(
                `Chuẩn bị ${isLiked ? 'xóa' : 'thêm'} tour với tourId: ${tour.id} vào wishlist`
            )
            if (isLiked) {
                const response = await tourUserAPI.removeFromWishlist(
                    tour.id,
                    accessToken
                )
                console.log('Phản hồi từ removeFromWishlist:', {
                    tourId: tour.id,
                    response: response.data
                })
                setIsLiked(false)
                Swal.fire({
                    icon: 'success',
                    title: 'Đã xóa',
                    text: 'Đã xóa tour khỏi danh sách yêu thích.',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else {
                const response = await tourUserAPI.addToWishlist(
                    tour.id,
                    accessToken
                )
                console.log('Phản hồi từ addToWishlist:', {
                    tourId: tour.id,
                    response: response.data
                })
                setIsLiked(true)
                Swal.fire({
                    icon: 'success',
                    title: 'Đã thêm',
                    text: 'Đã thêm tour vào danh sách yêu thích.',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
            if (refreshTours) {
                await refreshTours()
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
                if (refreshTours) {
                    await refreshTours()
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
            console.log(
                `Hoàn tất thao tác yêu thích cho tourId: ${tour.id}, trạng thái hiện tại: ${isLiked ? 'Đã thích' : 'Chưa thích'}`
            )
        }
    }

    // Kiểm tra và xử lý các trường null
    const imageUrl = tour.image && tour.image.trim() ? tour.image : null
    const tourName = tour.name || 'Tour không có tên'
    const tourPrice = tour.price || 'Giá không xác định'
    const tourAddress = tour.address || 'Địa chỉ không xác định'

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
                        e.target.style.display = 'none' // Ẩn ảnh nếu lỗi
                    }}
                />
            ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Không có ảnh</span>
                </div>
            )}
            <div className="p-5">
                <p className="text-lg font-semibold text-red-500">
                    {tourPrice}
                </p>
                <div className="flex items-center my-2">
                    <span className="text-yellow-500">★★★★★</span>
                    <span className="ml-2 text-gray-600">4.6</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800">{tourName}</h3>
                <p className="text-gray-600 text-sm">{tourAddress}</p>
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
