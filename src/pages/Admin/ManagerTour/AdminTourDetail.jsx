import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/AuthContext'
import AdminManagerTourAPI from '@/apis/adminManagerTourAPI.js'
import Swal from 'sweetalert2'

const AdminTourDetail = () => {
    const { tourId } = useParams()
    const [tour, setTour] = useState(null)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [openDays, setOpenDays] = useState({})
    const [rejectReason, setRejectReason] = useState('')
    const navigate = useNavigate()
    const { isLoggedIn, isAuthLoading } = useAuth()

    useEffect(() => {
        if (!isAuthLoading && !isLoggedIn) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Vui lòng đăng nhập để xem chi tiết tour.',
                showConfirmButton: false,
                timer: 1800
            })
            navigate('/signin')
        }
    }, [isLoggedIn, isAuthLoading, navigate])

    useEffect(() => {
        const fetchTour = async () => {
            if (!tourId || isNaN(parseInt(tourId))) {
                setError('ID tour không hợp lệ.')
                setIsLoading(false)
                return
            }
            try {
                console.log('Fetching tour with ID:', tourId)
                const response = await AdminManagerTourAPI.getTourDetail(tourId)
                console.log('API Response:', response)
                if (!response.data) {
                    setError('Không tìm thấy tour.')
                    setIsLoading(false)
                    return
                }
                setTour(response.data)
                setIsLoading(false)
            } catch (err) {
                console.error('API Error (getTourDetail):', {
                    message: err.message,
                    response: err.response?.data,
                    status: err.response?.status,
                    errors:
                        err.response?.data?.errors || 'Không có chi tiết lỗi'
                })
                if (err.response?.status === 404) {
                    setError(
                        `Tour với ID ${tourId} không tồn tại hoặc đã bị xóa.`
                    )
                    setTimeout(() => {
                        navigate('/admin/tours/pending')
                    }, 1800)
                } else {
                    setError('Không thể tải chi tiết tour. Vui lòng thử lại.')
                }
                setIsLoading(false)
            }
        }
        fetchTour()
    }, [tourId, navigate])

    const toggleDay = (dayNumber) => {
        setOpenDays((prev) => ({ ...prev, [dayNumber]: !prev[dayNumber] }))
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

    const formatCurrency = (value) => {
        if (!value || isNaN(value)) return '0 đ'
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value)
    }

    const handleApproveTour = async () => {
        try {
            await AdminManagerTourAPI.approveTour(tourId)
            Swal.fire({
                icon: 'success',
                text: 'Tour đã được phê duyệt!',
                showConfirmButton: false,
                timer: 1800
            })
            navigate('/admin/tours/pending')
        } catch (err) {
            setError('Không thể phê duyệt tour. Vui lòng thử lại.')
        }
    }

    const handleRejectTour = async () => {
        const inputResult = await Swal.fire({
            title: 'Từ chối tour',
            text: `Nhập lý do từ chối tour "${tour.tourName}":`,
            input: 'text',
            inputPlaceholder: 'Lý do từ chối',
            inputAttributes: {
                autocapitalize: 'off',
                autocorrect: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Tiếp tục',
            cancelButtonText: 'Hủy',
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#6b7280',
            inputValidator: (value) => {
                const trimmedValue = value.trim()
                if (!trimmedValue) {
                    return 'Vui lòng nhập lý do từ chối'
                }
                if (trimmedValue.length < 5) {
                    return 'Lý do từ chối phải có ít nhất 5 ký tự.'
                }
            }
        })

        if (inputResult.isConfirmed && inputResult.value) {
            const trimmedReason = inputResult.value.trim()
            setRejectReason(trimmedReason)

            const confirmResult = await Swal.fire({
                icon: 'warning',
                title: 'Xác nhận từ chối',
                text: `Bạn có chắc muốn từ chối tour "${tour.tourName}"? Lý do: ${trimmedReason}`,
                showCancelButton: true,
                confirmButtonColor: '#2563eb',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Từ chối',
                cancelButtonText: 'Hủy'
            })

            if (confirmResult.isConfirmed) {
                try {
                    if (!tourId || isNaN(tourId) || parseInt(tourId) <= 0) {
                        setError('ID tour không hợp lệ.')
                        return
                    }

                    await AdminManagerTourAPI.rejectTour(tourId, trimmedReason)
                    Swal.fire({
                        icon: 'success',
                        text: 'Tour đã bị từ chối thành công!',
                        showConfirmButton: false,
                        timer: 1800
                    })
                    navigate('/admin/tours/pending')
                } catch (err) {
                    console.error('Lỗi từ chối tour:', {
                        message: err.message,
                        status: err.response?.status,
                        data: err.response?.data
                    })

                    const errorMessages = []
                    if (err.response?.data?.errors) {
                        if (err.response.data.errors.Reason) {
                            errorMessages.push(
                                ...err.response.data.errors.Reason
                            )
                        }
                        if (err.response.data.errors['$']) {
                            errorMessages.push(...err.response.data.errors['$'])
                        }
                        Object.keys(err.response.data.errors).forEach((key) => {
                            if (
                                key !== 'Reason' &&
                                key !== '$' &&
                                Array.isArray(err.response.data.errors[key])
                            ) {
                                errorMessages.push(
                                    ...err.response.data.errors[key]
                                )
                            }
                        })
                    } else if (err.response?.status === 415) {
                        errorMessages.push(
                            'Lỗi định dạng dữ liệu. Vui lòng kiểm tra lý do từ chối.'
                        )
                    } else {
                        errorMessages.push(
                            err.response?.data?.message ||
                                err.response?.data?.title ||
                                'Không thể từ chối tour. Vui lòng thử lại sau.'
                        )
                    }

                    const errorMessage =
                        errorMessages.length > 0
                            ? errorMessages.join(', ')
                            : 'Không thể từ chối tour. Vui lòng kiểm tra lý do và thử lại.'
                    setError(errorMessage)
                } finally {
                    setRejectReason('')
                }
            }
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
                <div className="flex-grow flex items-center justify-center max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-3 p-6 bg-white rounded-xl shadow-lg">
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
                        <span className="text-lg font-medium text-gray-700">
                            Đang tải...
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
                <div className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center bg-white p-8 rounded-xl shadow-lg w-full">
                        <p className="text-red-500 text-lg font-medium">
                            {error}
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    if (!tour) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
                <div className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center bg-white p-8 rounded-xl shadow-lg w-full">
                        <p className="text-gray-600 text-lg">
                            Không tìm thấy tour.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-grow max-w-6xl w-full mx-auto p-8 bg-gradient-to-b from-blue-50 to-white rounded-2xl shadow-xl mt-8">
            {error && (
                <p className="text-red-500 mb-6 text-center font-medium text-lg">
                    {error}
                </p>
            )}
            <div className="mb-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">
                        Chi Tiết Tour: {tour.tourName}
                    </h1>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">
                        Thông Tin Tour
                    </h3>
                    <p className="text-gray-700 mb-3">
                        <strong className="text-gray-700 font-semibold">
                            Chủ đề:
                        </strong>{' '}
                        {tour.preferences || 'N/A'}
                    </p>
                    <p className="text-gray-700 mb-3">
                        <strong className="text-gray-700 font-semibold">
                            Thời gian:
                        </strong>{' '}
                        {tour.days} ngày
                    </p>
                    <p className="text-gray-700 mb-3">
                        <strong className="text-gray-700 font-semibold">
                            Giá:
                        </strong>{' '}
                        <span className="text-blue-700 font-semibold">
                            {formatCurrency(tour.totalEstimatedCost)}
                        </span>
                    </p>
                    <hr className="border-t border-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">
                        Mô tả và chi tiết
                    </h3>
                    <p className="text-gray-700 mb-3">
                        <strong className="text-gray-700 font-semibold">
                            Mô tả:
                        </strong>{' '}
                        {tour.description || 'N/A'}
                    </p>
                    <p className="text-gray-700 mb-3">
                        <strong className="text-gray-700 font-semibold">
                            Ghi chú:
                        </strong>{' '}
                        {tour.tourNote || 'N/A'}
                    </p>
                    <p className="text-gray-700 mb-3">
                        <strong className="text-gray-700 font-semibold">
                            Chi tiết tour:
                        </strong>{' '}
                        {tour.tourInfo || 'N/A'}
                    </p>
                </div>
            </div>
            <h3 className="text-2xl font-semibold text-blue-900 mb-6">
                Lịch Trình chi tiết
            </h3>
            <div className="space-y-6">
                {tour.itinerary.map((day) => (
                    <div
                        key={day.dayNumber}
                        className="bg-white rounded-xl shadow-md overflow-hidden w-full"
                    >
                        <button
                            onClick={() => toggleDay(day.dayNumber)}
                            className="w-full p-5 text-left bg-blue-100 hover:bg-blue-200 transition-colors duration-300 flex justify-between items-center"
                        >
                            <span className="font-semibold text-lg text-blue-900">
                                {day.title || `Ngày ${day.dayNumber}`} (Ngày{' '}
                                {day.dayNumber})
                            </span>
                            <span
                                className={`transition-transform duration-300 ${
                                    openDays[day.dayNumber] ? 'rotate-180' : ''
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
                                <ul className="relative space-y-6">
                                    {day.activities.map((activity, index) => (
                                        <li
                                            key={index}
                                            className="pl-8 relative"
                                        >
                                            <span className="absolute left-2 top-2 w-4 h-4 bg-blue-700 rounded-full"></span>
                                            {index <
                                                day.activities.length - 1 && (
                                                <span className="absolute left-3 top-6 w-0.5 h-full bg-blue-200"></span>
                                            )}
                                            <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                                                <p className="text-gray-700 mb-2">
                                                    <strong className="text-gray-700 font-semibold">
                                                        Thời gian:
                                                    </strong>{' '}
                                                    {activity.startTime &&
                                                    activity.endTime
                                                        ? `${formatTime(
                                                              activity.startTime
                                                          )} - ${formatTime(
                                                              activity.endTime
                                                          )}`
                                                        : 'N/A'}
                                                </p>
                                                <p className="text-gray-700 mb-2">
                                                    <strong className="text-gray-700 font-semibold">
                                                        Hoạt động:
                                                    </strong>{' '}
                                                    {activity.description ||
                                                        'N/A'}
                                                </p>
                                                <p className="text-gray-700 mb-2">
                                                    <strong className="text-gray-700 font-semibold">
                                                        Chi Tiết:
                                                    </strong>{' '}
                                                    {activity.placeDetail ||
                                                        'N/A'}
                                                </p>
                                                <p className="text-gray-700 mb-2">
                                                    <strong className="text-gray-700 font-semibold">
                                                        Chi phí:
                                                    </strong>{' '}
                                                    <span className="text-blue-700 font-semibold">
                                                        {formatCurrency(
                                                            activity.estimatedCost
                                                        )}
                                                    </span>
                                                </p>
                                                <p className="text-gray-700 mb-2">
                                                    <strong className="text-gray-700 font-semibold">
                                                        Địa điểm:
                                                    </strong>{' '}
                                                    {activity.address || 'N/A'}
                                                </p>
                                                {activity.mapUrl && (
                                                    <p className="text-gray-700 mb-2">
                                                        <strong className="text-gray-700 font-semibold">
                                                            Bản đồ:{' '}
                                                        </strong>
                                                        <a
                                                            href={
                                                                activity.mapUrl
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:underline hover:text-blue-800 transition-colors"
                                                        >
                                                            Xem trên Google Maps
                                                        </a>
                                                    </p>
                                                )}
                                                {activity.image && (
                                                    <img
                                                        src={activity.image}
                                                        alt={
                                                            activity.description ||
                                                            'Activity'
                                                        }
                                                        className="w-full h-110 object-contain rounded-lg mt-4"
                                                    />
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="mt-8">
                <div className="flex justify-center space-x-4">
                    <button
                        className="px-5 py-3 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg hover:from-green-700 hover:to-green-900 transition-all duration-300 shadow-md flex items-center"
                        onClick={handleApproveTour}
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
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        Phê duyệt
                    </button>
                    <button
                        className="px-5 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-md flex items-center"
                        onClick={handleRejectTour}
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
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                        Từ chối
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AdminTourDetail
