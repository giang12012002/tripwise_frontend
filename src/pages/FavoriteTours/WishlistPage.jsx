import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/AuthContext'
import tourUserAPI from '@/apis/TourUserAPI'
import Swal from 'sweetalert2'
import TourCard from '@/pages/HomePage/TourCard.jsx'

const WishlistPage = () => {
    const [wishlistTours, setWishlistTours] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const { isLoggedIn, isAuthLoading } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        console.log('WishlistPage useEffect triggered', {
            isLoggedIn,
            isAuthLoading
        })

        if (!isAuthLoading && !isLoggedIn) {
            console.log(
                'Người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập'
            )
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Vui lòng đăng nhập để xem danh sách yêu thích.',
                showConfirmButton: false,
                timer: 1500
            })
            navigate('/signin')
            return
        }

        const fetchWishlist = async () => {
            const accessToken = localStorage.getItem('accessToken')
            if (!accessToken) {
                console.log('Thiếu accessToken trong localStorage')
                setError('Vui lòng đăng nhập để xem danh sách yêu thích.')
                setLoading(false)
                navigate('/signin')
                return
            }

            try {
                console.log('Đang lấy danh sách yêu thích với accessToken')
                const response = await tourUserAPI.getUserWishlist(accessToken)
                console.log('Phản hồi API Wishlist:', response.data)

                const rawWishlist = response.data || []
                const validTours = []

                for (const tour of rawWishlist) {
                    try {
                        const detailResponse =
                            await tourUserAPI.getApprovedTourDetail(
                                tour.tourId,
                                accessToken
                            )

                        validTours.push({
                            id: tour.tourId,
                            name: tour.tourName,
                            price: tour.price
                                ? new Intl.NumberFormat('vi-VN', {
                                      style: 'currency',
                                      currency: 'VND'
                                  }).format(tour.price)
                                : '0 đ',
                            image:
                                tour.imageUrls?.[0] ||
                                'https://via.placeholder.com/150',
                            address: tour.location || 'Không xác định'
                        })
                    } catch (e) {
                        console.warn(
                            `❗ Tour ${tour.tourId} không còn tồn tại. Bỏ qua.`
                        )
                    }
                }

                setWishlistTours(validTours)
            } catch (err) {
                console.error('Lỗi khi lấy danh sách yêu thích:', {
                    message: err.message,
                    response: err.response?.data,
                    status: err.response?.status
                })
                const errorMessage =
                    err.response?.status === 401 ||
                    err.response?.data?.error?.includes('token')
                        ? 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'
                        : 'Không thể tải danh sách yêu thích. Vui lòng thử lại.'
                setError(errorMessage)
                if (
                    err.response?.status === 401 ||
                    err.response?.data?.error?.includes('token')
                ) {
                    console.log(
                        'Token không hợp lệ hoặc hết hạn, chuyển hướng đến trang đăng nhập'
                    )
                    localStorage.removeItem('accessToken')
                    localStorage.removeItem('userId')
                    navigate('/signin')
                }
            } finally {
                setLoading(false)
            }
        }

        if (isLoggedIn && !isAuthLoading) {
            console.log('Gọi fetchWishlist với thông tin xác thực hợp lệ')
            fetchWishlist()
        } else {
            console.log(
                'Bỏ qua fetchWishlist do thông tin xác thực không hợp lệ',
                {
                    isLoggedIn,
                    isAuthLoading
                }
            )
        }
    }, [isLoggedIn, isAuthLoading, navigate])

    const handleViewDetail = (tourId) => {
        if (!tourId || isNaN(tourId)) {
            console.log('tourId không hợp lệ:', tourId)
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'ID tour không hợp lệ. Vui lòng thử lại.',
                showConfirmButton: false,
                timer: 1800
            })
            return
        }
        console.log('Chuyển hướng đến chi tiết tour:', tourId)
        navigate(`/tour-detail/${tourId}`)
    }

    return (
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-100 min-h-screen">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-blue-900 tracking-tight">
                    Danh Sách Yêu Thích
                </h2>
            </div>
            {loading || isAuthLoading ? (
                <div className="col-span-full text-center bg-white p-6 rounded-xl shadow-lg">
                    <p className="text-lg text-gray-600">Đang tải...</p>
                </div>
            ) : error ? (
                <div className="col-span-full text-center bg-white p-6 rounded-xl shadow-lg">
                    <p className="text-lg text-red-600">{error}</p>
                </div>
            ) : wishlistTours.length === 0 ? (
                <div className="col-span-full text-center bg-white p-6 rounded-xl shadow-lg">
                    <p className="text-lg text-gray-600">
                        Danh sách yêu thích của bạn đang trống.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 text-blue-600 font-semibold hover:underline hover:text-blue-800 transition-colors"
                    >
                        Khám phá các tour
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {wishlistTours.map((tour) => (
                        <TourCard
                            key={tour.id}
                            tour={tour}
                            onViewDetail={() => handleViewDetail(tour.id)}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}

export default WishlistPage
