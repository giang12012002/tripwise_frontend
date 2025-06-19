import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { travelFormAPI } from '@/apis'

function TravelForm() {
    const navigate = useNavigate()
    const today = new Date().toISOString().split('T')[0]
    const [formData, setFormData] = useState({
        destination: '',
        travelDate: today,
        days: '',
        preferences: [],
        budget: '',
        transportation: '',
        diningStyle: [],
        groupType: '',
        accommodation: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

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
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = async () => {
        setError('')
        setLoading(true)

        if (
            !formData.destination ||
            !formData.days ||
            !formData.budget ||
            !formData.travelDate ||
            formData.preferences.length === 0
        ) {
            setError(
                'Vui lòng điền đầy đủ các trường bắt buộc: Điểm đến, Số ngày, Ngân sách, Ngày đi, Sở thích.'
            )
            setLoading(false)
            return
        }

        if (new Date(formData.travelDate) < new Date(today)) {
            setError('Ngày đi phải từ hôm nay trở đi.')
            setLoading(false)
            return
        }

        if (isNaN(formData.days) || Number(formData.days) <= 0) {
            setError('Số ngày phải là số dương.')
            setLoading(false)
            return
        }

        if (!['1000000', '3000000', '5000000'].includes(formData.budget)) {
            setError('Vui lòng chọn một mức ngân sách hợp lệ.')
            setLoading(false)
            return
        }

        const submissionData = {
            ...formData,
            budgetVND: parseFloat(formData.budget), // Explicitly set budgetVND
            preferences: formData.preferences.join(', '),
            diningStyle:
                formData.diningStyle.length > 0
                    ? formData.diningStyle.join(', ')
                    : null,
            transportation: formData.transportation || null,
            groupType: formData.groupType || null,
            accommodation: formData.accommodation || null
        }

        console.log('Submission Data:', submissionData) // Debug log

        try {
            const response = await travelFormAPI.createItinerary(submissionData)
            const itineraryData = response.data.data
            const generatePlanId = response.data.generatePlanId
            console.log('API Response:', response.data) // Debug log

            if (response.status === 200 && response.data.success) {
                toast.success('Tạo lịch trình thành công!')
                navigate('/itinerary', {
                    state: {
                        itineraryData: { ...itineraryData, generatePlanId } // Truyền generatePlanId
                    }
                })
            } else {
                throw new Error(
                    response.data.error || 'Không thể tạo lịch trình.'
                )
            }
        } catch (err) {
            setError(err.message)
            toast.error(err.message)
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
                {
                    label: 'Tham quan bãi biển',
                    value: 'Tham quan bãi biển',
                    icon: '🏖️'
                },
                {
                    label: 'Khám phá thành phố',
                    value: 'Khám phá thành phố',
                    icon: '🏙️'
                },
                {
                    label: 'Phiêu lưu ngoài trời',
                    value: 'Phiêu lưu ngoài trời',
                    icon: '🏞️'
                },
                {
                    label: 'đồ ăn đường phố',
                    value: 'đồ ăn đường phố',
                    icon: '🍽️'
                },
                { label: 'Đêm sôi động', value: 'Đêm sôi động', icon: '🌃' },
                { label: 'Mua sắm', value: 'Mua sắm', icon: '🛍️' },
                { label: 'Thư giãn spa', value: 'Thư giãn spa', icon: '💆‍♀️' }
            ]
        },
        {
            label: 'Ngân sách của bạn là bao nhiêu? (VND)',
            name: 'budget',
            type: 'radio',
            required: true,
            options: [
                {
                    label: 'Thấp (1,000,000 VND)',
                    value: '1000000',
                    icon: '💰'
                },
                {
                    label: 'Trung bình (3,000,000 VND)',
                    value: '3000000',
                    icon: '💵'
                },
                {
                    label: 'Cao (5,000,000 VND)',
                    value: '5000000',
                    icon: '💸'
                }
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
                { label: 'Đi bộ', value: 'Đi bộ', icon: '🚶' },
                { label: 'Taxi or Uber', value: 'Taxi or Uber', icon: '🚕' },
                { label: 'Xe thuê', value: 'Xe thuê', icon: '🚗' }
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

    return (
        <div className="p-8 max-w-5xl mx-auto bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl my-10">
            <div className="mb-8">
                <h2 className="text-5xl font-extrabold text-gray-900 tracking-tight">
                    Lên kế hoạch chuyến đi của bạn
                </h2>
                <p className="text-lg text-gray-500 mt-3 leading-relaxed">
                    Chỉ cần cung cấp một số thông tin cơ bản, TripWise AI sẽ tạo
                    ra một hành trình tùy chỉnh dựa trên sở thích của bạn.
                </p>
            </div>
            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg transition-all duration-300">
                    <p className="font-medium">{error}</p>
                </div>
            )}
            <div className="space-y-10">
                {formFields.map((field, index) => (
                    <div key={index} className="relative">
                        <label className="block text-lg font-semibold text-gray-800 mb-3">
                            {field.label}
                            {field.required && (
                                <span className="text-red-500 ml-1">*</span>
                            )}
                        </label>
                        {field.type === 'checkbox' ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {field.options.map((option) => (
                                    <label
                                        key={option.value}
                                        className={`relative flex items-center p-4 bg-white border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                                            formData[field.name].includes(
                                                option.value
                                            )
                                                ? 'border-indigo-500 bg-indigo-50'
                                                : 'border-gray-200 hover:border-indigo-300'
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
                        ) : field.type === 'radio' ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {field.options.map((option) => (
                                    <label
                                        key={option.value}
                                        className={`relative flex items-center p-4 bg-white border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                                            formData[field.name] ===
                                            option.value
                                                ? 'border-indigo-500 bg-indigo-50'
                                                : 'border-gray-200 hover:border-indigo-300'
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
                        ) : field.type === 'number' ? (
                            <div className="flex items-center gap-4">
                                <span className="text-2xl">{field.icon}</span>
                                <div className="relative flex-1">
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                                                        Number(prev.days) - 1
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
                                                    days: Number(prev.days) + 1
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
                                <span className="text-2xl">{field.icon}</span>
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
                                        className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        placeholder={field.placeholder}
                                        min={field.min}
                                        required={field.required}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        )}
                        {field.note && (
                            <p className="text-sm text-gray-500 mt-2">
                                {field.note}
                            </p>
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
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-blue-700 focus:ring-4 focus:ring-indigo-300 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
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
    )
}

export default TravelForm
