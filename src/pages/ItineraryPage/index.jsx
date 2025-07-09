import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { travelFormAPI } from '@/apis'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'

function ItineraryDisplay() {
    const location = useLocation()
    const navigate = useNavigate()
    const itineraryData = location.state?.itineraryData || null
    const [openDays, setOpenDays] = useState({})
    const [saving, setSaving] = useState(false)

    const weatherTranslations = {
        'clear sky': 'trời quang đãng',
        'few clouds': 'ít mây',
        'scattered clouds': 'mây rải rác',
        'broken clouds': 'mây đứt quãng',
        'overcast clouds': 'trời nhiều mây',
        'light rain': 'mưa nhẹ',
        'moderate rain': 'mưa vừa',
        'heavy rain': 'mưa to',
        'light snow': 'tuyết nhẹ',
        snow: 'tuyết',
        'heavy snow': 'tuyết dày',
        mist: 'sương mù',
        fog: 'sương mù dày',
        thunderstorm: 'giông bão',
        drizzle: 'mưa phùn'
    }

    const translateWeatherDescription = (description) => {
        return (
            weatherTranslations[description?.toLowerCase()] ||
            description ||
            'mây rải rác'
        )
    }

    const formatCurrency = (value) => {
        if (!value || isNaN(value)) return '0 đ'
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value)
    }

    const toggleDay = (dayNumber) => {
        setOpenDays((prev) => ({ ...prev, [dayNumber]: !prev[dayNumber] }))
    }

    const handleSaveAsTour = async () => {
        if (!itineraryData?.generatePlanId) {
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
                itineraryData.generatePlanId
            )
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Lịch trình đã được lưu thành tour.',
                showConfirmButton: false,
                timer: 1500
            })
            navigate('/mytour')
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
        if (!itineraryData?.generatePlanId) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không có lịch trình để cập nhật.',
                showConfirmButton: false,
                timer: 1500
            })
            return
        }
        navigate('/chatbot-update', { state: { itineraryData } })
    }

    if (!itineraryData) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-grow max-w-6xl w-full mx-auto p-8 bg-gradient-to-b from-blue-50 to-white rounded-2xl shadow-xl mt-8">
                    <h2 className="text-3xl font-extrabold text-blue-900 tracking-tight">
                        Không tìm thấy lịch trình
                    </h2>
                    <p className="text-gray-600 mt-4">
                        Vui lòng tạo một lịch trình mới từ biểu mẫu du lịch.
                    </p>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow max-w-6xl w-full mx-auto p-8 bg-gradient-to-b from-blue-50 to-white rounded-2xl shadow-xl mt-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-extrabold text-blue-900 tracking-tight">
                        Lịch trình du lịch tại {itineraryData.destination}
                    </h2>
                    <div className="flex space-x-4">
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
                            disabled={saving}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-white p-6 rounded-xl shadow-md">
                    <div>
                        <h3 className="text-lg font-semibold text-blue-800 mb-3">
                            Thông tin chuyến đi
                        </h3>
                        <div className="space-y-3">
                            <p className="flex items-center text-gray-700">
                                <span className="mr-2">📅</span>
                                <strong>Ngày đi:&nbsp; </strong>
                                {itineraryData.travelDate
                                    ? new Date(
                                          itineraryData.travelDate
                                      ).toLocaleDateString('vi-VN')
                                    : 'Không xác định'}
                            </p>
                            <p className="flex items-center text-gray-700">
                                <span className="mr-2">⏳</span>
                                <strong>Số ngày:&nbsp; </strong>
                                {itineraryData.days || 'Không xác định'}
                            </p>
                            <p className="flex items-center text-gray-700">
                                <span className="mr-2">💸</span>
                                <strong>Tổng chi phí ước tính:&nbsp; </strong>
                                <span className="text-blue-600">
                                    {formatCurrency(
                                        itineraryData.totalEstimatedCost
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
                            {itineraryData.preferences && (
                                <p className="flex items-center text-gray-700">
                                    <span className="mr-2">🌟</span>
                                    <strong>Sở thích:&nbsp; </strong>
                                    {itineraryData.preferences
                                        .split(', ')
                                        .map((pref, index) => (
                                            <span
                                                key={index}
                                                className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full mr-2"
                                            >
                                                {pref}
                                            </span>
                                        ))}
                                </p>
                            )}
                            {itineraryData.diningStyle && (
                                <p className="flex items-center text-gray-700">
                                    <span className="mr-2">🍽️</span>
                                    <strong>Phong cách ăn uống:&nbsp; </strong>
                                    {itineraryData.diningStyle
                                        .split(', ')
                                        .map((style, index) => (
                                            <span
                                                key={index}
                                                className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full mr-2"
                                            >
                                                {style}
                                            </span>
                                        ))}
                                </p>
                            )}
                            {itineraryData.transportation && (
                                <p className="flex items-center text-gray-700">
                                    <span className="mr-2">🚗</span>
                                    <strong>Phương tiện:&nbsp; </strong>
                                    {itineraryData.transportation}
                                </p>
                            )}
                            {itineraryData.groupType && (
                                <p className="flex items-center text-gray-700">
                                    <span className="mr-2">👥</span>
                                    <strong>Nhóm:&nbsp; </strong>
                                    {itineraryData.groupType}
                                </p>
                            )}
                            {itineraryData.accommodation && (
                                <p className="flex items-center text-gray-700">
                                    <span className="mr-2">🏨</span>
                                    <strong>Chỗ ở:&nbsp; </strong>
                                    {itineraryData.accommodation}
                                </p>
                            )}
                            {itineraryData.suggestedAccommodation && (
                                <p className="flex items-center text-gray-700">
                                    <span className="mr-2">🗺️</span>
                                    <strong>Đề xuất chỗ ở:&nbsp; </strong>
                                    <a
                                        href={
                                            itineraryData.suggestedAccommodation
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
                    {itineraryData.itinerary &&
                    itineraryData.itinerary.length > 0 ? (
                        itineraryData.itinerary.map((day) => (
                            <div
                                key={day.dayNumber}
                                className="bg-white rounded-xl shadow-md overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleDay(day.dayNumber)}
                                    className="w-full p-5 text-left bg-blue-100 hover:bg-blue-200 transition-colors duration-300 flex justify-between items-center"
                                >
                                    <span className="font-semibold text-lg text-blue-900">
                                        {day.title || `Ngày ${day.dayNumber}`}{' '}
                                        (Ngày {day.dayNumber})
                                    </span>
                                    <span
                                        className={`transition-transform duration-300 ${
                                            openDays[day.dayNumber]
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
                                {openDays[day.dayNumber] && (
                                    <div className="p-6 animate-fade-in">
                                        <div className="mb-4 space-y-2">
                                            <p className="text-gray-700">
                                                <strong>Chi phí ngày: </strong>
                                                <span className="text-blue-600">
                                                    {formatCurrency(
                                                        day.dailyCost
                                                    )}
                                                </span>
                                            </p>
                                            <p className="text-gray-700">
                                                <strong>Thời tiết: </strong>
                                                {translateWeatherDescription(
                                                    day.weatherDescription
                                                )}
                                            </p>
                                            <p className="text-gray-700">
                                                <strong>Nhiệt độ: </strong>
                                                {day.temperatureCelsius
                                                    ? `${day.temperatureCelsius}°C`
                                                    : 'Không xác định'}
                                            </p>
                                            <p className="text-gray-700">
                                                <strong>
                                                    Ghi chú thời tiết:{' '}
                                                </strong>
                                                {day.weatherNote ||
                                                    'Không có ghi chú'}
                                            </p>
                                        </div>
                                        <ul className="relative space-y-6">
                                            {day.activities &&
                                            day.activities.length > 0 ? (
                                                day.activities.map(
                                                    (activity, index) => (
                                                        <li
                                                            key={index}
                                                            className="pl-8 relative"
                                                        >
                                                            <span className="absolute left-2 top-2 w-4 h-4 bg-blue-600 rounded-full"></span>
                                                            {index <
                                                                day.activities
                                                                    .length -
                                                                    1 && (
                                                                <span className="absolute left-3 top-6 w-0.5 h-full bg-blue-200"></span>
                                                            )}
                                                            <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                                                                {activity.image && (
                                                                    <img
                                                                        src={
                                                                            activity.image
                                                                        }
                                                                        alt={
                                                                            activity.description ||
                                                                            'Activity'
                                                                        }
                                                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                                                    />
                                                                )}
                                                                <p className="text-gray-700">
                                                                    <strong>
                                                                        Thời
                                                                        gian:{' '}
                                                                    </strong>
                                                                    {activity.starttime &&
                                                                    activity.endtime
                                                                        ? `${activity.starttime} - ${activity.endtime}`
                                                                        : 'Không xác định'}
                                                                </p>
                                                                <p className="text-gray-700">
                                                                    <strong>
                                                                        Hoạt
                                                                        động:{' '}
                                                                    </strong>
                                                                    {activity.description ||
                                                                        'Không xác định'}
                                                                </p>
                                                                <p className="text-gray-700">
                                                                    <strong>
                                                                        Chi phí
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
                                                            </div>
                                                        </li>
                                                    )
                                                )
                                            ) : (
                                                <p className="text-gray-600">
                                                    Không có hoạt động nào cho
                                                    ngày này.
                                                </p>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">
                            Không có chi tiết lịch trình nào để hiển thị.
                        </p>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default ItineraryDisplay
