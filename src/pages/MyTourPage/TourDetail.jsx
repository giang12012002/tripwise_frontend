import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { travelFormAPI } from '@/apis'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import ReviewTourAI from './ReviewTourAI/index'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { useAuth } from '@/AuthContext'
import RelatedToursSection from '@/pages/ItineraryPage/RelatedToursSection.jsx'

function TourDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { isLoggedIn, isAuthLoading } = useAuth()
    const [tourDetail, setTourDetail] = useState(null)
    const [relatedTours, setRelatedTours] = useState([])
    const [relatedTourMessage, setRelatedTourMessage] = useState(null)
    const [loading, setLoading] = useState(true)
    const [openDays, setOpenDays] = useState({})

    const toggleDay = (dayNumber) => {
        setOpenDays((prev) => ({ ...prev, [dayNumber]: !prev[dayNumber] }))
    }

    useEffect(() => {
        if (!isAuthLoading && !isLoggedIn) {
            Swal.fire({
                icon: 'success',
                text: 'Đăng xuất thành công!',
                showConfirmButton: false,
                timer: 1800
            })
            navigate('/')
            return
        }

        const fetchTourDetail = async () => {
            if (!id) {
                toast.error('ID tour không hợp lệ.')
                navigate('/summary')
                return
            }

            const accessToken = localStorage.getItem('accessToken')
            if (!accessToken) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Vui lòng đăng nhập để xem chi tiết tour.',
                    confirmButtonColor: '#2563eb'
                })
                navigate('/signin')
                return
            }

            try {
                setLoading(true)
                const response = await travelFormAPI.getTourDetailById(id)

                if (
                    response.status === 200 &&
                    response.data.success &&
                    response.data.data
                ) {
                    const apiData = response.data.data
                    const normalizedData = {
                        TourId: id,
                        TourName: apiData.tourName || 'Tour Không Xác Định',
                        Description: apiData.description || 'Chưa xác định',
                        Duration: apiData.days || '1 ngày',
                        Location:
                            apiData.tourName
                                ?.split(' - ')[0]
                                ?.replace('Tour ', '') || 'Chưa xác định',
                        Price: apiData.totalEstimatedCost || 0,
                        Category: apiData.preferences || 'Chưa xác định',
                        TourNote: apiData.tourNote || 'Chưa xác định',
                        TourInfo: apiData.tourInfo || 'Chưa xác định',
                        CreatedDate: apiData.travelDate || null,
                        Itineraries: Array.isArray(apiData.itinerary)
                            ? apiData.itinerary.map((day, index) => ({
                                  ItineraryId: day.itineraryId || index + 1,
                                  ItineraryName:
                                      day.title ||
                                      `Ngày ${day.dayNumber || index + 1}`,
                                  DayNumber: day.dayNumber || index + 1,
                                  Description:
                                      day.description || 'Chưa xác định',
                                  DailyCost: day.dailyCost || 0,
                                  StartTime: null,
                                  EndTime: null,
                                  Category:
                                      apiData.preferences || 'Chưa xác định',
                                  Activities: Array.isArray(day.activities)
                                      ? day.activities.map(
                                            (activity, actIndex) => ({
                                                TourAttractionsId: actIndex + 1,
                                                TourAttractionsName:
                                                    activity.description ||
                                                    'Chưa xác định',
                                                Price:
                                                    activity.estimatedCost || 0,
                                                Location:
                                                    activity.address ||
                                                    'Chưa xác định',
                                                PlaceDetail:
                                                    activity.placeDetail ||
                                                    'Chưa xác định',
                                                MapUrl: activity.mapUrl || null,
                                                ImageUrl: activity.imageUrls
                                                    ? typeof activity.imageUrls ===
                                                      'string'
                                                        ? activity.imageUrls
                                                        : Array.isArray(
                                                                activity.imageUrls
                                                            ) &&
                                                            activity.imageUrls
                                                                .length > 0
                                                          ? activity
                                                                .imageUrls[0]
                                                          : null
                                                    : null,
                                                StartTime:
                                                    activity.startTime || null,
                                                EndTime:
                                                    activity.endTime || null,
                                                Description:
                                                    activity.description ||
                                                    'Chưa xác định'
                                            })
                                        )
                                      : []
                              }))
                            : []
                    }

                    setTourDetail(normalizedData)
                    setRelatedTours(apiData.relatedTours || [])
                    setRelatedTourMessage(apiData.relatedTourMessage || null)
                } else {
                    throw new Error('Dữ liệu chi tiết tour không hợp lệ.')
                }
            } catch (err) {
                const errorMessage =
                    err.response?.data?.error ||
                    err.message ||
                    'Không thể tải chi tiết tour.'
                console.error(
                    'Lỗi API chi tiết tour:',
                    err.response?.data,
                    err.message
                )
                toast.error(errorMessage)
                if (
                    err.response?.status === 401 ||
                    err.response?.data?.error?.includes('token')
                ) {
                    localStorage.removeItem('accessToken')
                    localStorage.removeItem('userId')
                    navigate('/signin')
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.',
                        confirmButtonColor: '#2563eb'
                    })
                } else if (err.response?.status === 404) {
                    navigate('/summary')
                    toast.error('Không tìm thấy tour.')
                }
            } finally {
                setLoading(false)
            }
        }

        fetchTourDetail()
    }, [id, navigate, isLoggedIn])

    const formatCurrency = (value) => {
        if (value == null || isNaN(value)) return '0 ₫'
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value)
    }

    const formatDate = (date) => {
        if (!date) return 'Không xác định'
        try {
            return new Date(date).toLocaleDateString('vi-VN')
        } catch {
            return 'Không xác định'
        }
    }

    const formatTime = (time) => {
        if (!time) return 'Không xác định'
        try {
            const [hours, minutes] = time.split(':')
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

    const formatPreferences = (category) => {
        if (
            !category ||
            typeof category !== 'string' ||
            category.trim() === ''
        ) {
            return <span className="text-gray-600">Không xác định</span>
        }
        const prefs = category.split(', ').filter((pref) => pref.trim())
        if (prefs.length === 0)
            return <span className="text-gray-600">Không xác định</span>
        return prefs.map((pref, index) => (
            <span
                key={`${pref}-${index}`}
                className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full mr-2"
            >
                {pref}
            </span>
        ))
    }

    useEffect(() => {
        // if (!loading && tourDetail) {
        // }
    }, [loading, tourDetail, relatedTours, relatedTourMessage])

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow max-w-6xl w-full mx-auto p-8 bg-gradient-to-b from-blue-50 to-white rounded-2xl shadow-xl mt-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-extrabold text-blue-900 tracking-tight">
                        {tourDetail?.TourName || 'Không xác định'}
                    </h2>

                    <ReviewTourAI tourId={id} />

                    <button
                        onClick={() => navigate('/user/myTour')}
                        className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-300 shadow-md flex items-center"
                    >
                        <svg
                            className="w-5 h-5 mr-2"
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
                        Quay lại danh sách tour
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center">
                        <svg
                            className="animate-spin h-8 w-8 text-blue-600"
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
                    </div>
                ) : !tourDetail ? (
                    <div>
                        <h2 className="text-3xl font-extrabold text-blue-900 tracking-tight">
                            Không tìm thấy tour
                        </h2>
                        <p className="text-gray-600 mt-4">
                            Vui lòng quay lại và chọn một tour khác.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-white p-6 rounded-xl shadow-md">
                            <div>
                                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                                    Thông tin tour
                                </h3>
                                <div className="space-y-3">
                                    <p className="flex items-center text-gray-700">
                                        <span className="mr-2">📍</span>
                                        <strong>Địa điểm:&nbsp; </strong>
                                        {tourDetail.Location}
                                    </p>
                                    <p className="flex items-center text-gray-700">
                                        <span className="mr-2">⏳</span>
                                        <strong>Số ngày:&nbsp; </strong>
                                        {tourDetail.Duration}
                                    </p>
                                    <p className="flex items-center text-gray-700">
                                        <span className="mr-2">💸</span>
                                        <strong>Giá:&nbsp; </strong>
                                        <span className="text-blue-600">
                                            {formatCurrency(tourDetail.Price)}
                                        </span>
                                    </p>
                                    {/*<p className="flex items-center text-gray-700">*/}
                                    {/*    <span className="mr-2">📅</span>*/}
                                    {/*    <strong>Ngày bắt đầu: </strong>*/}
                                    {/*    {formatDate(tourDetail.CreatedDate)}*/}
                                    {/*</p>*/}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                                    Chi tiết & Ghi chú
                                </h3>
                                <div className="space-y-3">
                                    <p className="flex items-center text-gray-700">
                                        <span className="mr-2">🌟</span>
                                        <strong>Sở thích:&nbsp; </strong>
                                        {formatPreferences(tourDetail.Category)}
                                    </p>
                                    <p className="flex items-center text-gray-700">
                                        <span className="mr-2">📌</span>
                                        <strong>Đề xuất chỗ ở:&nbsp; </strong>
                                        {tourDetail.TourNote ? (
                                            <a
                                                href={tourDetail.TourNote}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline hover:text-blue-800 transition-colors"
                                            >
                                                Tìm trên Google Maps
                                            </a>
                                        ) : (
                                            'Không xác định'
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-2xl font-semibold text-blue-900 mb-6">
                            Chi tiết hành trình
                        </h3>
                        <div className="space-y-6">
                            {tourDetail.Itineraries?.length > 0 ? (
                                tourDetail.Itineraries.map((itinerary) => (
                                    <div
                                        key={itinerary.ItineraryId}
                                        className="bg-white rounded-xl shadow-md overflow-hidden"
                                    >
                                        <button
                                            onClick={() =>
                                                toggleDay(itinerary.DayNumber)
                                            }
                                            className="w-full p-5 text-left bg-blue-100 hover:bg-blue-200 transition-colors duration-300 flex justify-between items-center"
                                        >
                                            <span className="font-semibold text-lg text-blue-900">
                                                {itinerary.ItineraryName} (Ngày{' '}
                                                {itinerary.DayNumber})
                                            </span>
                                            <span
                                                className={`transition-transform duration-300 ${
                                                    openDays[
                                                        itinerary.DayNumber
                                                    ]
                                                        ? 'rotate-180'
                                                        : ''
                                                }`}
                                            >
                                                <svg
                                                    className="w-6 h-6 text-blue-600"
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
                                        {openDays[itinerary.DayNumber] && (
                                            <div className="p-6 animate-fade-in">
                                                <div className="mb-4">
                                                    <p className="text-gray-700">
                                                        {itinerary.Description}
                                                    </p>
                                                    <p className="text-gray-700">
                                                        <strong>
                                                            Chi phí ước tính
                                                            ngày:{' '}
                                                        </strong>
                                                        <span className="text-blue-600">
                                                            {formatCurrency(
                                                                itinerary.DailyCost
                                                            )}
                                                        </span>
                                                    </p>
                                                </div>
                                                <ul className="relative space-y-6">
                                                    {itinerary.Activities
                                                        ?.length > 0 ? (
                                                        itinerary.Activities.map(
                                                            (
                                                                activity,
                                                                index
                                                            ) => (
                                                                <li
                                                                    key={index}
                                                                    className="pl-8 relative"
                                                                >
                                                                    <span className="absolute left-2 top-2 w-4 h-4 bg-blue-600 rounded-full"></span>
                                                                    {index <
                                                                        itinerary
                                                                            .Activities
                                                                            .length -
                                                                            1 && (
                                                                        <span className="absolute left-3 top-6 w-0.5 h-full bg-blue-200"></span>
                                                                    )}
                                                                    <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                                                                        <p className="text-gray-700">
                                                                            <strong>
                                                                                Thời
                                                                                gian:{' '}
                                                                            </strong>
                                                                            {activity.StartTime &&
                                                                            activity.EndTime
                                                                                ? `${formatTime(activity.StartTime)} - ${formatTime(activity.EndTime)}`
                                                                                : 'Không xác định'}
                                                                        </p>
                                                                        <p className="text-gray-700">
                                                                            <strong>
                                                                                Hoạt
                                                                                động:{' '}
                                                                            </strong>
                                                                            {
                                                                                activity.TourAttractionsName
                                                                            }
                                                                        </p>
                                                                        <p className="text-gray-700">
                                                                            <strong>
                                                                                Chi
                                                                                phí
                                                                                ước
                                                                                tính:{' '}
                                                                            </strong>
                                                                            <span className="text-blue-600">
                                                                                {formatCurrency(
                                                                                    activity.Price
                                                                                )}
                                                                            </span>
                                                                        </p>
                                                                        <p className="text-gray-700">
                                                                            <strong>
                                                                                Địa
                                                                                điểm:{' '}
                                                                            </strong>
                                                                            {
                                                                                activity.Location
                                                                            }
                                                                        </p>
                                                                        {activity.MapUrl && (
                                                                            <p className="text-gray-700">
                                                                                <strong>
                                                                                    Bản
                                                                                    đồ:{' '}
                                                                                </strong>
                                                                                <a
                                                                                    href={
                                                                                        activity.MapUrl
                                                                                    }
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="text-blue-600 hover:underline hover:text-blue-800 transition-colors"
                                                                                >
                                                                                    Xem
                                                                                    trên
                                                                                    Google
                                                                                    Maps
                                                                                </a>
                                                                            </p>
                                                                        )}
                                                                        {activity.ImageUrl && (
                                                                            <img
                                                                                src={
                                                                                    activity.ImageUrl
                                                                                }
                                                                                alt={
                                                                                    activity.TourAttractionsName ||
                                                                                    'Hoạt động'
                                                                                }
                                                                                className="w-full h-120 object-cover rounded-lg mt-4"
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </li>
                                                            )
                                                        )
                                                    ) : (
                                                        <p className="text-gray-600">
                                                            Không có hoạt động
                                                            nào cho ngày này.
                                                        </p>
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-600">
                                    Không có chi tiết hành trình nào để hiển
                                    thị.
                                </p>
                            )}
                        </div>
                    </>
                )}
            </div>
            {!loading && tourDetail && (
                <RelatedToursSection
                    itineraryData={tourDetail}
                    relatedTours={relatedTours}
                    relatedTourMessage={relatedTourMessage}
                />
            )}
            <Footer />
        </div>
    )
}

export default TourDetail
