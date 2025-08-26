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

    const handleBack = () => {
        navigate(-1) // Navigate to the previous page
    }
    // Hàm chuẩn hóa dữ liệu (giữ nguyên)
    const normalizeItineraryData = (data) => {
        if (!data) return null
        return {
            generatePlanId: data.generatePlanId || data.Id || data._id || '',
            destination:
                data.destination || data.Destination || 'Không xác định',
            travelDate:
                data.travelDate || data.TravelDate || data.travel_date || null,
            days: data.days || data.Days || 0,
            preferences:
                data.preferences || data.Preferences || 'Không xác định',
            budget:
                data.budget ||
                data.Budget ||
                data.budget_vnd ||
                data.budgetVND ||
                0,
            totalEstimatedCost:
                data.totalEstimatedCost ||
                data.TotalEstimatedCost ||
                data.total_estimated_cost ||
                0,
            transportation:
                data.transportation || data.Transportation || 'Không xác định',
            diningStyle:
                data.diningStyle ||
                data.DiningStyle ||
                data.dining_style ||
                'Không xác định',
            groupType:
                data.groupType ||
                data.GroupType ||
                data.group_type ||
                'Không xác định',
            accommodation:
                data.accommodation || data.Accommodation || 'Không xác định',
            suggestedAccommodation:
                data.suggestedAccommodation ||
                data.SuggestedAccommodation ||
                data.suggested_accommodation ||
                'Không xác định',
            itinerary: (data.itinerary || data.Itinerary || []).map((day) => ({
                dayNumber: day.day || day.Day || day.dayNumber || 0,
                title:
                    day.title ||
                    day.Title ||
                    `Ngày ${day.day || day.dayNumber || 0}`,
                dailyCost:
                    day.dailyCost || day.DailyCost || day.daily_cost || 0,
                weatherDescription: day.weatherDescription || 'Không xác định',
                temperatureCelsius: day.temperatureCelsius || 0,
                weatherNote: day.weatherNote || 'Không có ghi chú',
                activities: (day.activities || day.Activities || []).map(
                    (activity) => ({
                        starttime:
                            activity.starttime ||
                            activity.startTime ||
                            activity.start_time ||
                            '',
                        endtime:
                            activity.endtime ||
                            activity.endTime ||
                            activity.end_time ||
                            '',
                        description:
                            activity.description ||
                            activity.Description ||
                            'Không xác định',
                        estimatedCost:
                            activity.estimatedCost ||
                            activity.EstimatedCost ||
                            activity.estimated_cost ||
                            0,
                        transportation:
                            activity.transportation ||
                            activity.Transportation ||
                            'Không xác định',
                        address: activity.address || activity.Address || '',
                        placeDetail:
                            activity.placeDetail ||
                            activity.PlaceDetail ||
                            activity.place_detail ||
                            '',
                        mapUrl:
                            activity.mapUrl ||
                            activity.MapUrl ||
                            activity.map_url ||
                            '',
                        image: activity.image || activity.Image || ''
                    })
                )
            })),
            hasMore: data.hasMore || false,
            nextStartDate: data.nextStartDate || null,
            previousAddresses: data.previousAddresses || [],
            relatedTours: data.relatedTours || [],
            relatedTourMessage: data.relatedTourMessage || null
        }
    }

    const [normalizedItineraryData, setNormalizedItineraryData] = useState(
        normalizeItineraryData(itineraryData)
    )
    const [messages, setMessages] = useState([
        {
            text: [
                'Cách 1 (Tối ưu): Tích chọn hoạt động cần chỉnh → nhập yêu cầu.\n     Ví dụ: "Chuyển sang 9h".',
                'Cách 2: Nếu không tích chọn hoạt động, hãy ghi rõ ngày, giờ và nội dung chỉnh sửa.\n   Ví dụ: "Ngày 1, 6h, đổi sang đi chơi".'
            ],
            sender: 'bot',
            timestamp: new Date()
        }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [openDays, setOpenDays] = useState({})
    const [selectedActivity, setSelectedActivity] = useState(null)
    const [recentlyUpdatedActivities, setRecentlyUpdatedActivities] = useState(
        []
    ) // Mảng lưu các hoạt động đã thay đổi
    const messagesEndRef = useRef(null)

    const messagesContainerRef = useRef(null)

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop =
                messagesContainerRef.current.scrollHeight
        }
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
        if (messages.length > 1) {
            scrollToBottom()
        }
    }, [messages])

    const formatCurrency = (value) => {
        if (!value || isNaN(value)) return '0 ₫'
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value)
    }

    const toggleDay = (dayNumber) => {
        setOpenDays((prev) => ({ ...prev, [dayNumber]: !prev[dayNumber] }))
    }

    const handleActivitySelection = (dayNumber, activityIndex, description) => {
        if (
            selectedActivity?.dayNumber === dayNumber &&
            selectedActivity?.activityIndex === activityIndex
        ) {
            setSelectedActivity(null)
        } else {
            setSelectedActivity({
                dayNumber,
                activityIndex,
                selectedActivityDescription: description
            })
        }
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
            !normalizedItineraryData?.generatePlanId ||
            isNaN(normalizedItineraryData.generatePlanId)
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
            let botMessage = ''
            let hasChanges = false
            let updateSummary = ''
            let changeDetails = ''
            let updatedActivities = []

            const isDeleteRequest = /xóa|delete|remove/i.test(input)
            const isAddRequest = /thêm|add|new|thêm hoạt động/i.test(input)

            if (isChunkUpdate) {
                response = await travelFormAPI.updateItineraryChunk(
                    normalizedItineraryData.generatePlanId,
                    parsedMessage,
                    startDay,
                    chunkSize
                )
                hasChanges = response.data.hasChanges || false
                updateSummary =
                    response.data.updateSummary ||
                    `Hành trình từ ngày ${startDay} đến ngày ${startDay + chunkSize - 1} đã được cập nhật!`
                changeDetails = response.data.changeDetails || ''
                botMessage = hasChanges
                    ? updateSummary
                    : `Hành trình từ ngày ${startDay} đến ngày ${startDay + chunkSize - 1} không có thay đổi. Bạn có thể thử yêu cầu cụ thể hơn.`

                // Xác định các hoạt động đã thay đổi hoặc mới trong khoảng ngày
                if (hasChanges) {
                    const historyResponse =
                        await travelFormAPI.getHistoryDetail(
                            normalizedItineraryData.generatePlanId
                        )
                    const newItinerary = historyResponse.data.itinerary || []
                    newItinerary.forEach((day) => {
                        if (
                            day.dayNumber >= startDay &&
                            day.dayNumber < startDay + chunkSize
                        ) {
                            day.activities.forEach((_, index) => {
                                updatedActivities.push({
                                    dayNumber: day.dayNumber,
                                    activityIndex: index
                                })
                            })
                        }
                    })
                }
            } else {
                response = await travelFormAPI.updateItinerary(
                    normalizedItineraryData.generatePlanId,
                    input,
                    selectedActivity?.dayNumber,
                    selectedActivity?.activityIndex,
                    selectedActivity?.selectedActivityDescription
                )
                hasChanges = response.data.hasChanges || false
                updateSummary = response.data.updateSummary || ''
                changeDetails = response.data.changeDetails || ''

                if (selectedActivity) {
                    if (hasChanges) {
                        updatedActivities.push({
                            dayNumber: selectedActivity.dayNumber,
                            activityIndex: selectedActivity.activityIndex
                        })
                        if (isAddRequest) {
                            const historyResponse =
                                await travelFormAPI.getHistoryDetail(
                                    normalizedItineraryData.generatePlanId
                                )
                            const newDay = historyResponse.data.itinerary.find(
                                (day) =>
                                    day.dayNumber === selectedActivity.dayNumber
                            )
                            if (
                                newDay &&
                                newDay.activities.length >
                                    normalizedItineraryData.itinerary.find(
                                        (day) =>
                                            day.dayNumber ===
                                            selectedActivity.dayNumber
                                    )?.activities.length
                            ) {
                                const newActivityIndex =
                                    newDay.activities.length - 1
                                updatedActivities.push({
                                    dayNumber: selectedActivity.dayNumber,
                                    activityIndex: newActivityIndex
                                })
                            }
                        }
                    }
                    botMessage = hasChanges
                        ? isDeleteRequest
                            ? `Hoạt động "${selectedActivity.selectedActivityDescription}" ngày ${selectedActivity.dayNumber} đã được xóa!`
                            : isAddRequest
                              ? `Hoạt động mới đã được thêm vào ngày ${selectedActivity.dayNumber}!`
                              : `Hoạt động đã được cập nhật!`
                        : isDeleteRequest
                          ? `Hoạt động "${selectedActivity.selectedActivityDescription}" ngày ${selectedActivity.dayNumber} không thể xóa. Vui lòng thử yêu cầu cụ thể hơn.`
                          : isAddRequest
                            ? `Không thể thêm hoạt động mới vào ngày ${selectedActivity.dayNumber}. Vui lòng thử yêu cầu cụ thể hơn.`
                            : `Hoạt động "${selectedActivity.selectedActivityDescription}" ngày ${selectedActivity.dayNumber} không có thay đổi. Vui lòng thử yêu cầu cụ thể hơn.`
                } else {
                    botMessage = hasChanges
                        ? updateSummary || 'Hành trình đã được cập nhật!'
                        : response.data.userGuidance
                    // || 'Lịch trình hiện tại đã bao gồm những gì bạn muốn rồi, không cần điều chỉnh thêm! 😊'

                    // Nếu không chọn hoạt động cụ thể, kiểm tra toàn bộ lịch trình
                    if (hasChanges) {
                        const historyResponse =
                            await travelFormAPI.getHistoryDetail(
                                normalizedItineraryData.generatePlanId
                            )
                        const newItinerary =
                            historyResponse.data.itinerary || []
                        newItinerary.forEach((newDay) => {
                            const oldDay =
                                normalizedItineraryData.itinerary.find(
                                    (d) => d.dayNumber === newDay.dayNumber
                                )
                            newDay.activities.forEach((activity, index) => {
                                const oldActivity = oldDay?.activities[index]
                                if (
                                    !oldActivity ||
                                    JSON.stringify(oldActivity) !==
                                        JSON.stringify(activity)
                                ) {
                                    updatedActivities.push({
                                        dayNumber: newDay.dayNumber,
                                        activityIndex: index
                                    })
                                }
                            })
                            // Kiểm tra các hoạt động mới
                            if (
                                newDay.activities.length >
                                (oldDay?.activities.length || 0)
                            ) {
                                for (
                                    let i = oldDay?.activities.length || 0;
                                    i < newDay.activities.length;
                                    i++
                                ) {
                                    updatedActivities.push({
                                        dayNumber: newDay.dayNumber,
                                        activityIndex: i
                                    })
                                }
                            }
                        })
                    }
                }
            }

            const historyResponse = await travelFormAPI.getHistoryDetail(
                normalizedItineraryData.generatePlanId
            )
            const updatedItinerary = {
                generatePlanId: normalizedItineraryData.generatePlanId,
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
                previousAddresses: historyResponse.data.previousAddresses || [],
                relatedTours: historyResponse.data.relatedTours || [],
                relatedTourMessage:
                    historyResponse.data.relatedTourMessage || null
            }

            setNormalizedItineraryData(updatedItinerary)
            if (hasChanges) {
                setRecentlyUpdatedActivities((prev) => [
                    ...prev,
                    ...updatedActivities
                ])
            }

            setMessages((prev) => [
                ...prev,
                {
                    text: botMessage,
                    sender: 'bot',
                    timestamp: new Date(),
                    updatedItinerary: hasChanges ? updatedItinerary : null,
                    hasChanges,
                    updateSummary,
                    changeDetails
                }
            ])
            setSelectedActivity(null)

            if (!hasChanges) {
                Swal.fire({
                    icon: 'info',
                    title: 'Không có thay đổi',
                    text:
                        response.data.userGuidance ||
                        'Lịch trình hiện tại đã bao gồm những gì bạn muốn rồi, không cần điều chỉnh thêm! 😊',
                    showConfirmButton: true,
                    confirmButtonText: 'OK'
                })
                // } else if (changeDetails) {
                //     Swal.fire({
                //         icon: 'success',
                //         title: 'Cập nhật thành công',
                //         html: `Hành trình đã được cập nhật!<br><strong>Chi tiết thay đổi:</strong><br>${changeDetails.replace(/\n/g, '<br>')}`,
                //         showConfirmButton: true,
                //         confirmButtonText: 'OK'
                //     })
            }
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    text: 'Có lỗi xảy ra khi cập nhật hành trình. Vui lòng thử lại.',
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
                    'Lỗi khi cập nhật hành trình.',
                showConfirmButton: false,
                timer: 1500
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleViewUpdatedItinerary = (updatedItinerary) => {
        navigate('/user/itinerary', {
            state: { itineraryData: updatedItinerary }
        })
    }

    if (!normalizedItineraryData) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50">
                <Header />
                <div className="flex-grow max-w-4xl w-full mx-auto p-8 bg-white rounded-3xl shadow-2xl mt-8 animate-fade-in">
                    <h2 className="text-4xl font-bold text-blue-900 tracking-tight text-center">
                        Không tìm thấy hành trình
                    </h2>
                    <p className="text-gray-600 mt-4 text-lg text-center">
                        Vui lòng quay lại trang hành trình để tiếp tục.
                    </p>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-white to-blue-50">
            <Header />
            <div className="flex-grow max-w-7xl w-full border-blue-500 mx-auto p-6 md:p-10 mt-10">
                <div className="mb-6">
                    <button
                        className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-500 hover:to-blue-700 transition-all duration-300 shadow-md flex items-center"
                        onClick={handleBack}
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
                        Quay Lại hành trình
                    </button>
                </div>
                <h2 className="text-4xl font-extrabold text-blue-900 tracking-tight mb-8 text-center animate-slide-in">
                    Cập nhật hành trình du lịch tại{' '}
                    <span className="text-blue-900">
                        {normalizedItineraryData.destination !==
                            'Không xác định' &&
                        normalizedItineraryData.destination !== 'Chưa xác định'
                            ? normalizedItineraryData.destination
                            : 'Đích đến'}
                    </span>
                </h2>
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-1/2 bg-white rounded-3xl shadow-xl p-8 h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100">
                        <h3 className="text-3xl font-extrabold text-gray-900 mb-8 animate-slide-in">
                            Hành trình hiện tại
                        </h3>
                        <hr className="border-t-2 border-gray-200 mb-8" />
                        <div className="space-y-10">
                            <div className="p-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl shadow-sm transition-all hover:shadow-md">
                                <h4 className="text-2xl font-bold text-gray-800 mb-5">
                                    Thông tin chuyến đi
                                </h4>
                                <div className="space-y-4">
                                    {normalizedItineraryData.travelDate &&
                                        normalizedItineraryData.travelDate !==
                                            'Không xác định' &&
                                        normalizedItineraryData.travelDate !==
                                            'Chưa xác định' && (
                                            <p className="flex items-center text-gray-800 text-lg">
                                                <span className="mr-3 text-gray-600 text-xl">
                                                    📅
                                                </span>
                                                <strong className="font-semibold">
                                                    Ngày đi:{' '}
                                                </strong>
                                                <span className="ml-2 text-gray-700">
                                                    {new Date(
                                                        normalizedItineraryData.travelDate
                                                    ).toLocaleDateString(
                                                        'vi-VN'
                                                    )}
                                                </span>
                                            </p>
                                        )}
                                    {normalizedItineraryData.days &&
                                        normalizedItineraryData.days !==
                                            'Không xác định' &&
                                        normalizedItineraryData.days !==
                                            'Chưa xác định' && (
                                            <p className="flex items-center text-gray-800 text-lg">
                                                <span className="mr-3 text-gray-600 text-xl">
                                                    ⏳
                                                </span>
                                                <strong className="font-semibold">
                                                    Số ngày:{' '}
                                                </strong>
                                                <span className="ml-2 text-gray-700">
                                                    {
                                                        normalizedItineraryData.days
                                                    }
                                                </span>
                                            </p>
                                        )}
                                    {normalizedItineraryData.totalEstimatedCost &&
                                        normalizedItineraryData.totalEstimatedCost !==
                                            'Không xác định' &&
                                        normalizedItineraryData.totalEstimatedCost !==
                                            'Chưa xác định' && (
                                            <p className="flex items-center text-gray-800 text-lg">
                                                <span className="mr-3 text-gray-600 text-xl">
                                                    💸
                                                </span>
                                                <strong className="font-semibold">
                                                    Tổng chi phí ước tính:{' '}
                                                </strong>
                                                <span className="ml-2 text-gray-700 font-medium">
                                                    {formatCurrency(
                                                        normalizedItineraryData.totalEstimatedCost
                                                    )}
                                                </span>
                                            </p>
                                        )}
                                </div>
                            </div>
                            <div>
                                <hr className="border-t-2 border-gray-200 mb-8" />
                                <div className="p-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl shadow-sm transition-all hover:shadow-md">
                                    <h4 className="text-2xl font-bold text-gray-800 mb-5">
                                        Sở thích & Chi tiết
                                    </h4>
                                    <div className="space-y-4">
                                        {normalizedItineraryData.preferences &&
                                            normalizedItineraryData.preferences !==
                                                'Không xác định' &&
                                            normalizedItineraryData.preferences !==
                                                'Chưa xác định' &&
                                            normalizedItineraryData.preferences !==
                                                null && (
                                                <p className="flex items-center text-gray-800 text-lg">
                                                    <span className="mr-3 text-gray-600 text-xl">
                                                        🌟
                                                    </span>
                                                    <strong className="font-semibold">
                                                        Sở thích:{' '}
                                                    </strong>
                                                    <span className="ml-2 flex flex-wrap gap-2">
                                                        {normalizedItineraryData.preferences
                                                            .split(', ')
                                                            .map(
                                                                (
                                                                    pref,
                                                                    index
                                                                ) => (
                                                                    <span
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="inline-block bg-gray-300 text-gray-800 text-sm font-medium px-4 py-1.5 rounded-full transition-all hover:bg-gray-400 hover:scale-105"
                                                                    >
                                                                        {pref}
                                                                    </span>
                                                                )
                                                            )}
                                                    </span>
                                                </p>
                                            )}
                                        {normalizedItineraryData.diningStyle &&
                                            normalizedItineraryData.diningStyle !==
                                                'Không xác định' &&
                                            normalizedItineraryData.diningStyle !==
                                                'Chưa xác định' &&
                                            normalizedItineraryData.diningStyle !==
                                                null && (
                                                <p className="flex items-center text-gray-800 text-lg">
                                                    <span className="mr-3 text-gray-600 text-xl">
                                                        🍽️
                                                    </span>
                                                    <strong className="font-semibold">
                                                        Phong cách ăn uống:{' '}
                                                    </strong>
                                                    <span className="ml-2 flex flex-wrap gap-2">
                                                        {normalizedItineraryData.diningStyle
                                                            .split(', ')
                                                            .map(
                                                                (
                                                                    style,
                                                                    index
                                                                ) => (
                                                                    <span
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="inline-block bg-gray-300 text-gray-800 text-sm font-medium px-4 py-1.5 rounded-full transition-all hover:bg-gray-400 hover:scale-105"
                                                                    >
                                                                        {style}
                                                                    </span>
                                                                )
                                                            )}
                                                    </span>
                                                </p>
                                            )}
                                        {normalizedItineraryData.transportation &&
                                            normalizedItineraryData.transportation !==
                                                'Không xác định' &&
                                            normalizedItineraryData.transportation !==
                                                'Chưa xác định' &&
                                            normalizedItineraryData.transportation !==
                                                null && (
                                                <p className="flex items-center text-gray-800 text-lg">
                                                    <span className="mr-3 text-gray-600 text-xl">
                                                        🚗
                                                    </span>
                                                    <strong className="font-semibold">
                                                        Phương tiện:{' '}
                                                    </strong>
                                                    <span className="ml-2 text-gray-700">
                                                        {
                                                            normalizedItineraryData.transportation
                                                        }
                                                    </span>
                                                </p>
                                            )}
                                        {normalizedItineraryData.groupType &&
                                            normalizedItineraryData.groupType !==
                                                'Không xác định' &&
                                            normalizedItineraryData.groupType !==
                                                'Chưa xác định' &&
                                            normalizedItineraryData.groupType !==
                                                null && (
                                                <p className="flex items-center text-gray-800 text-lg">
                                                    <span className="mr-3 text-gray-600 text-xl">
                                                        👥
                                                    </span>
                                                    <strong className="font-semibold">
                                                        Nhóm:{' '}
                                                    </strong>
                                                    <span className="ml-2 text-gray-700">
                                                        {
                                                            normalizedItineraryData.groupType
                                                        }
                                                    </span>
                                                </p>
                                            )}
                                        {normalizedItineraryData.accommodation &&
                                            normalizedItineraryData.accommodation !==
                                                'Không xác định' &&
                                            normalizedItineraryData.accommodation !==
                                                'Chưa xác định' &&
                                            normalizedItineraryData.accommodation !==
                                                null && (
                                                <p className="flex items-center text-gray-800 text-lg">
                                                    <span className="mr-3 text-gray-600 text-xl">
                                                        🏨
                                                    </span>
                                                    <strong className="font-semibold">
                                                        Chỗ ở:{' '}
                                                    </strong>
                                                    <span className="ml-2 text-gray-700">
                                                        {
                                                            normalizedItineraryData.accommodation
                                                        }
                                                    </span>
                                                </p>
                                            )}
                                        {normalizedItineraryData.suggestedAccommodation &&
                                            normalizedItineraryData.suggestedAccommodation !==
                                                'Không xác định' &&
                                            normalizedItineraryData.suggestedAccommodation !==
                                                'Chưa xác định' &&
                                            normalizedItineraryData.suggestedAccommodation !==
                                                null && (
                                                <p className="flex items-center text-gray-800 text-lg">
                                                    <span className="mr-3 text-gray-600 text-xl">
                                                        🗺️
                                                    </span>
                                                    <strong className="font-semibold">
                                                        Đề xuất chỗ ở:&nbsp;
                                                    </strong>
                                                    <a
                                                        href={
                                                            normalizedItineraryData.suggestedAccommodation
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="font-medium text-gray-700 hover:underline hover:text-gray-800 transition-colors"
                                                    >
                                                        Tìm trên Google Maps
                                                    </a>
                                                </p>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr className="border-t-2 border-gray-200 my-8" />
                        <div className="p-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl shadow-sm transition-all hover:shadow-md">
                            <h4 className="text-2xl font-bold text-gray-800 mb-5">
                                Lưu ý
                            </h4>
                            <div className="space-y-4">
                                <p className="flex items-center text-gray-800 text-lg">
                                    <span className="mr-3 text-gray-600 text-xl">
                                        📝
                                    </span>
                                    <strong className="font-semibold">
                                        Phần màu xám là phần không thể chỉnh sửa
                                    </strong>
                                </p>
                            </div>
                        </div>
                        <hr className="border-t border-gray-200 my-6" />
                        <h4 className="text-xl font-semibold text-blue-800 mb-6">
                            Chi tiết hành trình
                        </h4>
                        <div className="space-y-6">
                            {normalizedItineraryData.itinerary &&
                            normalizedItineraryData.itinerary.length > 0 ? (
                                normalizedItineraryData.itinerary.map((day) => (
                                    <div
                                        key={day.dayNumber}
                                        className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                                    >
                                        <button
                                            onClick={() =>
                                                toggleDay(day.dayNumber)
                                            }
                                            className="w-full p-5 text-left bg-blue-100 hover:bg-blue-200 transition-colors duration-300 flex justify-between items-center"
                                        >
                                            <span className="font-semibold text-lg text-blue-900">
                                                {day.title ||
                                                    `Ngày ${day.dayNumber}`}{' '}
                                                (Ngày {day.dayNumber})
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
                                                <div className="mb-4 space-y-2">
                                                    <p className="text-gray-700 text-base">
                                                        <strong>
                                                            Chi phí ngày:{' '}
                                                        </strong>
                                                        <span className="text-blue-600 font-semibold">
                                                            {formatCurrency(
                                                                day.dailyCost
                                                            )}
                                                        </span>
                                                    </p>
                                                    <p className="text-gray-700 text-base">
                                                        <strong>
                                                            Thời tiết:{' '}
                                                        </strong>
                                                        {day.weatherDescription ||
                                                            'Không xác định'}
                                                    </p>
                                                    <p className="text-gray-700 text-base">
                                                        <strong>
                                                            Nhiệt độ:{' '}
                                                        </strong>
                                                        {day.temperatureCelsius
                                                            ? `${day.temperatureCelsius}°C`
                                                            : 'Không xác định'}
                                                    </p>
                                                    <p className="text-gray-700 text-base">
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
                                                                    <div className="flex items-center mb-2">
                                                                        <span className="absolute left-2 top-2 w-3 h-3 bg-blue-600 rounded-full"></span>
                                                                        {index <
                                                                            day
                                                                                .activities
                                                                                .length -
                                                                                1 && (
                                                                            <span className="absolute left-2.5 top-6 w-0.5 h-[calc(100%-1.5rem)] bg-blue-200"></span>
                                                                        )}
                                                                    </div>
                                                                    <div className="bg-blue-50 p-5 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={
                                                                                selectedActivity?.dayNumber ===
                                                                                    day.dayNumber &&
                                                                                selectedActivity?.activityIndex ===
                                                                                    index
                                                                            }
                                                                            onChange={() =>
                                                                                handleActivitySelection(
                                                                                    day.dayNumber,
                                                                                    index,
                                                                                    activity.description
                                                                                )
                                                                            }
                                                                            className="mr-0 h-9 w-8 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                                                                            disabled={
                                                                                isLoading
                                                                            }
                                                                        />
                                                                        {activity.image && (
                                                                            <img
                                                                                src={
                                                                                    activity.image
                                                                                }
                                                                                alt={
                                                                                    activity.description ||
                                                                                    'Activity'
                                                                                }
                                                                                className="w-full h-48 object-cover rounded-lg mb-5 transition-transform duration-300 hover:scale-105"
                                                                                loading="lazy"
                                                                            />
                                                                        )}
                                                                        <p className="text-gray-700 text-base">
                                                                            <strong>
                                                                                Thời
                                                                                gian:{' '}
                                                                            </strong>
                                                                            {activity.starttime &&
                                                                            activity.endtime
                                                                                ? `${activity.starttime} - ${activity.endtime}`
                                                                                : 'Không xác định'}
                                                                        </p>
                                                                        <p className="text-gray-700 text-base">
                                                                            <strong>
                                                                                Hoạt
                                                                                động:{' '}
                                                                            </strong>
                                                                            {activity.description ||
                                                                                'Không xác định'}
                                                                            {recentlyUpdatedActivities.some(
                                                                                (
                                                                                    act
                                                                                ) =>
                                                                                    act.dayNumber ===
                                                                                        day.dayNumber &&
                                                                                    act.activityIndex ===
                                                                                        index
                                                                            ) && (
                                                                                <span className="ml-2 text-xs text-green-500 font-medium">
                                                                                    (Đã
                                                                                    cập
                                                                                    nhật)
                                                                                </span>
                                                                            )}
                                                                        </p>
                                                                        <p className="text-gray-700 text-base">
                                                                            <strong>
                                                                                Chi
                                                                                phí
                                                                                ước
                                                                                tính:{' '}
                                                                            </strong>
                                                                            <span className="text-blue-600 font-medium">
                                                                                {formatCurrency(
                                                                                    activity.estimatedCost
                                                                                )}
                                                                            </span>
                                                                        </p>
                                                                        <p className="text-gray-700 text-base">
                                                                            <strong>
                                                                                Phương
                                                                                tiện:{' '}
                                                                            </strong>
                                                                            {activity.transportation ||
                                                                                'Không xác định'}
                                                                        </p>
                                                                        {activity.address && (
                                                                            <p className="text-gray-700 text-base">
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
                                                                                    className="text-blue-600 hover:underline hover:text-blue-800 transition-colors duration-200"
                                                                                >
                                                                                    {
                                                                                        activity.address
                                                                                    }
                                                                                </a>
                                                                            </p>
                                                                        )}
                                                                        <p className="text-gray-700 text-base">
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
                                                        <p className="text-gray-600 text-base">
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
                                <p className="text-gray-600 text-base">
                                    Không có chi tiết hành trình nào để hiển
                                    thị.
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 bg-white rounded-3xl shadow-xl p-8 h-[80vh] flex flex-col">
                        <h3 className="text-2xl font-bold text-blue-800 mb-6 text-center animate-fade-in">
                            Cập nhật hành trình cùng TripWiseAI
                        </h3>
                        {selectedActivity && (
                            <div className="mb-4 p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 animate-slide-in">
                                <p className="text-lg font-semibold text-gray-800">
                                    <span className="text-gray-900">
                                        Đã chọn:{' '}
                                    </span>
                                    Ngày {selectedActivity.dayNumber}, Hoạt động{' '}
                                    {selectedActivity.activityIndex + 1} (
                                    <span className="text-gray-600">
                                        {
                                            selectedActivity.selectedActivityDescription
                                        }
                                    </span>
                                    )
                                </p>
                            </div>
                        )}
                        <div
                            ref={messagesContainerRef}
                            className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-200 p-6 space-y-6 bg-gradient-to-b from-white-50 to-white-100"
                        >
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in-from-${msg.sender === 'user' ? 'right' : 'left'}`}
                                >
                                    <div
                                        className={`max-w-xs sm:max-w-sm lg:max-w-md p-5 rounded-2xl shadow-lg transition-all duration-500 ${
                                            msg.sender === 'user'
                                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                                                : 'bg-white text-gray-800 border border-gray-200'
                                        } hover:shadow-xl transform hover:-translate-y-1`}
                                    >
                                        <p className="text-sm sm:text-base leading-relaxed font-medium">
                                            {Array.isArray(msg.text)
                                                ? msg.text.map((line, i) => (
                                                      <span
                                                          key={i}
                                                          className="block mb-1"
                                                      >
                                                          {line}
                                                      </span>
                                                  ))
                                                : msg.text}
                                        </p>
                                        {msg.hasChanges === false && (
                                            <p className="text-sm text-gray-600 mt-2">
                                                {msg.updateSummary ||
                                                    'Không có thay đổi trong hành trình.'}
                                            </p>
                                        )}
                                        <p className="text-xs mt-2 opacity-60 font-light">
                                            {msg.timestamp.toLocaleTimeString(
                                                'vi-VN',
                                                {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: false
                                                }
                                            )}
                                        </p>
                                        {msg.sender === 'bot' &&
                                            msg.hasChanges === true &&
                                            msg.updatedItinerary && (
                                                <button
                                                    onClick={() =>
                                                        handleViewUpdatedItinerary(
                                                            msg.updatedItinerary
                                                        )
                                                    }
                                                    className="mt-4 px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                                                >
                                                    Xem hành trình mới
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
                                placeholder={
                                    selectedActivity
                                        ? `Nhập thay đổi cho "${selectedActivity.selectedActivityDescription}" (Ngày ${selectedActivity.dayNumber})...`
                                        : 'VD: Thay hoạt động ăn sáng bằng uống cà phê tại Cộng Cà Phê...'
                                }
                                className="flex-1 p-4 border border-gray-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base transition-all duration-300"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSendMessage}
                                className={`px-6 py-4 bg-blue-700 text-white font-semibold rounded-r-xl hover:bg-blue-800 hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <svg
                                        className="animate-spin h-6 w-6 text-white"
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
