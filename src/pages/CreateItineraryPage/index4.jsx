import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { travelFormAPI } from '@/apis'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import Swal from 'sweetalert2'
import { useAuth } from '@/AuthContext'

function CreateItinerary() {
    const navigate = useNavigate()
    const { isLoggedIn, isAuthLoading } = useAuth()
    const today = new Date().toISOString().split('T')[0]
    const [formData, setFormData] = useState({
        destination: '',
        travelDate: today,
        days: '3',
        preferences: [],
        budget: '',
        transportation: '',
        diningStyle: [],
        groupType: '',
        accommodation: ''
    })

    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [shouldScroll, setShouldScroll] = useState(false)
    const fieldRefs = useRef({})

    const handleRadioClick = (name, value) => {
        if (loading) return
        setFormData((prev) => ({
            ...prev,
            [name]: prev[name] === value ? '' : value
        }))
    }

    const handleChange = (e) => {
        if (loading) return
        const { name, value, type, checked } = e.target
        if (type === 'checkbox') {
            const field = name === 'preferences' ? 'preferences' : 'diningStyle'
            setFormData((prev) => ({
                ...prev,
                [field]: checked
                    ? [...prev[field], value]
                    : prev[field].filter((item) => item !== value)
            }))
            setErrors((prev) => ({ ...prev, [field]: '' }))
        } else if (type !== 'radio') {
            setFormData((prev) => ({ ...prev, [name]: value }))
            setErrors((prev) => ({ ...prev, [name]: '' }))
        }
    }

    const validateField = (name, value) => {
        let error = ''
        switch (name) {
            case 'destination':
                {
                    if (!value.trim())
                        error = 'Vui lòng chọn hoặc nhập địa điểm.'
                }
                break
            case 'travelDate':
                if (!value || new Date(value) < new Date(today))
                    error = 'Ngày đi phải từ hôm nay trở đi.'
                break
            case 'days':
                {
                    const days = value === '' ? 0 : Number(value)
                    if (!value) {
                        error = 'Vui lòng nhập số ngày.'
                    } else if (isNaN(days) || days <= 0) {
                        error = 'Số ngày phải là số dương.'
                    }
                }
                break
            case 'preferences':
                {
                    if (value.length === 0)
                        error = 'Vui lòng chọn ít nhất một sở thích.'
                }
                break
            case 'budget':
                {
                    const validBudgets = [
                        '1000000',
                        '2000000-3000000',
                        '3000000-4000000',
                        '5000000+'
                    ]
                    if (!value || !validBudgets.includes(value))
                        error = 'Vui lòng chọn một mức ngân sách.'
                }
                break
            default:
                break
        }
        return error
    }

    const handleSubmit = async () => {
        setErrors({})
        const newErrors = {}

        // Validate từng trường
        formFields.forEach((field) => {
            const value = formData[field.name]
            if (field.required) {
                const error = validateField(field.name, value)
                if (error) newErrors[field.name] = error
            }
        })

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            setShouldScroll(true)
            return
        }

        setLoading(true)

        const accessToken = localStorage.getItem('accessToken')
        if (!accessToken) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Vui lòng đăng nhập để tạo lịch trình.',
                showConfirmButton: true,
                confirmButtonText: 'Đăng nhập',
                confirmButtonColor: '#2563eb'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/signin')
                }
            })
            setLoading(false)
            return
        }

        let budgetVND
        switch (formData.budget) {
            case '1000000':
                budgetVND = 1000000
                break
            case '2000000-3000000':
                budgetVND = 2000000
                break
            case '3000000-4000000':
                budgetVND = 3000000
                break
            case '5000000+':
                budgetVND = 5000000
                break
            default:
                setErrors({ budget: 'Ngân sách không hợp lệ.' })
                setShouldScroll(true)
                setLoading(false)
                return
        }

        const submissionData = {
            destination: formData.destination.trim(),
            travelDate: formData.travelDate,
            days: Number(formData.days),
            preferences:
                formData.preferences.length > 0
                    ? formData.preferences.join(', ')
                    : 'General sightseeing',
            budgetVND: budgetVND,
            transportation: formData.transportation || '',
            diningStyle:
                formData.diningStyle.length > 0
                    ? formData.diningStyle.join(', ')
                    : '',
            groupType: formData.groupType || '',
            accommodation: formData.accommodation || ''
        }

        try {
            const response = await travelFormAPI.createItinerary(submissionData)
            console.log('Phản hồi API:', response.data)
            const itineraryData = response.data.data
            const generatePlanId = response.data.id

            if (response.status === 200 && response.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Tạo lịch trình thành công!',
                    showConfirmButton: false,
                    timer: 1500
                })
                navigate('/itinerary', {
                    state: {
                        itineraryData: { ...itineraryData, generatePlanId },
                        relatedTours: response.data.relatedTours || [],
                        relatedTourMessage: response.data.relatedTourMessage
                    }
                })
            } else {
                throw new Error(
                    response.data.error ||
                        response.data.message ||
                        'Không thể tạo lịch trình.'
                )
            }
        } catch (err) {
            console.error('API Error:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                errors: err.response?.data?.errors
            })

            let errorMessage =
                err.response?.data?.error ||
                err.response?.data?.message ||
                err.message ||
                'Không thể tạo lịch trình. Vui lòng thử lại.'
            let showConfirmButton = false
            let confirmButtonText = ''
            let timer = 4000

            // Xử lý lỗi cụ thể liên quan đến gói dịch vụ và đăng nhập
            if (
                err.response?.status === 400 &&
                errorMessage
                    .toLowerCase()
                    .includes('không tìm thấy gói sử dụng')
            ) {
                errorMessage =
                    err.response?.data?.error ||
                    'Không tìm thấy gói sử dụng. Vui lòng nâng cấp gói hoặc liên hệ hỗ trợ qua support@x.ai.'
                showConfirmButton = true
                confirmButtonText = 'Nâng cấp gói'
            } else if (
                err.response?.status === 403 ||
                errorMessage.toLowerCase().includes('no valid subscription') ||
                errorMessage.toLowerCase().includes('subscription not found')
            ) {
                errorMessage =
                    err.response?.data?.error ||
                    'Không tìm thấy gói dịch vụ hợp lệ. Vui lòng nâng cấp gói hoặc liên hệ hỗ trợ qua support@x.ai.'
                showConfirmButton = true
                confirmButtonText = 'Nâng cấp gói'
            } else if (
                err.response?.status === 400 &&
                (errorMessage.toLowerCase().includes('hết lượt') ||
                    errorMessage.toLowerCase().includes('quota exceeded') ||
                    errorMessage.toLowerCase().includes('usage limit'))
            ) {
                errorMessage =
                    err.response?.data?.error ||
                    'Bạn đã sử dụng hết lượt của gói hiện tại. Vui lòng nâng cấp gói hoặc liên hệ hỗ trợ qua support@x.ai.'
                showConfirmButton = true
                confirmButtonText = 'Nâng cấp gói'
            } else if (
                err.response?.status === 401 ||
                errorMessage.toLowerCase().includes('token')
            ) {
                errorMessage =
                    err.response?.data?.error ||
                    'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'
                showConfirmButton = true
                confirmButtonText = 'Đăng nhập'
            } else if (
                err.response?.status === 400 &&
                errorMessage.toLowerCase().includes('ngày khởi hành')
            ) {
                errorMessage =
                    err.response?.data?.error ||
                    'Ngày khởi hành phải từ hôm nay trở đi.'
                showConfirmButton = false
                timer = 4000
            }

            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: errorMessage,
                showConfirmButton: showConfirmButton,
                confirmButtonText: confirmButtonText,
                confirmButtonColor: '#2563eb',
                timer: showConfirmButton ? undefined : 4000
            }).then((result) => {
                if (result.isConfirmed) {
                    if (
                        errorMessage
                            .toLowerCase()
                            .includes('không tìm thấy gói sử dụng') ||
                        errorMessage
                            .toLowerCase()
                            .includes('no valid subscription') ||
                        errorMessage
                            .toLowerCase()
                            .includes('subscription not found') ||
                        errorMessage.toLowerCase().includes('hết lượt') ||
                        errorMessage.toLowerCase().includes('quota exceeded') ||
                        errorMessage.toLowerCase().includes('usage limit')
                    ) {
                        navigate('/plans')
                    } else if (
                        err.response?.status === 401 ||
                        errorMessage.toLowerCase().includes('token')
                    ) {
                        localStorage.removeItem('accessToken')
                        localStorage.removeItem('userId')
                        navigate('/signin')
                    }
                }
            })
        } finally {
            setLoading(false)
        }
    }

    const formFields = [
        {
            label: 'Nơi bạn muốn đến?',
            name: 'destination',
            type: 'text',
            placeholder: 'Ví dụ: Đà Lạt',
            required: true,
            icon: '🌍'
        },
        {
            label: 'Bạn dự định đi du lịch khi nào?',
            name: 'travelDate',
            type: 'date',
            min: today,
            required: true,
            icon: '📅'
        },
        {
            label: 'Bạn dự định đi du lịch trong bao nhiêu ngày?',
            name: 'days',
            type: 'number',
            min: '1',
            required: true,
            icon: '⏳'
        },
        {
            label: 'Sở thích của bạn là gì?',
            name: 'preferences',
            type: 'checkbox',
            required: true,
            options: [
                { label: 'Chụp ảnh', value: 'Chụp ảnh', icon: '📸' },
                { label: 'Cảnh đẹp', value: 'Cảnh đẹp', icon: '🏞️' },
                {
                    label: 'Trải nghiệm văn hóa',
                    value: 'Trải nghiệm văn hóa',
                    icon: '⛩️'
                },
                {
                    label: 'Di tích lịch sử',
                    value: 'Di tích lịch sử',
                    icon: '🏛️'
                },
                { label: 'Thiên nhiên', value: 'Thiên nhiên', icon: '🌳' },
                {
                    label: 'Đồ ăn đường phố',
                    value: 'Đồ ăn đường phố',
                    icon: '🥘'
                },
                { label: 'Nghỉ ngơi', value: 'Nghỉ ngơi', icon: '💆‍♀️' },
                { label: 'Phiêu lưu', value: 'Phiêu lưu', icon: '🏄' },
                {
                    label: 'Đặc sản địa phương',
                    value: 'Đặc sản địa phương',
                    icon: '🍽️'
                },
                { label: 'Leo núi', value: 'Leo núi', icon: '🧗' },
                {
                    label: 'Trải nghiệm ẩm thực',
                    value: 'Trải nghiệm ẩm thực',
                    icon: '🍛'
                },
                { label: 'Mua sắm', value: 'Mua sắm', icon: '🛍️' },
                {
                    label: 'Làng truyền thống',
                    value: 'Làng truyền thống',
                    icon: '🏘️'
                }
            ]
        },
        {
            label: 'Ngân sách của bạn là bao nhiêu? (VND)',
            name: 'budget',
            type: 'radio',
            required: true,
            options: [
                { label: '1,000,000 VND', value: '1000000', icon: '💰' },
                {
                    label: '2,000,000 - 3,000,000 VND',
                    value: '2000000-3000000',
                    icon: '💵'
                },
                {
                    label: '3,000,000 - 4,000,000 VND',
                    value: '3000000-4000000',
                    icon: '💵'
                },
                { label: '> 5,000,000 VND', value: '5000000+', icon: '💸' }
            ]
        },
        {
            label: 'Phương tiện di chuyển mà bạn mong muốn?',
            name: 'transportation',
            type: 'radio',
            options: [
                {
                    label: 'Giao thông công cộng',
                    value: 'Giao thông công cộng',
                    icon: '🚌'
                },
                {
                    label: 'Xe máy ',
                    value: 'Xe máy',
                    icon: '🏍️'
                },
                { label: 'Đi bộ', value: 'Đi bộ', icon: '🚶' },
                {
                    label: 'Xe dịch vụ hoặc Taxi',
                    value: 'Xe dịch vụ hoặc Taxi',
                    icon: '🚗'
                }
            ]
        },
        {
            label: 'Bạn muốn thưởng thức phong cách ăn uống nào?',
            name: 'diningStyle',
            type: 'checkbox',
            options: [
                { label: 'Món ăn vỉa hè', value: 'Món ăn vỉa hè', icon: '🌯' },
                { label: 'Uống rượu nho', value: 'Uống rượu nho', icon: '🍷' },
                {
                    label: 'Ẩm thực cân bằng',
                    value: 'Ẩm thực cân bằng',
                    icon: '🥗'
                },
                {
                    label: 'Ẩm thực cao cấp',
                    value: 'Ẩm thực cao cấp',
                    icon: '🍝'
                },
                { label: 'Hải sản', value: 'Hải sản', icon: '🦐' },
                {
                    label: 'Thưởng thức món ngon',
                    value: 'Thưởng thức món ngon',
                    icon: '🍽️'
                },
                {
                    label: 'Khám phá hương vị đặc biệt',
                    value: 'Khám phá hương vị đặc biệt',
                    icon: '🍲'
                },
                {
                    label: 'Khóa học chế biến món mới',
                    value: 'Khóa học chế biến món mới',
                    icon: '👩‍🍳'
                },
                { label: 'Vị quê nhà', value: 'Vị quê nhà', icon: '🌶️' },
                {
                    label: 'Ẩm thực tinh tế',
                    value: 'Ẩm thực tinh tế',
                    icon: '🍴'
                },
                {
                    label: 'Khóa học làm bánh đặc sản',
                    value: 'Khóa học làm bánh đặc sản',
                    icon: '🎂'
                },
                {
                    label: 'Thư giãn với ẩm thực',
                    value: 'Thư giãn với ẩm thực',
                    icon: '🍵'
                }
            ]
        },
        {
            label: 'Bạn dự định đi du lịch cùng ai?',
            name: 'groupType',
            type: 'radio',
            options: [
                { label: 'Một mình', value: 'Một mình', icon: '👤' },
                { label: 'Cặp đôi', value: 'Cặp đôi', icon: '👫' },
                { label: 'Bạn bè', value: 'Bạn bè', icon: '👥' },
                { label: 'Gia Đình', value: 'Gia Đình', icon: '👨‍👩‍👧‍👦' }
            ]
        },
        {
            label: 'Nơi ở mà bạn muốn nghỉ ngơi?',
            name: 'accommodation',
            type: 'radio',
            options: [
                { label: 'Khách sạn', value: 'Khách sạn', icon: '🏨' },
                { label: 'Nhà nghỉ', value: 'Nhà nghỉ', icon: '🏡' },
                { label: 'Homestay', value: 'Homestay', icon: '🏠' },
                { label: 'Resort', value: 'Resort', icon: '🏖️' }
            ]
        }
    ]

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
        if (shouldScroll && Object.keys(errors).length > 0) {
            const firstErrorFieldName = Object.keys(errors)[0]
            const errorField = fieldRefs.current[firstErrorFieldName]
            if (errorField) {
                errorField.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                })
                window.scrollBy({ top: -100, behavior: 'smooth' })
            }
            setShouldScroll(false)
        }
    }, [errors, shouldScroll])

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow p-8 max-w-5xl mx-auto bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl my-10">
                <div className="mb-8">
                    <h2 className="text-5xl font-extrabold text-gray-900 tracking-tight">
                        Lên kế hoạch chuyến đi của bạn
                    </h2>
                    <p className="text-lg text-gray-500 mt-3 leading-relaxed">
                        Chỉ cần cung cấp một số thông tin cơ bản, TripWise AI sẽ
                        tạo ra một hành trình tùy chỉnh dựa trên sở thích của
                        bạn.
                    </p>
                </div>
                <div className="space-y-10">
                    {formFields.map((field, index) => (
                        <div
                            key={index}
                            className="relative"
                            ref={(el) => (fieldRefs.current[field.name] = el)}
                        >
                            <label className="block text-lg font-semibold text-gray-800 mb-3">
                                {field.label}
                                {field.required && (
                                    <span className="text-red-600 ml-1">*</span>
                                )}
                            </label>
                            {field.type === 'checkbox' ? (
                                <div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {field.options.map((option) => (
                                            <label
                                                key={option.value}
                                                className={`relative flex items-center p-4 bg-white border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                                                    formData[
                                                        field.name
                                                    ].includes(option.value)
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-blue-300'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    name={field.name}
                                                    value={option.value}
                                                    checked={formData[
                                                        field.name
                                                    ].includes(option.value)}
                                                    onChange={handleChange}
                                                    className="absolute opacity-0"
                                                    disabled={loading}
                                                />
                                                <span className="text-2xl mr-3">
                                                    {option.icon}
                                                </span>
                                                <span className="text-sm font-medium text-gray-700">
                                                    {option.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="mt-3 text-xm text-gray-600">
                                        Đã chọn: {formData[field.name].length}{' '}
                                        mục
                                    </div>
                                </div>
                            ) : field.type === 'radio' ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {field.options.map((option) => (
                                        <label
                                            key={option.value}
                                            className={`relative flex items-center p-4 bg-white border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                                                formData[field.name] ===
                                                option.value
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name={field.name}
                                                value={option.value}
                                                checked={
                                                    formData[field.name] ===
                                                    option.value
                                                }
                                                onClick={() =>
                                                    handleRadioClick(
                                                        field.name,
                                                        option.value
                                                    )
                                                }
                                                className="absolute opacity-0"
                                                disabled={loading}
                                            />
                                            <span className="text-2xl mr-3">
                                                {option.icon}
                                            </span>
                                            <span className="text-sm font-medium text-gray-700">
                                                {option.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            ) : field.type === 'number' ? (
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl">
                                        {field.icon}
                                    </span>
                                    <div className="relative flex-1">
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            value={formData[field.name]}
                                            onChange={handleChange}
                                            className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            placeholder={field.placeholder}
                                            min={field.min}
                                            step={field.step}
                                            required={field.required}
                                            disabled={loading}
                                        />
                                    </div>
                                    {field.name === 'days' && (
                                        <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden">
                                            <button
                                                onClick={() =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        days: Math.max(
                                                            1,
                                                            Number(prev.days) -
                                                                1
                                                        )
                                                    }))
                                                }
                                                className="px-4 py-2 text-gray-700 hover:bg-gray-200 transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
                                                disabled={loading}
                                            >
                                                -
                                            </button>
                                            <span className="px-4 py-2 text-gray-700 font-medium">
                                                {formData.days || 0}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        days:
                                                            Number(prev.days) +
                                                            1
                                                    }))
                                                }
                                                className="px-4 py-2 text-gray-700 hover:bg-gray-200 transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
                                                disabled={loading}
                                            >
                                                +
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl">
                                        {field.icon}
                                    </span>
                                    <div className="relative flex-1">
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            value={
                                                field.name === 'travelDate'
                                                    ? formData[field.name]
                                                    : formData[field.name]
                                            }
                                            onChange={handleChange}
                                            className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            placeholder={field.placeholder}
                                            min={field.min}
                                            required={field.required}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            )}
                            {errors[field.name] && (
                                <div className="mt-2 p-2 bg-orange-500 text-white rounded-md flex items-center text-sm">
                                    <span className="mr-2">⚠</span>
                                    {errors[field.name]}
                                </div>
                            )}
                            {index < formFields.length - 1 && (
                                <div className="border-t border-gray-200 my-8"></div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-end mt-10">
                    <button
                        onClick={handleSubmit}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                        disabled={loading}
                    >
                        {loading ? (
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
                                Đang xử lý...
                            </div>
                        ) : (
                            'Tạo hành trình'
                        )}
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default CreateItinerary
