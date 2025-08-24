import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import tourUserAPI from '@/apis/TourUserAPI'
import Swal from 'sweetalert2'
import ReviewTour from './ReviewTour'
import Bookings from './Bookings/index.jsx'
import { useAuth } from '@/AuthContext'
import Header from '@/components/header/Header.jsx'
import Footer from '@/components/footer/Footer.jsx'

const Index = () => {
    const { tourId } = useParams()
    const [tour, setTour] = useState(null)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [openDays, setOpenDays] = useState({})
    const [openSections, setOpenSections] = useState({})
    const navigate = useNavigate()
    const { isLoggedIn, isAuthLoading, token } = useAuth()
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    useEffect(() => {
        const savedScrollPosition = localStorage.getItem('scrollPosition')
        if (savedScrollPosition) {
            window.scrollTo(0, parseInt(savedScrollPosition, 10))
        }

        const handleBeforeUnload = () => {
            localStorage.setItem('scrollPosition', window.scrollY)
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        return () =>
            window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [])

    useEffect(() => {
        const fetchTour = async () => {
            if (!tourId || isNaN(parseInt(tourId))) {
                setError('ID tour không hợp lệ.')
                setIsLoading(false)
                return
            }
            try {
                const response = await tourUserAPI.getApprovedTourDetail(
                    tourId,
                    token
                )

                if (!response.data) {
                    setError('Không tìm thấy tour.')
                    setIsLoading(false)
                    return
                }
                // Chuẩn hóa dữ liệu: đảm bảo activity.imageUrls là chuỗi
                const normalizedTour = {
                    ...response.data,
                    itinerary: response.data.itinerary.map((day) => ({
                        ...day,
                        activities: day.activities.map((activity) => ({
                            ...activity,
                            imageUrls: Array.isArray(activity.imageUrls)
                                ? activity.imageUrls.length > 0
                                    ? activity.imageUrls[0]
                                    : ''
                                : activity.imageUrls || ''
                        }))
                    }))
                }
                setTour(normalizedTour)
                setIsLoading(false)
            } catch (err) {
                console.error('API Error (getApprovedTourDetail):', {
                    message: err.message,
                    response: err.response?.data,
                    status: err.response?.status,
                    errors:
                        err.response?.data?.errors || 'Không có chi tiết lỗi'
                })
                if (err.response?.status === 404) {
                    setError('Tour không tồn tại.')
                    setTimeout(() => {
                        navigate('/tour-list')
                    }, 1800)
                } else if (err.response?.status === 401) {
                    setError('Vui lòng đăng nhập để xem chi tiết tour.')
                } else {
                    setError('Không thể tải chi tiết tour. Vui lòng thử lại.')
                }
                setIsLoading(false)
            }
        }
        fetchTour()
    }, [tourId, navigate, token])

    const toggleDay = (dayNumber) => {
        setOpenDays((prev) => ({ ...prev, [dayNumber]: !prev[dayNumber] }))
    }

    const toggleSection = (sectionKey) => {
        setOpenSections((prev) => ({
            ...prev,
            [sectionKey]: !prev[sectionKey]
        }))
    }
    const formatDate = (dateString) => {
        if (!dateString) return 'Không xác định'
        try {
            const date = new Date(dateString)
            const hours = date.getHours()
            const period = hours < 12 ? 'sáng' : 'tối'

            const formattedDate = date.toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            })
            const formattedTime = date.toLocaleString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })

            return `${formattedTime} ${period} - ${formattedDate}`
        } catch {
            return dateString
        }
    }
    const formatTime = (time) => {
        if (!time) return 'Không xác định'
        try {
            const timeString = time.toString()
            const [hours, minutes] = timeString.split(':')
            const date = new Date()
            date.setHours(parseInt(hours), parseInt(minutes), 0)
            return date.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })
        } catch {
            return time
        }
    }

    const formatCurrency = (value) => {
        if (!value || isNaN(value)) return '0 đ'
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value)
    }

    const nextImage = () => {
        setCurrentImageIndex(
            (prev) => (prev + 1) % (tour?.imageUrls?.length || 1)
        )
    }

    const prevImage = () => {
        setCurrentImageIndex(
            (prev) =>
                (prev - 1 + (tour?.imageUrls?.length || 1)) %
                (tour?.imageUrls?.length || 1)
        )
    }

    useEffect(() => {
        if (tour?.imageUrls?.length > 1) {
            const interval = setInterval(nextImage, 4000)
            return () => clearInterval(interval)
        }
    }, [tour, currentImageIndex])
    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-indigo-100">
                <Header />
                <div className="flex-grow flex items-center justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-4 p-8 bg-white rounded-2xl shadow-2xl border border-blue-00">
                        <svg
                            className="animate-spin h-10 w-10 text-"
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
                        <span className="text-xl font-semibold text-gray-800">
                            Đang tải chi tiết tour...
                        </span>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-indigo-100">
                <Header />
                <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center bg-white p-10 rounded-2xl shadow-2xl w-full border border-red-200">
                        <p className="text-red-600 text-xl font-semibold">
                            {error}
                        </p>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    if (!tour) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-indigo-100">
                <Header />
                <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center bg-white p-10 rounded-2xl shadow-2xl w-full">
                        <p className="text-gray-700 text-xl font-medium">
                            Không tìm thấy tour.
                        </p>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-indigo-100">
            <Header />
            <div className="flex gap-4">
                <div className="w-3/4 bg-blue-100 p-4">
                    <div className="flex-grow py-4">
                        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                            {error && (
                                <p className="text-red-600 mb-6 text-center font-semibold text-lg bg-white p-4 rounded-lg shadow-md">
                                    {error}
                                </p>
                            )}
                            <div className="flex justify-end mb-2">
                                <ReviewTour
                                    tourId={tourId}
                                    travelDate={tour.travelDate}
                                    days={tour.days}
                                />
                            </div>
                            {tour.imageUrls && tour.imageUrls.length > 0 && (
                                <div className="flex flex-col md:flex-row bg-white p-6 rounded-2xl shadow-2xl mb-8 border border-blue-100">
                                    <div className="relative md:w-3/5">
                                        <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded text-sm font-bold">
                                            SALE
                                        </span>
                                        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                                            <img
                                                src={
                                                    tour.imageUrls[
                                                        currentImageIndex
                                                    ] || '/fallback-image.jpg'
                                                }
                                                alt={tour.tourName}
                                                className="w-full h-96 object-cover object-center transition-opacity duration-700 ease-in-out"
                                                style={{ aspectRatio: '16/9' }}
                                                key={currentImageIndex}
                                                width="672"
                                                height="378"
                                                onError={(e) => {
                                                    e.target.src =
                                                        '/fallback-image.jpg'
                                                    console.error(
                                                        `Failed to load main image: ${tour.imageUrls[currentImageIndex]}`
                                                    )
                                                }}
                                            />
                                        </div>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-2/5 transform -translate-y-1/2 bg-white bg-opacity-70 p-3 rounded-full text-indigo-800 hover:bg-opacity-100 transition-all shadow-md"
                                        >
                                            ←
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-2/5 transform -translate-y-1/2 bg-white bg-opacity-70 p-3 rounded-full text-indigo-800 hover:bg-opacity-100 transition-all shadow-md"
                                        >
                                            →
                                        </button>
                                        <div className="flex mt-4 space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                                            {tour.imageUrls.map(
                                                (url, index) => (
                                                    <img
                                                        key={index}
                                                        src={
                                                            url ||
                                                            '/fallback-image.jpg'
                                                        }
                                                        alt={`Thumbnail ${index + 1}`}
                                                        className={`w-24 h-24 object-cover object-center rounded-lg cursor-pointer transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-105 ${
                                                            currentImageIndex ===
                                                            index
                                                                ? 'border-4 border-indigo-500 opacity-100'
                                                                : 'opacity-70'
                                                        }`}
                                                        style={{
                                                            aspectRatio: '1/1'
                                                        }}
                                                        width="96"
                                                        height="96"
                                                        onClick={() =>
                                                            setCurrentImageIndex(
                                                                index
                                                            )
                                                        }
                                                        onError={(e) => {
                                                            e.target.src =
                                                                '/fallback-image.jpg'
                                                            console.error(
                                                                `Failed to load thumbnail image: ${url}`
                                                            )
                                                        }}
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>
                                    <div className="md:w-1/2 md:pl-8 mt-6 md:mt-0">
                                        <h2 className="text-3xl font-extrabold text-indigo-700 uppercase tracking-wide">
                                            {tour.tourName}
                                        </h2>
                                        <div className="flex items-center mt-3">
                                            <span className="text-3xl font-bold text-red-600">
                                                {formatCurrency(
                                                    tour.priceAdult
                                                )}
                                            </span>
                                        </div>
                                        <hr className="border-t border-gray-300 my-4" />
                                        <p className="text-gray-800 mb-3 flex items-center">
                                            <strong className="text-gray-900 font-semibold mr-2">
                                                ▶ Chủ đề:
                                            </strong>{' '}
                                            {tour.preferences || 'N/A'}
                                        </p>
                                        <hr className="border-t border-gray-300 my-4" />
                                        <p className="text-gray-800 mb-3 flex items-center">
                                            <strong className="text-gray-900 font-semibold mr-2">
                                                ▶ Ngày bắt đầu:
                                            </strong>{' '}
                                            {formatDate(tour.startTime)}
                                        </p>
                                        <hr className="border-t border-gray-300 my-4" />
                                        <p className="text-gray-800 mb-3 flex items-center">
                                            <strong className="text-gray-900 font-semibold mr-2">
                                                ▶ Thời gian:
                                            </strong>{' '}
                                            {tour.days} ngày
                                        </p>
                                        <hr className="border-t border-gray-300 my-4" />
                                        <p className="text-gray-800 mb-3 flex items-center">
                                            <strong className="text-gray-900 font-semibold mr-2">
                                                ▶ Chỗ còn trống:
                                            </strong>{' '}
                                            {tour.availableSlots}
                                        </p>
                                        {tour.note && (
                                            <>
                                                <hr className="border-t border-gray-300 my-4" />
                                                <p className="text-gray-800 mb-3 flex items-center">
                                                    <strong className="text-gray-900 font-semibold mr-2">
                                                        ▶ Thông báo:
                                                    </strong>{' '}
                                                    {tour.note}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-5 rounded-t-2xl font-bold uppercase text-center text-xl shadow-lg">
                                Mô tả Tour
                            </div>
                            <div className="mb-8 bg-white p-8 rounded-b-2xl shadow-2xl border-t-4 border-indigo-600">
                                <p className="text-gray-800 mb-4 leading-relaxed">
                                    {tour.description}
                                </p>
                                <hr className="border-t border-gray-300 my-4" />
                                <p className="text-gray-800 mb-4">
                                    <strong className="text-gray-900 font-semibold">
                                        Tour Trọn Gói bao gồm:
                                    </strong>{' '}
                                    {tour.tourNote || 'N/A'}
                                </p>
                                <p className="text-gray-800 mb-4">
                                    <strong className="text-gray-900 font-semibold">
                                        Trải nghiệm thú vị trong tour:
                                    </strong>{' '}
                                    {tour.tourInfo || 'N/A'}
                                </p>
                            </div>
                            <h3 className="text-3xl font-extrabold text-center uppercase text-indigo-700 mb-8 tracking-wide">
                                Lịch Trình Chi Tiết
                            </h3>
                            <div className="space-y-4">
                                {tour.itinerary.map((day) => {
                                    const dayImage = day.activities.find(
                                        (activity) => activity.imageUrls
                                    )
                                        ? day.activities.find(
                                              (activity) => activity.imageUrls
                                          ).imageUrls
                                        : tour.imageUrls[0]
                                    return (
                                        <div
                                            key={
                                                day.itineraryId || day.dayNumber
                                            }
                                            className="bg-white rounded-2xl shadow-lg overflow-hidden w-full transition-all duration-300 hover:shadow-xl"
                                        >
                                            <button
                                                onClick={() =>
                                                    toggleDay(day.dayNumber)
                                                }
                                                className="flex items-center w-full p-6 text-left bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 transition-colors duration-300"
                                            >
                                                {!openDays[day.dayNumber] &&
                                                    dayImage && (
                                                        <img
                                                            src={dayImage}
                                                            alt={`Day ${day.dayNumber}`}
                                                            className="w-48 h-32 object-cover rounded-lg mr-6 shadow-md"
                                                            onError={() =>
                                                                console.error(
                                                                    `Failed to load day image: ${dayImage}`
                                                                )
                                                            }
                                                        />
                                                    )}
                                                <div className="flex-grow">
                                                    <p className="text-md text-gray-600 font-medium">
                                                        Ngày {day.dayNumber}
                                                    </p>
                                                    <p className="text-xl font-semibold text-gray-900">
                                                        {day.title ||
                                                            `Ngày ${day.dayNumber}`}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`transition-transform duration-300 ${openDays[day.dayNumber] ? 'rotate-180' : ''}`}
                                                >
                                                    <svg
                                                        className="w-6 h-6 text-gray-600"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M19 9l-7 7-7-7"
                                                        />
                                                    </svg>
                                                </span>
                                            </button>
                                            {openDays[day.dayNumber] && (
                                                <div className="p-8 bg-gray-50 animate-fade-in">
                                                    <ul className="relative space-y-8">
                                                        {day.activities.map(
                                                            (
                                                                activity,
                                                                index
                                                            ) => (
                                                                <li
                                                                    key={
                                                                        activity.attractionId ||
                                                                        index
                                                                    }
                                                                    className="pl-10 relative"
                                                                >
                                                                    <span className="absolute left-3 top-3 w-5 h-5 bg-indigo-600 rounded-full shadow"></span>
                                                                    {index <
                                                                        day
                                                                            .activities
                                                                            .length -
                                                                            1 && (
                                                                        <span className="absolute left-4 top-8 w-0.5 h-full bg-indigo-200"></span>
                                                                    )}
                                                                    <div className="bg-white p-6 rounded-lg shadow-md">
                                                                        <p className="text-gray-800 mb-2 flex items-center">
                                                                            <strong className="text-gray-900 font-semibold mr-2">
                                                                                Thời
                                                                                gian:
                                                                            </strong>{' '}
                                                                            {activity.startTime &&
                                                                            activity.endTime
                                                                                ? `${formatTime(
                                                                                      activity.startTime
                                                                                  )} - ${formatTime(
                                                                                      activity.endTime
                                                                                  )}`
                                                                                : 'Không xác định'}
                                                                        </p>
                                                                        <p className="text-gray-800 mb-2">
                                                                            <strong className="text-gray-900 font-semibold">
                                                                                Địa
                                                                                điểm:
                                                                            </strong>{' '}
                                                                            {activity.address ||
                                                                                'Không xác định'}
                                                                        </p>
                                                                        <p className="text-gray-800 mb-2">
                                                                            <strong className="text-gray-900 font-semibold">
                                                                                Hoạt
                                                                                động:
                                                                            </strong>{' '}
                                                                            {activity.placeDetail ||
                                                                                'Không có mô tả'}
                                                                        </p>
                                                                        <p className="text-gray-800 mb-2">
                                                                            <strong className="text-gray-900 font-semibold">
                                                                                Chi
                                                                                tiết:
                                                                            </strong>{' '}
                                                                            {activity.description ||
                                                                                'Không có mô tả'}
                                                                        </p>
                                                                        {activity.imageUrls && (
                                                                            <div className="relative">
                                                                                <img
                                                                                    src={
                                                                                        activity.imageUrls
                                                                                    }
                                                                                    alt={`Activity ${
                                                                                        index +
                                                                                        1
                                                                                    } image`}
                                                                                    className="w-full h-full object-cover rounded-lg shadow-md scale-90 hover:scale-100 transition-transform duration-300"
                                                                                    onError={() =>
                                                                                        console.error(
                                                                                            `Failed to load activity image: ${activity.imageUrls}`
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="mt-12">
                                <h3 className="text-3xl font-extrabold text-center mb-8 uppercase text-indigo-700 tracking-wide">
                                    Những Thông Tin Cần Lưu Ý
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                                    <div className="space-y-4">
                                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                                            <button
                                                onClick={() =>
                                                    toggleSection(
                                                        'gia-tour-bao-gom'
                                                    )
                                                }
                                                className="flex justify-between items-center w-full p-6 text-left bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 transition-colors duration-300"
                                            >
                                                <span className="text-lg text-gray-900 font-medium">
                                                    Giá tour bao gồm
                                                </span>
                                                <span
                                                    className={`transition-transform duration-300 ${openSections['gia-tour-bao-gom'] ? 'rotate-180' : ''}`}
                                                >
                                                    <svg
                                                        className="w-6 h-6 text-gray-600"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M19 9l-7 7-7-7"
                                                        />
                                                    </svg>
                                                </span>
                                            </button>
                                            {openSections[
                                                'gia-tour-bao-gom'
                                            ] && (
                                                <div className="p-6 bg-gray-50">
                                                    <p className="text-gray-800 mb-2 ">
                                                        - Vé máy bay khứ hồi
                                                    </p>
                                                    <p className="text-gray-800 mb-2 ">
                                                        - Phòng khách sạn 4 sao
                                                        chuẩn địa phương, tiêu
                                                        chuẩn 2 khách/phòng
                                                    </p>
                                                    <p className="text-gray-800 mb-2 ">
                                                        - Bảo hiểm du lịch
                                                    </p>
                                                    <p className="text-gray-800 mb-2 ">
                                                        - Hướng dẫn viên nói đi
                                                        theo suốt tuyến
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                                            <button
                                                onClick={() =>
                                                    toggleSection(
                                                        'gia-tour-khong-bao-gom'
                                                    )
                                                }
                                                className="flex justify-between items-center w-full p-6 text-left bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 transition-colors duration-300"
                                            >
                                                <span className="text-lg text-gray-900 font-medium">
                                                    Giá tour không bao gồm
                                                </span>
                                                <span
                                                    className={`transition-transform duration-300 ${openSections['gia-tour-khong-bao-gom'] ? 'rotate-180' : ''}`}
                                                >
                                                    <svg
                                                        className="w-6 h-6 text-gray-600"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M19 9l-7 7-7-7"
                                                        />
                                                    </svg>
                                                </span>
                                            </button>
                                            {openSections[
                                                'gia-tour-khong-bao-gom'
                                            ] && (
                                                <div className="p-6 bg-gray-50">
                                                    <p className="text-gray-800">
                                                        <p className="text-gray-800 mb-2 ">
                                                            - Hành lý ký gửi quá
                                                            quy định.
                                                        </p>
                                                        <p className="text-gray-800 mb-2 ">
                                                            - Chi phí cá nhân,
                                                            hành lý quá cước và
                                                            các chi phí phát
                                                            sinh ngoài chương
                                                            trình.
                                                        </p>
                                                        <p className="text-gray-800 mb-2 ">
                                                            - Chi phí dời ngày
                                                            về, đổi hành trình
                                                            về (đổi chặng), nâng
                                                            hạng vé máy bay.
                                                        </p>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                                            <button
                                                onClick={() =>
                                                    toggleSection(
                                                        'luu-y-gia-tre-em'
                                                    )
                                                }
                                                className="flex justify-between items-center w-full p-6 text-left bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 transition-colors duration-300"
                                            >
                                                <span className="text-lg text-gray-900 font-medium">
                                                    Lưu ý giá trẻ em
                                                </span>
                                                <span
                                                    className={`transition-transform duration-300 ${openSections['luu-y-gia-tre-em'] ? 'rotate-180' : ''}`}
                                                >
                                                    <svg
                                                        className="w-6 h-6 text-gray-600"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M19 9l-7 7-7-7"
                                                        />
                                                    </svg>
                                                </span>
                                            </button>
                                            {openSections[
                                                'luu-y-gia-tre-em'
                                            ] && (
                                                <div className="p-6 bg-gray-50">
                                                    <p className="text-gray-800">
                                                        <p className="text-gray-800 mb-2 ">
                                                            Giá Trẻ Em:
                                                        </p>
                                                        <p className="text-gray-800 mb-2 ">
                                                            - Trẻ dưới 5 tuổi:
                                                            Giá như trên
                                                            website.
                                                        </p>
                                                        <p className="text-gray-800 mb-2 ">
                                                            - Trẻ từ 5 - dưới 10
                                                            tuổi: Giá như trên
                                                            website.
                                                        </p>
                                                        <p className="text-gray-800 mb-2 ">
                                                            - Trẻ từ 10 tuổi trở
                                                            lên: 100% giá người
                                                            lớn.
                                                        </p>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                                            <button
                                                onClick={() =>
                                                    toggleSection('huy-doi')
                                                }
                                                className="flex justify-between items-center w-full p-6 text-left bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 transition-colors duration-300"
                                            >
                                                <span className="text-lg text-gray-900 font-medium">
                                                    Lưu ý hủy tour
                                                </span>
                                                <span
                                                    className={`transition-transform duration-300 ${openSections['huy-doi'] ? 'rotate-180' : ''}`}
                                                >
                                                    <svg
                                                        className="w-6 h-6 text-gray-600"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M19 9l-7 7-7-7"
                                                        />
                                                    </svg>
                                                </span>
                                            </button>
                                            {openSections['huy-doi'] && (
                                                <div className="p-6 bg-gray-50">
                                                    <p className="text-gray-800">
                                                        - Sau khi đóng tiền, nếu
                                                        Quý khách muốn
                                                        chuyển/huỷ tour xin vui
                                                        lòng mang Vé Du Lịch đến
                                                        văn phòng đăng ký tour
                                                        để làm thủ tục
                                                        chuyển/huỷ tour và chịu
                                                        mất phí theo quy định
                                                        của TripWise. Không giải
                                                        quyết các trường hợp
                                                        liên hệ chuyển/huỷ tour
                                                        qua điện thoại.
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                                            <button
                                                onClick={() =>
                                                    toggleSection(
                                                        'cac-dieu-kien-huy-tour-doi-voi-ngay-thuong'
                                                    )
                                                }
                                                className="flex justify-between items-center w-full p-6 text-left bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 transition-colors duration-300"
                                            >
                                                <span className="text-lg text-gray-900 font-medium">
                                                    Điều kiện hủy tour
                                                </span>
                                                <span
                                                    className={`transition-transform duration-300 ${openSections['cac-dieu-kien-huy-tour-doi-voi-ngay-thuong'] ? 'rotate-180' : ''}`}
                                                >
                                                    <svg
                                                        className="w-6 h-6 text-gray-600"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M19 9l-7 7-7-7"
                                                        />
                                                    </svg>
                                                </span>
                                            </button>
                                            {openSections[
                                                'cac-dieu-kien-huy-tour-doi-voi-ngay-thuong'
                                            ] && (
                                                <div className="p-6 bg-gray-50">
                                                    <p className="text-gray-800 mb-2 ">
                                                        - Nếu hủy chuyến du lịch
                                                        trong vòng lớn hơn 19
                                                        ngày trước ngày khởi
                                                        hành: Chi phí huỷ tour
                                                        là 10% trên giá tour du
                                                        lịch.
                                                    </p>
                                                    <p className="text-gray-800 mb-2 ">
                                                        - Nếu hủy chuyến du lịch
                                                        trong vòng từ 15–19 ngày
                                                        trước ngày khởi hành:
                                                        Chi phí huỷ tour là 50%
                                                        trên giá tour du lịch.
                                                    </p>
                                                    <p className="text-gray-800 mb-2 ">
                                                        - Nếu hủy chuyến du lịch
                                                        trong vòng từ 07–14 ngày
                                                        trước ngày khởi hành:
                                                        Chi phí huỷ tour là 70%
                                                        trên giá vé du lịch.
                                                    </p>
                                                    <p className="text-gray-800 mb-2 ">
                                                        - Nếu hủy chuyến du lịch
                                                        trong vòng dưới 7 ngày
                                                        trước ngày khởi hành :
                                                        Chi phí huỷ tour là 100%
                                                        trên giá vé du lịch.
                                                    </p>
                                                    <p className="text-gray-800 mb-2 ">
                                                        - Lưu ý: không hỗ trợ
                                                        hủy tour đối với ngày lễ
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                                            <button
                                                onClick={() =>
                                                    toggleSection('lien-he')
                                                }
                                                className="flex justify-between items-center w-full p-6 text-left bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 transition-colors duration-300"
                                            >
                                                <span className="text-lg text-gray-900 font-medium">
                                                    Liên hệ
                                                </span>
                                                <span
                                                    className={`transition-transform duration-300 ${openSections['lien-he'] ? 'rotate-180' : ''}`}
                                                >
                                                    <svg
                                                        className="w-6 h-6 text-gray-600"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M19 9l-7 7-7-7"
                                                        />
                                                    </svg>
                                                </span>
                                            </button>
                                            {openSections['lien-he'] && (
                                                <div className="p-6 bg-gray-50">
                                                    <p className="text-gray-800">
                                                        <p className="text-gray-800 mb-2 ">
                                                            - Mọi chi tiết vui
                                                            lòng liên hệ:
                                                        </p>
                                                        <p className="text-gray-800 mb-2 ">
                                                            - Hòa Lạc, Việt Nam
                                                        </p>
                                                        <p className="text-gray-800 mb-2 ">
                                                            - Điện thoại:
                                                            0339.805.402 .
                                                        </p>
                                                        <p className="text-gray-800 mb-2 ">
                                                            - TRIPWISE KÍNH CHÚC
                                                            QUÝ KHÁCH MỘT CHUYẾN
                                                            DU LỊCH VUI VẺ!
                                                        </p>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                                            <button
                                                onClick={() =>
                                                    toggleSection(
                                                        'thong-tin-visa'
                                                    )
                                                }
                                                className="flex justify-between items-center w-full p-6 text-left bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 transition-colors duration-300"
                                            >
                                                <span className="text-lg text-gray-900 font-medium">
                                                    Hướng dẫn viên
                                                </span>
                                                <span
                                                    className={`transition-transform duration-300 ${openSections['huong-dan-vien'] ? 'rotate-180' : ''}`}
                                                >
                                                    <svg
                                                        className="w-6 h-6 text-gray-600"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M19 9l-7 7-7-7"
                                                        />
                                                    </svg>
                                                </span>
                                            </button>
                                            {openSections['thong-tin-visa'] && (
                                                <div className="p-6 bg-gray-50">
                                                    <p className="text-gray-800">
                                                        <p className="text-gray-800 mb-2 ">
                                                            - Hướng Dẫn Viên
                                                            (HDV) sẽ liên lạc
                                                            với Quý Khách khoảng
                                                            2-3 ngày trước khi
                                                            khởi hành để sắp xếp
                                                            giờ đón và cung cấp
                                                            các thông tin cần
                                                            thiết cho chuyển đi.
                                                        </p>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Booking */}
                <div className="w-1/4 p-4 sticky top-0 self-start">
                    <Bookings tour={tour} />
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Index
