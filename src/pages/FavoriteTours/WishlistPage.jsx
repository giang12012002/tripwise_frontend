import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/AuthContext'
import tourUserAPI from '@/apis/TourUserAPI'
import Swal from 'sweetalert2'
import TourCard from '@/pages/HomePage/TourCard.jsx'
import Header from '@/components/header/Header.jsx'
import Footer from '@/components/footer/Footer.jsx'
import TourFilter from '@/pages/AllToursPage/TourFilter.jsx'

const WishlistPage = () => {
    const [wishlistTours, setWishlistTours] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [priceFilter, setPriceFilter] = useState('')
    const [cityFilter, setCityFilter] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const { isLoggedIn, isAuthLoading } = useAuth()
    const navigate = useNavigate()
    const toursPerPage = 6

    const cities = [
        'Hà Nội',
        'TP. Hồ Chí Minh',
        'Đà Nẵng',
        'Hội An',
        'Huế',
        'Nha Trang',
        'Đà Lạt',
        'Phú Quốc',
        'Hạ Long',
        'Sapa'
    ]

    useEffect(() => {
        if (!isAuthLoading && !isLoggedIn) {
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
                setError('Vui lòng đăng nhập để xem danh sách yêu thích.')
                setLoading(false)
                navigate('/signin')
                return
            }

            try {
                const response = await tourUserAPI.getUserWishlist(accessToken)
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
                            price: tour.price || 0,
                            formattedPrice: tour.price
                                ? new Intl.NumberFormat('vi-VN', {
                                      style: 'currency',
                                      currency: 'VND'
                                  }).format(tour.price)
                                : '0 đ',
                            image:
                                tour.imageUrls?.[0] ||
                                'https://via.placeholder.com/150',
                            address: tour.location || 'Không xác định',
                            city: tour.location
                                ? extractCity(tour.location)
                                : 'Không xác định'
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
                    localStorage.removeItem('accessToken')
                    localStorage.removeItem('userId')
                    navigate('/signin')
                }
            } finally {
                setLoading(false)
            }
        }

        if (isLoggedIn && !isAuthLoading) {
            fetchWishlist()
        }
    }, [isLoggedIn, isAuthLoading, navigate])

    const extractCity = (location) => {
        const cityMatch = cities.find((city) =>
            location.toLowerCase().includes(city.toLowerCase())
        )
        return cityMatch || 'Không xác định'
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1)
    }

    const handleViewDetail = (tourId) => {
        if (!tourId || isNaN(tourId)) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'ID tour không hợp lệ. Vui lòng thử lại.',
                showConfirmButton: false,
                timer: 1800
            })
            return
        }
        navigate(`/tour-detail/${tourId}`)
    }

    const removeTourFromWishlist = (tourId) => {
        setWishlistTours((prevTours) =>
            prevTours.filter((tour) => tour.id !== tourId)
        )
    }

    const filteredTours = wishlistTours.filter((tour) => {
        const matchesSearch =
            tour.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tour.address?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesPrice =
            priceFilter === ''
                ? true
                : priceFilter === 'low'
                  ? tour.price < 5000000
                  : priceFilter === 'medium'
                    ? tour.price >= 5000000 && tour.price <= 10000000
                    : tour.price > 10000000
        const matchesCity =
            cityFilter === '' ||
            tour.city.toLowerCase() === cityFilter.toLowerCase()
        return matchesSearch && matchesPrice && matchesCity
    })

    const totalPages = Math.ceil(filteredTours.length / toursPerPage)
    const indexOfLastTour = currentPage * toursPerPage
    const indexOfFirstTour = indexOfLastTour - toursPerPage
    const currentTours = filteredTours.slice(indexOfFirstTour, indexOfLastTour)

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <div className="flex flex-1 w-full px-4 sm:px-6 lg:px-4 mt-6 mb-8">
                {/* TourFilter Sidebar */}
                <div className="hidden lg:block w-80 ml-2 mr-2 bg-white shadow-lg rounded-lg p-4">
                    <TourFilter
                        priceFilter={priceFilter}
                        setPriceFilter={setPriceFilter}
                        cityFilter={cityFilter}
                        setCityFilter={setCityFilter}
                    />
                </div>
                {/* Main Content */}
                <section className="flex-1 bg-white shadow-lg rounded-lg p-4 ml-2">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-800">
                            Danh Sách Yêu Thích
                        </h2>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên tour hoặc địa điểm..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full max-w-md p-2 mt-4 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    {loading || isAuthLoading ? (
                        <div className="col-span-full text-center bg-white p-6 rounded-xl shadow-lg">
                            <p className="text-lg text-gray-600">Đang tải...</p>
                        </div>
                    ) : error ? (
                        <div className="col-span-full text-center bg-red-100 p-4 rounded-md mb-6">
                            <p className="text-base text-red-700">{error}</p>
                        </div>
                    ) : filteredTours.length === 0 ? (
                        <div className="col-span-full text-center bg-gray-50 p-4 rounded-md">
                            <p className="text-base text-gray-600">
                                {searchTerm || priceFilter || cityFilter
                                    ? 'Không tìm thấy tour phù hợp với tiêu chí.'
                                    : 'Danh sách yêu thích của bạn đang trống.'}
                            </p>
                            <button
                                onClick={() => navigate('/alltour')}
                                className="mt-4 text-blue-600 font-semibold hover:underline hover:text-blue-800 transition-colors"
                            >
                                Khám phá các tour
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {currentTours.map((tour) => (
                                <TourCard
                                    key={tour.id}
                                    tour={{
                                        ...tour,
                                        price: tour.formattedPrice
                                    }}
                                    onViewDetail={() =>
                                        handleViewDetail(tour.id)
                                    }
                                    removeTourFromWishlist={
                                        removeTourFromWishlist
                                    }
                                />
                            ))}
                        </div>
                    )}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6 space-x-2">
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className="px-3 py-1 bg-gray-300 text-white rounded-md hover:bg-gray-400 disabled:opacity-50 flex items-center"
                            >
                                <svg
                                    className="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                                Trước
                            </button>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`px-3 py-1 rounded-md text-sm ${
                                        currentPage === index + 1
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center"
                            >
                                Sau
                                <svg
                                    className="w-4 h-4 ml-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                        </div>
                    )}
                </section>
            </div>
            <Footer />
        </div>
    )
}

export default WishlistPage
