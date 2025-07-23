import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { travelFormAPI } from '@/apis'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { useAuth } from '@/AuthContext'

function HistoryDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { isLoggedIn, isAuthLoading } = useAuth()
    const [historyDetail, setHistoryDetail] = useState(null)
    const [loading, setLoading] = useState(true)
    const [openDays, setOpenDays] = useState({})

    const toggleDay = (dayNumber) => {
        setOpenDays((prev) => ({ ...prev, [dayNumber]: !prev[dayNumber] }))
    }
    useEffect(() => {
        if (!isAuthLoading && !isLoggedIn) {
            Swal.fire({
                icon: 'success',
                // title: 'Thành công',
                text: 'Đăng xuất thành công!',
                showConfirmButton: false,
                timer: 1800
            })
            navigate('/')
        }
    }, [isLoggedIn, isAuthLoading, navigate])

    useEffect(() => {
        const fetchHistoryDetail = async () => {
            console.log('History Detail ID:', id)
            if (!id) {
                toast.error('ID lịch trình không hợp lệ.')
                navigate('/HistoryItinerary')
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
                const response = await travelFormAPI.getHistoryDetail(id)
                console.log('History Detail API Response:', response.data)
                if (response.status === 200 && response.data) {
                    // Normalize the API response
                    const normalizedData = {
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
                            response.data.itinerary ||
                            response.data.Itinerary ||
                            []
                    }

                    // Normalize itinerary items
                    normalizedData.Itinerary = normalizedData.Itinerary.map(
                        (day) => ({
                            Day: day.day || day.Day || day.dayNumber || 0,
                            Title:
                                day.title ||
                                day.Title ||
                                `Ngày ${day.day || day.Day || day.dayNumber || 0}`,
                            DailyCost:
                                day.daily_cost ||
                                day.dailyCost ||
                                day.DailyCost ||
                                0,
                            Activities: (
                                day.activities ||
                                day.Activities ||
                                []
                            ).map((activity) => ({
                                StartTime:
                                    activity.start_time ||
                                    activity.startTime ||
                                    activity.starttime ||
                                    null,
                                EndTime:
                                    activity.end_time ||
                                    activity.endTime ||
                                    activity.endtime ||
                                    null,
                                Description:
                                    activity.description ||
                                    activity.Description ||
                                    'Chưa xác định',
                                Address:
                                    activity.address ||
                                    activity.Address ||
                                    null,
                                Transportation:
                                    activity.transportation ||
                                    activity.Transportation ||
                                    null,
                                EstimatedCost:
                                    activity.estimated_cost ||
                                    activity.estimatedCost ||
                                    activity.EstimatedCost ||
                                    0,
                                PlaceDetail:
                                    activity.place_detail ||
                                    activity.placeDetail ||
                                    activity.PlaceDetail ||
                                    null,
                                MapUrl:
                                    activity.map_url ||
                                    activity.mapUrl ||
                                    activity.MapUrl ||
                                    null,
                                Image: activity.image || activity.Image || null
                            }))
                        })
                    )

                    console.log('Normalized History Detail:', normalizedData)
                    setHistoryDetail(normalizedData)
                } else {
                    throw new Error('Dữ liệu chi tiết lịch trình không hợp lệ.')
                }
            } catch (err) {
                const errorMessage =
                    err.response?.data?.error ||
                    err.message ||
                    'Không thể tải chi tiết lịch trình.'
                console.error(
                    'History Detail API Error:',
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
                    navigate('/HistoryItinerary')
                    toast.error('Không tìm thấy lịch trình.')
                }
            } finally {
                setLoading(false)
            }
        }

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

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow max-w-6xl w-full mx-auto p-8 bg-gradient-to-b from-blue-50 to-white rounded-2xl shadow-xl mt-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-extrabold text-blue-900 tracking-tight">
                        Lịch trình du lịch tại{' '}
                        {historyDetail?.Destination || 'Không xác định'}
                    </h2>
                    <button
                        onClick={() => navigate('/HistoryItinerary')}
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
                                        <strong>Ngày đi: </strong>
                                        {formatDate(historyDetail.TravelDate)}
                                    </p>
                                    <p className="flex items-center text-gray-700">
                                        <span className="mr-2">⏳</span>
                                        <strong>Số ngày: </strong>
                                        {historyDetail.Days || 'Không xác định'}
                                    </p>
                                    <p className="flex items-center text-gray-700">
                                        <span className="mr-2">💸</span>
                                        <strong>Tổng chi phí ước tính:</strong>
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
                                                <strong>Sở thích: </strong>
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
                                                    Phong cách ăn uống:
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
                                                <strong>Phương tiện: </strong>
                                                {historyDetail.Transportation}
                                            </p>
                                        )}
                                    {historyDetail.GroupType &&
                                        historyDetail.GroupType !==
                                            'Chưa xác định' && (
                                            <p className="flex items-center text-gray-700">
                                                <span className="mr-2">👥</span>
                                                <strong>Nhóm: </strong>
                                                {historyDetail.GroupType}
                                            </p>
                                        )}
                                    {historyDetail.Accommodation &&
                                        historyDetail.Accommodation !==
                                            'Chưa xác định' && (
                                            <p className="flex items-center text-gray-700">
                                                <span className="mr-2">🏨</span>
                                                <strong>Chỗ ở: </strong>
                                                {historyDetail.Accommodation}
                                            </p>
                                        )}
                                    {historyDetail.SuggestedAccommodation &&
                                        historyDetail.SuggestedAccommodation !==
                                            'Chưa xác định' && (
                                            <p className="flex items-center text-gray-700">
                                                <span className="mr-2">🗺️</span>
                                                <strong>Đề xuất chỗ ở:</strong>
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
                                        key={day.Day}
                                        className="bg-white rounded-xl shadow-md overflow-hidden"
                                    >
                                        <button
                                            onClick={() => toggleDay(day.Day)}
                                            className="w-full p-5 text-left bg-blue-100 hover:bg-blue-200 transition-colors duration-300 flex justify-between items-center"
                                        >
                                            <span className="font-semibold text-lg text-blue-900">
                                                {day.Title} (Ngày {day.Day})
                                            </span>
                                            <span
                                                className={`transition-transform duration-300 ${
                                                    openDays[day.Day]
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
                                        {openDays[day.Day] && (
                                            <div className="p-6 animate-fade-in">
                                                <p className="text-gray-700 mb-4">
                                                    <strong>
                                                        Chi phí ngày:
                                                    </strong>{' '}
                                                    <span className="text-blue-600">
                                                        {formatCurrency(
                                                            day.DailyCost
                                                        )}
                                                    </span>
                                                </p>
                                                <ul className="relative space-y-6">
                                                    {day.Activities?.length >
                                                    0 ? (
                                                        day.Activities.map(
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
                                                                            .Activities
                                                                            .length -
                                                                            1 && (
                                                                        <span className="absolute left-3 top-6 w-0.5 h-full bg-blue-200"></span>
                                                                    )}
                                                                    <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                                                                        {activity.Image && (
                                                                            <img
                                                                                src={
                                                                                    activity.Image
                                                                                }
                                                                                alt={
                                                                                    activity.Description ||
                                                                                    'Activity'
                                                                                }
                                                                                className="w-full h-48 object-cover rounded-lg mb-4"
                                                                            />
                                                                        )}
                                                                        <p className="text-gray-700">
                                                                            <strong>
                                                                                Thời
                                                                                gian:
                                                                            </strong>{' '}
                                                                            {activity.StartTime &&
                                                                            activity.EndTime
                                                                                ? `${formatTime(activity.StartTime)} - ${formatTime(activity.EndTime)}`
                                                                                : 'Không xác định'}
                                                                        </p>
                                                                        <p className="text-gray-700">
                                                                            <strong>
                                                                                Hoạt
                                                                                động:
                                                                            </strong>{' '}
                                                                            {
                                                                                activity.Description
                                                                            }
                                                                        </p>
                                                                        <p className="text-gray-700">
                                                                            <strong>
                                                                                Chi
                                                                                phí
                                                                                ước
                                                                                tính:
                                                                            </strong>{' '}
                                                                            <span className="text-blue-600">
                                                                                {formatCurrency(
                                                                                    activity.EstimatedCost
                                                                                )}
                                                                            </span>
                                                                        </p>
                                                                        <p className="text-gray-700">
                                                                            <strong>
                                                                                Phương
                                                                                tiện:
                                                                            </strong>{' '}
                                                                            {activity.Transportation ||
                                                                                'Không xác định'}
                                                                        </p>
                                                                        {activity.Address && (
                                                                            <p className="text-gray-700">
                                                                                <strong>
                                                                                    Địa
                                                                                    chỉ:
                                                                                </strong>{' '}
                                                                                <a
                                                                                    href={
                                                                                        activity.MapUrl ||
                                                                                        '#'
                                                                                    }
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="text-blue-600 hover:underline hover:text-blue-800 transition-colors"
                                                                                >
                                                                                    {
                                                                                        activity.Address
                                                                                    }
                                                                                </a>
                                                                            </p>
                                                                        )}
                                                                        <p className="text-gray-700">
                                                                            <strong>
                                                                                Chi
                                                                                tiết:
                                                                            </strong>{' '}
                                                                            {activity.PlaceDetail ||
                                                                                'Không xác định'}
                                                                        </p>
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
            <Footer />
        </div>
    )
}

export default HistoryDetail
