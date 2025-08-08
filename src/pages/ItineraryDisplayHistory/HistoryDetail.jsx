import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { travelFormAPI } from '@/apis'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { useAuth } from '@/AuthContext'
import RelatedToursSection from '@/pages/ItineraryPage/RelatedToursSection.jsx'

function HistoryDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { isLoggedIn, isAuthLoading } = useAuth()
    const [historyDetail, setHistoryDetail] = useState(null)
    const [relatedTours, setRelatedTours] = useState([])
    const [relatedTourMessage, setRelatedTourMessage] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
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
        }
    }, [isLoggedIn, isAuthLoading, navigate])

    const fetchHistoryDetail = async () => {
        if (!id || isNaN(id)) {
            console.error('ID không hợp lệ:', id)
            toast.error('ID lịch trình không hợp lệ.')
            navigate('/user/HistoryItinerary')
            return
        }

        const accessToken = localStorage.getItem('accessToken')

        if (!accessToken) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Vui lòng đăng nhập để xem chi tiết lịch trình.',
                confirmButtonColor: '#2563eb'
            })
            navigate('/signin')
            return
        }

        try {
            setLoading(true)
            const response = await travelFormAPI.getHistoryDetail(id)

            if (response.status === 200 && response.data) {
                const normalizedData = {
                    generatePlanId: id,
                    Id:
                        response.data.id ||
                        response.data.Id ||
                        response.data._id ||
                        id,
                    Destination:
                        response.data.destination ||
                        response.data.Destination ||
                        'Chưa xác định',
                    TravelDate:
                        response.data.travel_date ||
                        response.data.travelDate ||
                        response.data.TravelDate ||
                        null,
                    Days: response.data.days || response.data.Days || null,
                    Preferences:
                        response.data.preferences ||
                        response.data.Preferences ||
                        '',
                    Budget:
                        response.data.budget ||
                        response.data.budget_vnd ||
                        response.data.budgetVND ||
                        response.data.Budget ||
                        0,
                    TotalEstimatedCost:
                        response.data.total_estimated_cost ||
                        response.data.totalEstimatedCost ||
                        response.data.TotalEstimatedCost ||
                        0,
                    Transportation:
                        response.data.transportation ||
                        response.data.Transportation ||
                        'Chưa xác định',
                    DiningStyle:
                        response.data.dining_style ||
                        response.data.diningStyle ||
                        response.data.DiningStyle ||
                        'Chưa xác định',
                    GroupType:
                        response.data.group_type ||
                        response.data.groupType ||
                        response.data.GroupType ||
                        'Chưa xác định',
                    Accommodation:
                        response.data.accommodation ||
                        response.data.Accommodation ||
                        'Chưa xác định',
                    SuggestedAccommodation:
                        response.data.suggested_accommodation ||
                        response.data.suggestedAccommodation ||
                        response.data.SuggestedAccommodation ||
                        'Chưa xác định',
                    Itinerary:
                        response.data.itinerary || response.data.Itinerary || []
                }

                normalizedData.Itinerary = normalizedData.Itinerary.map(
                    (day) => ({
                        dayNumber: day.day || day.Day || day.dayNumber || 0,
                        title:
                            day.title ||
                            day.Title ||
                            `Ngày ${day.day || day.Day || day.dayNumber || 0}`,
                        dailyCost:
                            day.daily_cost ||
                            day.dailyCost ||
                            day.DailyCost ||
                            0,
                        weatherDescription:
                            day.weatherDescription || 'Không xác định',
                        temperatureCelsius: day.temperatureCelsius || 0,
                        weatherNote: day.weatherNote || 'Không có ghi chú',
                        activities: (
                            day.activities ||
                            day.Activities ||
                            []
                        ).map((activity) => ({
                            starttime:
                                activity.startTime ||
                                activity.start_time ||
                                activity.starttime ||
                                null,
                            endtime:
                                activity.endTime ||
                                activity.end_time ||
                                activity.endtime ||
                                null,
                            description:
                                activity.description ||
                                activity.Description ||
                                'Chưa xác định',
                            address:
                                activity.address || activity.Address || null,
                            transportation:
                                activity.transportation ||
                                activity.Transportation ||
                                null,
                            estimatedCost:
                                activity.estimated_cost ||
                                activity.estimatedCost ||
                                activity.EstimatedCost ||
                                0,
                            placeDetail:
                                activity.place_detail ||
                                activity.placeDetail ||
                                activity.PlaceDetail ||
                                null,
                            mapUrl:
                                activity.map_url ||
                                activity.mapUrl ||
                                activity.MapUrl ||
                                null,
                            image: activity.image || activity.Image || null
                        }))
                    })
                )

                setHistoryDetail(normalizedData)
                setRelatedTours(response.data.relatedTours || [])
                setRelatedTourMessage(response.data.relatedTourMessage || null)
            } else {
                throw new Error('Dữ liệu chi tiết lịch trình không hợp lệ.')
            }
        } catch (err) {
            const errorMessage =
                err.response?.status === 404
                    ? 'Không tìm thấy lịch trình với ID này.'
                    : err.response?.data?.error ||
                      err.message ||
                      'Không thể tải chi tiết lịch trình.'
            console.error('Lỗi API:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                headers: err.response?.headers,
                requestUrl: `api/AIGeneratePlan/GetHistoryDetailById/${id}`
            })
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
                navigate('/user/HistoryItinerary')
                toast.error('Không tìm thấy lịch trình.')
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchHistoryDetail()
    }, [id, navigate])

    const formatCurrency = (value) => {
        if (value == null || isNaN(value)) return 'Không xác định'
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

    const handleSaveAsTour = async () => {
        if (!historyDetail?.generatePlanId) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không có lịch trình để lưu thành tour.',
                showConfirmButton: false,
                timer: 1500
            })
            return
        }
        setSaving(true)
        try {
            const response = await travelFormAPI.saveTourFromGenerated(
                historyDetail.generatePlanId
            )
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Lịch trình đã được lưu thành tour.',
                showConfirmButton: false,
                timer: 1500
            })
            navigate('/user/mytour')
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text:
                    err.response?.data?.error ||
                    err.message ||
                    'Lỗi khi lưu tour.',
                showConfirmButton: false,
                timer: 1500
            })
        } finally {
            setSaving(false)
        }
    }

    const handleUpdateItinerary = () => {
        if (!historyDetail?.generatePlanId || !historyDetail?.Itinerary) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Dữ liệu lịch trình không đầy đủ để cập nhật.',
                showConfirmButton: false,
                timer: 1500
            })
            return
        }
        console.log(
            'Dữ liệu historyDetail trước khi chuyển hướng:',
            historyDetail
        )
        navigate('/user/chatbot-update', {
            state: { itineraryData: historyDetail }
        })
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow max-w-6xl w-full mx-auto p-8 bg-gradient-to-b from-blue-50 to-white rounded-2xl shadow-xl mt-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-extrabold text-blue-900 tracking-tight">
                        Lịch trình du lịch tại{' '}
                        {historyDetail?.Destination || 'Không xác định'}
                    </h2>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => navigate('/user/HistoryItinerary')}
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
                            Quay lại lịch sử
                        </button>
                        <button
                            onClick={handleUpdateItinerary}
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
                                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                />
                            </svg>
                            Cập nhật lịch trình
                        </button>
                        <button
                            onClick={handleSaveAsTour}
                            className="px-5 py-2 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg hover:from-green-700 hover:to-green-900 transition-all duration-300 shadow-md disabled:bg-green-400 disabled:cursor-not-allowed flex items-center"
                            disabled={saving || loading}
                        >
                            {saving ? (
                                <div className="flex items-center">
                                    <svg
                                        className="animate-spin h-5 w-5 text-white mr-2"
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
                                    Đang lưu...
                                </div>
                            ) : (
                                <>
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
                                            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                                        />
                                    </svg>
                                    Lưu thành tour
                                </>
                            )}
                        </button>
                    </div>
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
                ) : !historyDetail ? (
                    <div>
                        <h2 className="text-3xl font-extrabold text-blue-900 tracking-tight">
                            Không tìm thấy lịch trình
                        </h2>
                        <p className="text-gray-600 mt-4">
                            Vui lòng quay lại và chọn một lịch trình khác.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-white p-6 rounded-xl shadow-md">
                            <div>
                                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                                    Thông tin chuyến đi
                                </h3>
                                <div className="space-y-3">
                                    <p className="flex items-center text-gray-700">
                                        <span className="mr-2">📅</span>
                                        <strong>Ngày đi:&nbsp; </strong>
                                        {formatDate(historyDetail.TravelDate)}
                                    </p>
                                    <p className="flex items-center text-gray-700">
                                        <span className="mr-2">⏳</span>
                                        <strong>Số ngày:&nbsp; </strong>
                                        {historyDetail.Days || 'Không xác định'}
                                    </p>
                                    <p className="flex items-center text-gray-700">
                                        <span className="mr-2">💸</span>
                                        <strong>
                                            Tổng chi phí ước tính:&nbsp;{' '}
                                        </strong>
                                        <span className="text-blue-600">
                                            {formatCurrency(
                                                historyDetail.TotalEstimatedCost
                                            )}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                                    Sở thích & Chi tiết
                                </h3>
                                <div className="space-y-3">
                                    {historyDetail.Preferences &&
                                        historyDetail.Preferences !==
                                            'Chưa xác định' && (
                                            <p className="flex items-center text-gray-700">
                                                <span className="mr-2">🌟</span>
                                                <strong>
                                                    Sở thích:&nbsp;{' '}
                                                </strong>
                                                {historyDetail.Preferences.split(
                                                    ', '
                                                ).map((pref, index) => (
                                                    <span
                                                        key={`${pref}-${index}`}
                                                        className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full mr-2"
                                                    >
                                                        {pref}
                                                    </span>
                                                ))}
                                            </p>
                                        )}
                                    {historyDetail.DiningStyle &&
                                        historyDetail.DiningStyle !==
                                            'Chưa xác định' && (
                                            <p className="flex items-center text-gray-700">
                                                <span className="mr-2">🍽️</span>
                                                <strong>
                                                    Phong cách ăn
                                                    uống:&nbsp;{' '}
                                                </strong>
                                                {historyDetail.DiningStyle.split(
                                                    ', '
                                                ).map((style, index) => (
                                                    <span
                                                        key={`${style}-${index}`}
                                                        className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full mr-2"
                                                    >
                                                        {style}
                                                    </span>
                                                ))}
                                            </p>
                                        )}
                                    {historyDetail.Transportation &&
                                        historyDetail.Transportation !==
                                            'Chưa xác định' && (
                                            <p className="flex items-center text-gray-700">
                                                <span className="mr-2">🚗</span>
                                                <strong>
                                                    Phương tiện:&nbsp;{' '}
                                                </strong>
                                                {historyDetail.Transportation}
                                            </p>
                                        )}
                                    {historyDetail.GroupType &&
                                        historyDetail.GroupType !==
                                            'Chưa xác định' && (
                                            <p className="flex items-center text-gray-700">
                                                <span className="mr-2">👥</span>
                                                <strong>Nhóm:&nbsp; </strong>
                                                {historyDetail.GroupType}
                                            </p>
                                        )}
                                    {historyDetail.Accommodation &&
                                        historyDetail.Accommodation !==
                                            'Chưa xác định' && (
                                            <p className="flex items-center text-gray-700">
                                                <span className="mr-2">🏨</span>
                                                <strong>Chỗ ở:&nbsp; </strong>
                                                {historyDetail.Accommodation}
                                            </p>
                                        )}
                                    {historyDetail.SuggestedAccommodation &&
                                        historyDetail.SuggestedAccommodation !==
                                            'Chưa xác định' && (
                                            <p className="flex items-center text-gray-700">
                                                <span className="mr-2">🗺️</span>
                                                <strong>
                                                    Đề xuất chỗ ở:&nbsp;{' '}
                                                </strong>
                                                <a
                                                    href={
                                                        historyDetail.SuggestedAccommodation
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline hover:text-blue-800 transition-colors"
                                                >
                                                    Tìm trên Google Maps
                                                </a>
                                            </p>
                                        )}
                                </div>
                            </div>
                        </div>

                        <h3 className="text-2xl font-semibold text-blue-900 mb-6">
                            Chi tiết lịch trình
                        </h3>
                        <div className="space-y-6">
                            {historyDetail.Itinerary?.length > 0 ? (
                                historyDetail.Itinerary.map((day) => (
                                    <div
                                        key={day.dayNumber}
                                        className="bg-white rounded-xl shadow-md overflow-hidden"
                                    >
                                        <button
                                            onClick={() =>
                                                toggleDay(day.dayNumber)
                                            }
                                            className="w-full p-5 text-left bg-blue-100 hover:bg-blue-200 transition-colors duration-300 flex justify-between items-center"
                                        >
                                            <span className="font-semibold text-lg text-blue-900">
                                                {day.title} (Ngày{' '}
                                                {day.dayNumber})
                                            </span>
                                            <span
                                                className={`transition-transform duration-300 ${openDays[day.dayNumber] ? 'rotate-180' : ''}`}
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
                                        {openDays[day.dayNumber] && (
                                            <div className="p-6 animate-fade-in">
                                                <div className="space-y-3 mb-4">
                                                    <p className="text-gray-700">
                                                        <strong>
                                                            Chi phí ngày:{' '}
                                                        </strong>
                                                        <span className="text-blue-600">
                                                            {formatCurrency(
                                                                day.dailyCost
                                                            )}
                                                        </span>
                                                    </p>
                                                    <p className="text-gray-700">
                                                        <strong>
                                                            Thời tiết:{' '}
                                                        </strong>
                                                        {day.weatherDescription}
                                                    </p>
                                                    <p className="text-gray-700">
                                                        <strong>
                                                            Nhiệt độ:{' '}
                                                        </strong>
                                                        {day.temperatureCelsius.toFixed(
                                                            1
                                                        )}
                                                        °C
                                                    </p>
                                                    <p className="text-gray-700">
                                                        <strong>
                                                            Ghi chú thời
                                                            tiết:{' '}
                                                        </strong>
                                                        {day.weatherNote}
                                                    </p>
                                                </div>
                                                <ul className="relative space-y-6">
                                                    {day.activities?.length >
                                                    0 ? (
                                                        day.activities.map(
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
                                                                        day
                                                                            .activities
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
                                                                            {activity.starttime &&
                                                                            activity.endtime
                                                                                ? `${formatTime(activity.starttime)} - ${formatTime(activity.endtime)}`
                                                                                : 'Không xác định'}
                                                                        </p>
                                                                        <p className="text-gray-700">
                                                                            <strong>
                                                                                Hoạt
                                                                                động:{' '}
                                                                            </strong>
                                                                            {
                                                                                activity.description
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
                                                                                    activity.estimatedCost
                                                                                )}
                                                                            </span>
                                                                        </p>
                                                                        <p className="text-gray-700">
                                                                            <strong>
                                                                                Phương
                                                                                tiện:{' '}
                                                                            </strong>
                                                                            {activity.transportation ||
                                                                                'Không xác định'}
                                                                        </p>
                                                                        {activity.address && (
                                                                            <p className="text-gray-700">
                                                                                <strong>
                                                                                    Địa
                                                                                    chỉ:{' '}
                                                                                </strong>
                                                                                <a
                                                                                    href={
                                                                                        activity.mapUrl ||
                                                                                        '#'
                                                                                    }
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="text-blue-600 hover:underline hover:text-blue-800 transition-colors"
                                                                                >
                                                                                    {
                                                                                        activity.address
                                                                                    }
                                                                                </a>
                                                                            </p>
                                                                        )}
                                                                        <p className="text-gray-700">
                                                                            <strong>
                                                                                Chi
                                                                                tiết:{' '}
                                                                            </strong>
                                                                            {activity.placeDetail ||
                                                                                'Không xác định'}
                                                                        </p>

                                                                        {activity.image && (
                                                                            <img
                                                                                src={
                                                                                    activity.image
                                                                                }
                                                                                alt={
                                                                                    activity.description ||
                                                                                    'Activity'
                                                                                }
                                                                                className="w-full h-120 object-cover rounded-lg mb-4"
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
                                    Không có chi tiết lịch trình nào để hiển
                                    thị.
                                </p>
                            )}
                        </div>
                    </>
                )}
            </div>
            {!loading && historyDetail && (
                <RelatedToursSection
                    itineraryData={historyDetail}
                    relatedTours={relatedTours}
                    relatedTourMessage={relatedTourMessage}
                />
            )}
            <Footer />
        </div>
    )
}

export default HistoryDetail
