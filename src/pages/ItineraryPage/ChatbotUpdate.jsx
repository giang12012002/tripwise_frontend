import React, { useState, useEffect, useRef } from 'react'
import Swal from 'sweetalert2'
import { travelFormAPI } from '@/apis'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import { useAuth } from '@/AuthContext'

function ChatbotUpdate() {
    const location = useLocation()
    const navigate = useNavigate()
    const { isLoggedIn, isAuthLoading } = useAuth()
    const itineraryData = location.state?.itineraryData || null

    const [messages, setMessages] = useState(() => {
        // Khôi phục lịch sử tin nhắn từ local storage dựa trên generatePlanId
        const savedMessages = localStorage.getItem(
            `chatHistory_${itineraryData?.generatePlanId}`
        )
        return savedMessages
            ? JSON.parse(savedMessages).map((msg) => ({
                  ...msg,
                  timestamp: new Date(msg.timestamp) // Chuyển đổi timestamp về Date
              }))
            : [
                  {
                      text: [
                          'Xin chào! Bạn muốn thay đổi gì trong lịch trình? Xem lịch trình hiện tại bên trái.',
                          'Để cập nhật một hoạt động cụ thể bạn cần ghi rõ thời gian và ngày của hoạt động, nhập: "ngày 1, 07:00 - 08:00 đi ăn bánh mì".'
                          // 'Để cập nhật một số ngày cụ thể (tối đa 3 ngày), nhập như: "Cập nhật ngày 4-6: [yêu cầu của bạn]".'
                      ],
                      sender: 'bot',
                      timestamp: new Date()
                  }
              ]
    })
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [openDays, setOpenDays] = useState({})
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        // Lưu messages vào local storage mỗi khi messages thay đổi
        if (itineraryData?.generatePlanId) {
            localStorage.setItem(
                `chatHistory_${itineraryData.generatePlanId}`,
                JSON.stringify(messages)
            )
        }
    }, [messages, itineraryData?.generatePlanId])

    const formatCurrency = (value) => {
        if (!value || isNaN(value)) return 'Không xác định'
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value)
    }

    const toggleDay = (dayNumber) => {
        setOpenDays((prev) => ({ ...prev, [dayNumber]: !prev[dayNumber] }))
    }

    const parseDayRange = (message) => {
        const regex =
            /(?:Cập nhật ngày|Ngày)\s*(\d+)(?:\s*-\s*|\s*đến\s*)(\d+)\s*:\s*(.+)/i
        const match = message.match(regex)
        if (match) {
            const startDay = parseInt(match[1], 10)
            const endDay = parseInt(match[2], 10)
            const userMessage = match[3].trim()
            const chunkSize = endDay - startDay + 1
            if (chunkSize <= 0 || chunkSize > 3 || startDay <= 0) {
                return { isChunkUpdate: false }
            }
            return { isChunkUpdate: true, startDay, chunkSize, userMessage }
        }
        return { isChunkUpdate: false, userMessage: message }
    }

    const handleSendMessage = async () => {
        if (!input.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Vui lòng nhập yêu cầu cập nhật.',
                showConfirmButton: false,
                timer: 1500
            })
            return
        }
        if (
            !itineraryData?.generatePlanId ||
            isNaN(itineraryData.generatePlanId)
        ) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'ID lịch trình không hợp lệ.',
                showConfirmButton: false,
                timer: 1500
            })
            return
        }

        const userMessage = {
            text: input,
            sender: 'user',
            timestamp: new Date()
        }
        setMessages((prev) => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            const {
                isChunkUpdate,
                startDay,
                chunkSize,
                userMessage: parsedMessage
            } = parseDayRange(input)
            let response

            if (isChunkUpdate) {
                console.log('Gửi yêu cầu cập nhật chunk:', {
                    generatePlanId: itineraryData.generatePlanId,
                    userMessage: parsedMessage,
                    startDay,
                    chunkSize
                })
                response = await travelFormAPI.updateItineraryChunk(
                    itineraryData.generatePlanId,
                    parsedMessage,
                    startDay,
                    chunkSize
                )
            } else {
                console.log('Gửi yêu cầu cập nhật toàn bộ:', {
                    generatePlanId: itineraryData.generatePlanId,
                    Message: input
                })
                response = await travelFormAPI.updateItinerary(
                    itineraryData.generatePlanId,
                    input
                )
            }

            const historyResponse = await travelFormAPI.getHistoryDetail(
                itineraryData.generatePlanId
            )
            console.log(
                'Dữ liệu từ getHistoryDetail:',
                JSON.stringify(historyResponse.data, null, 2)
            )

            const updatedItinerary = {
                generatePlanId: itineraryData.generatePlanId,
                destination:
                    historyResponse.data.destination || 'Không xác định',
                travelDate: historyResponse.data.travelDate || '',
                days: historyResponse.data.days || 0,
                preferences: historyResponse.data.preferences || '',
                transportation: historyResponse.data.transportation || '',
                diningStyle: historyResponse.data.diningStyle || '',
                groupType: historyResponse.data.groupType || '',
                accommodation: historyResponse.data.accommodation || '',
                totalEstimatedCost:
                    historyResponse.data.totalEstimatedCost || 0,
                budget: historyResponse.data.budget || 0,
                suggestedAccommodation:
                    historyResponse.data.suggestedAccommodation || '',
                itinerary:
                    historyResponse.data.itinerary?.map((day) => ({
                        dayNumber: day.day || day.dayNumber || 0,
                        title:
                            day.title ||
                            day.Title ||
                            `Ngày ${day.day || day.dayNumber}`,
                        dailyCost: day.dailyCost || day.DailyCost || 0,
                        weatherDescription:
                            day.weatherDescription || 'Không xác định',
                        temperatureCelsius: day.temperatureCelsius || 0,
                        weatherNote: day.weatherNote || 'Không có ghi chú',
                        activities:
                            day.activities?.map((activity) => ({
                                starttime:
                                    activity.startTime ||
                                    activity.StartTime ||
                                    activity.starttime ||
                                    '',
                                endtime:
                                    activity.endTime ||
                                    activity.EndTime ||
                                    activity.endtime ||
                                    '',
                                description:
                                    activity.description ||
                                    activity.Description ||
                                    '',
                                estimatedCost:
                                    activity.estimatedCost ||
                                    activity.EstimatedCost ||
                                    0,
                                transportation:
                                    activity.transportation ||
                                    activity.Transportation ||
                                    '',
                                address:
                                    activity.address || activity.Address || '',
                                placeDetail:
                                    activity.placeDetail ||
                                    activity.PlaceDetail ||
                                    '',
                                mapUrl:
                                    activity.mapUrl || activity.MapUrl || '',
                                image: activity.image || activity.Image || ''
                            })) || []
                    })) || [],
                hasMore: historyResponse.data.hasMore || false,
                nextStartDate: historyResponse.data.nextStartDate || null,
                previousAddresses: historyResponse.data.previousAddresses || []
            }

            console.log(
                'Dữ liệu sau ánh xạ:',
                JSON.stringify(updatedItinerary, null, 2)
            )

            setMessages((prev) => [
                ...prev,
                {
                    text: isChunkUpdate
                        ? `Lịch trình từ ngày ${startDay} đến ngày ${startDay + chunkSize - 1} đã được cập nhật! Bạn có muốn xem lịch trình mới hoặc tiếp tục chỉnh sửa?`
                        : 'Lịch trình đã được cập nhật! Bạn có muốn xem lịch trình mới hoặc tiếp tục chỉnh sửa?',
                    sender: 'bot',
                    timestamp: new Date(),
                    updatedItinerary
                }
            ])
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    text: 'Có lỗi xảy ra khi cập nhật lịch trình. Vui lòng thử lại.',
                    sender: 'bot',
                    timestamp: new Date()
                }
            ])
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text:
                    err.response?.data?.error ||
                    err.response?.data?.errors?.Message?.[0] ||
                    err.message ||
                    'Lỗi khi cập nhật lịch trình.',
                showConfirmButton: false,
                timer: 1500
            })
            console.error('API Error:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                errors: err.response?.data?.errors || 'Không có chi tiết lỗi'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleViewUpdatedItinerary = (updatedItinerary) => {
        console.log(
            'Dữ liệu truyền sang ItineraryDisplay:',
            JSON.stringify(updatedItinerary, null, 2)
        )
        navigate('/itinerary', { state: { itineraryData: updatedItinerary } })
    }

    const handleClearChatHistory = () => {
        Swal.fire({
            title: 'Xóa lịch sử trò chuyện?',
            text: 'Bạn có chắc muốn xóa toàn bộ lịch sử trò chuyện cho hành trình này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                setMessages([
                    {
                        text: 'Xin chào! Bạn muốn thay đổi gì trong lịch trình? Xem lịch trình hiện tại bên trái. Để cập nhật một số ngày cụ thể (tối đa 3 ngày), nhập như: "Cập nhật ngày 4-6: [yêu cầu của bạn]".',
                        sender: 'bot',
                        timestamp: new Date()
                    }
                ])
                localStorage.removeItem(
                    `chatHistory_${itineraryData.generatePlanId}`
                )
                Swal.fire({
                    icon: 'success',
                    title: 'Đã xóa',
                    text: 'Lịch sử trò chuyện đã được xóa.',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        })
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
                        Vui lòng quay lại trang lịch trình để tiếp tục.
                    </p>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow max-w-7xl w-full mx-auto p-10 bg-gradient-to-b from-blue-50 to-white rounded-2xl shadow-xl mt-10">
                <h2 className="text-3xl font-extrabold text-blue-900 tracking-tight mb-8 text-center">
                    Cập nhật lịch trình du lịch tại {itineraryData.destination}
                </h2>
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/2 bg-white rounded-xl shadow-md p-8 h-[80vh] overflow-y-auto">
                        <h3 className="text-xl font-semibold text-blue-800 mb-4">
                            Lịch trình hiện tại
                        </h3>
                        <hr className="border-t border-gray-300 mb-4" />
                        <div className="grid grid-cols-1 gap-8 mb-8">
                            <div>
                                <h4 className="text-lg font-semibold text-blue-800 mb-4">
                                    Thông tin chuyến đi
                                </h4>
                                <div className="space-y-4">
                                    <p className="flex items-center text-gray-700 text-sm leading-6">
                                        <span className="mr-2">📅</span>
                                        <strong>Ngày đi:&nbsp; </strong>
                                        {itineraryData.travelDate
                                            ? new Date(
                                                  itineraryData.travelDate
                                              ).toLocaleDateString('vi-VN')
                                            : 'Không xác định'}
                                    </p>
                                    <p className="flex items-center text-gray-700 text-sm leading-6">
                                        <span className="mr-2">⏳</span>
                                        <strong>Số ngày:&nbsp; </strong>
                                        {itineraryData.days || 'Không xác định'}
                                    </p>
                                    <p className="flex items-center text-gray-700 text-sm leading-6">
                                        <span className="mr-2">💸</span>
                                        <strong>
                                            Tổng chi phí ước tính:&nbsp;{' '}
                                        </strong>
                                        <span className="text-blue-600">
                                            {formatCurrency(
                                                itineraryData.totalEstimatedCost
                                            )}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div>
                                <hr className="border-t border-gray-300 mb-4" />
                                <h4 className="text-lg font-semibold text-blue-800 mb-4">
                                    Sở thích & Chi tiết
                                </h4>
                                <div className="space-y-4">
                                    {itineraryData.preferences &&
                                        itineraryData.preferences !==
                                            'Không xác định' && (
                                            <p className="flex items-center text-gray-700 text-sm leading-6">
                                                <span className="mr-2">🌟</span>
                                                <strong>
                                                    Sở thích:&nbsp;{' '}
                                                </strong>
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
                                    {itineraryData.diningStyle &&
                                        itineraryData.diningStyle !==
                                            'Không xác định' && (
                                            <p className="flex items-center text-gray-700 text-sm leading-6">
                                                <span className="mr-2">🍽️</span>
                                                <strong>
                                                    Phong cách ăn uống:{' '}
                                                </strong>
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
                                    {itineraryData.transportation &&
                                        itineraryData.transportation !==
                                            'Không xác định' && (
                                            <p className="flex items-center text-gray-700 text-sm leading-6">
                                                <span className="mr-2">🚗</span>
                                                <strong>
                                                    Phương tiện:&nbsp;{' '}
                                                </strong>
                                                {itineraryData.transportation}
                                            </p>
                                        )}
                                    {itineraryData.groupType &&
                                        itineraryData.groupType !==
                                            'Không xác định' && (
                                            <p className="flex items-center text-gray-700 text-sm leading-6">
                                                <span className="mr-2">👥</span>
                                                <strong>Nhóm:&nbsp; </strong>
                                                {itineraryData.groupType}
                                            </p>
                                        )}
                                    {itineraryData.accommodation &&
                                        itineraryData.accommodation !==
                                            'Không xác định' && (
                                            <p className="flex items-center text-gray-700 text-sm leading-6">
                                                <span className="mr-2">🏨</span>
                                                <strong>Chỗ ở:&nbsp; </strong>
                                                {itineraryData.accommodation}
                                            </p>
                                        )}
                                    {itineraryData.suggestedAccommodation &&
                                        itineraryData.suggestedAccommodation !==
                                            'Không xác định' && (
                                            <p className="flex items-center text-gray-700 text-sm leading-6">
                                                <span className="mr-2">🗺️</span>
                                                <strong>
                                                    Đề xuất chỗ ở:&nbsp;{' '}
                                                </strong>
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
                        <hr className="border-t border-gray-300 mb-4" />
                        <h4 className="text-lg font-semibold text-blue-800 mb-6">
                            Chi tiết lịch trình
                        </h4>
                        <div className="space-y-6">
                            {itineraryData.itinerary &&
                            itineraryData.itinerary.length > 0 ? (
                                itineraryData.itinerary.map((day) => (
                                    <div
                                        key={day.dayNumber}
                                        className="bg-white rounded-xl shadow-md overflow-hidden"
                                    >
                                        <button
                                            onClick={() =>
                                                toggleDay(day.dayNumber)
                                            }
                                            className="w-full p-6 text-left bg-blue-100 hover:bg-blue-200 transition-colors duration-300 flex justify-between items-center"
                                        >
                                            <span className="font-semibold text-base text-blue-900">
                                                {day.title ||
                                                    `Ngày ${day.dayNumber}`}{' '}
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
                                                    <p className="text-gray-700 text-sm leading-6">
                                                        <strong>
                                                            Chi phí ngày:{' '}
                                                        </strong>
                                                        <span className="text-blue-600 font-semibold">
                                                            {formatCurrency(
                                                                day.dailyCost
                                                            )}
                                                        </span>
                                                    </p>
                                                    <p className="text-gray-700 text-sm leading-6">
                                                        <strong>
                                                            Thời tiết:{' '}
                                                        </strong>
                                                        {day.weatherDescription ||
                                                            'Không xác định'}
                                                    </p>
                                                    <p className="text-gray-700 text-sm leading-6">
                                                        <strong>
                                                            Nhiệt độ:{' '}
                                                        </strong>
                                                        {day.temperatureCelsius
                                                            ? `${day.temperatureCelsius}°C`
                                                            : 'Không xác định'}
                                                    </p>
                                                    <p className="text-gray-700 text-sm leading-6">
                                                        <strong>
                                                            Ghi chú thời
                                                            tiết:{' '}
                                                        </strong>
                                                        {day.weatherNote ||
                                                            'Không có ghi chú'}
                                                    </p>
                                                </div>
                                                <ul className="relative space-y-6">
                                                    {day.activities &&
                                                    day.activities.length >
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
                                                                        <span className="absolute left-3 top-6 w-0.5 h-[calc(100%-1.5rem)] bg-blue-200"></span>
                                                                    )}
                                                                    <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
                                                                        {activity.image && (
                                                                            <img
                                                                                src={
                                                                                    activity.image
                                                                                }
                                                                                alt={
                                                                                    activity.description ||
                                                                                    'Activity'
                                                                                }
                                                                                className="w-full h-40 object-cover rounded-lg mb-6"
                                                                            />
                                                                        )}
                                                                        <p className="text-gray-700 text-sm leading-6">
                                                                            <strong>
                                                                                Thời
                                                                                gian:{' '}
                                                                            </strong>
                                                                            {activity.starttime &&
                                                                            activity.endtime
                                                                                ? `${activity.starttime} - ${activity.endtime}`
                                                                                : 'Không xác định'}
                                                                        </p>
                                                                        <p className="text-gray-700 text-sm leading-6">
                                                                            <strong>
                                                                                Hoạt
                                                                                động:{' '}
                                                                            </strong>
                                                                            {activity.description ||
                                                                                'Không xác định'}
                                                                        </p>
                                                                        <p className="text-gray-700 text-sm leading-6">
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
                                                                        <p className="text-gray-700 text-sm leading-6">
                                                                            <strong>
                                                                                Phương
                                                                                tiện:{' '}
                                                                            </strong>
                                                                            {activity.transportation ||
                                                                                'Không xác định'}
                                                                        </p>
                                                                        {activity.address && (
                                                                            <p className="text-gray-700 text-sm leading-6">
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
                                                                        <p className="text-gray-700 text-sm leading-6">
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
                                                        <p className="text-gray-600 text-sm leading-6">
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
                                <p className="text-gray-600 text-sm leading-6">
                                    Không có chi tiết lịch trình nào để hiển
                                    thị.
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 bg-white rounded-xl shadow-md p-8 h-[80vh] flex flex-col">
                        <h3 className="text-xl font-semibold text-blue-800 mb-4 text-center">
                            Cập nhật lịch trình cùng TripWiseAl
                        </h3>
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={handleClearChatHistory}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
                            >
                                Xóa lịch sử trò chuyện
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${
                                        msg.sender === 'user'
                                            ? 'justify-end'
                                            : 'justify-start'
                                    }`}
                                >
                                    <div
                                        className={`max-w-xs lg:max-w-md p-4 rounded-lg shadow-sm ${
                                            msg.sender === 'user'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        <p className="text-sm leading-6">
                                            {msg.text}
                                        </p>
                                        <p className="text-xs mt-1 opacity-70">
                                            {msg.timestamp.toLocaleTimeString(
                                                'vi-VN'
                                            )}
                                        </p>
                                        {msg.sender === 'bot' &&
                                            msg.updatedItinerary && (
                                                <button
                                                    onClick={() =>
                                                        handleViewUpdatedItinerary(
                                                            msg.updatedItinerary
                                                        )
                                                    }
                                                    className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
                                                >
                                                    Xem lịch trình mới
                                                </button>
                                            )}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="mt-4 flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) =>
                                    e.key === 'Enter' && handleSendMessage()
                                }
                                placeholder="VD: Cập nhật ngày 4-6: Thêm hoạt động tham quan chợ đêm..."
                                className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSendMessage}
                                className={`px-4 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-all duration-300 ${
                                    isLoading
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                }`}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
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
                                ) : (
                                    'Gửi'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default ChatbotUpdate
