import React, { useState } from 'react'
import { authAPI, travelFormAPI } from '@/apis'
import { toast } from 'react-toastify'

function TravelForm({ setItineraryData, setError, setLoading, setShowForm }) {
    const today = new Date().toISOString().split('T')[0]
    const [formData, setFormData] = useState({
        destination: '',
        travelDate: today,
        days: '',
        preferences: [], // Array for multiple selections
        budget: '',
        transportation: '', // Single selection
        diningStyle: [], // Changed to array for multiple selections
        groupType: '',
        accommodation: ''
    })
    const [step, setStep] = useState(1)

    // Handle form changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        if (type === 'checkbox') {
            const field =
                name === 'preferences'
                    ? 'preferences'
                    : name === 'diningStyle'
                      ? 'diningStyle'
                      : 'transportation'
            setFormData((prev) => ({
                ...prev,
                [field]: checked
                    ? [...prev[field], value]
                    : prev[field].filter((item) => item !== value)
            }))
        } else if (type === 'radio') {
            setFormData((prev) => ({ ...prev, [name]: value }))
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }))
        }
    }

    // Handle navigation to the next step
    const handleNext = () => {
        // Basic validation for the current step
        if (step === 1 && !formData.destination) {
            setError('Vui lòng điền điểm đến.')
            return
        }
        if (step === 2) {
            if (!formData.travelDate) {
                setError('Vui lòng chọn ngày đi.')
                return
            }
            if (new Date(formData.travelDate) < new Date(today)) {
                setError('Ngày đi phải từ hôm nay trở đi.')
                return
            }
        }
        if (step === 3) {
            if (!formData.days) {
                setError('Vui lòng điền số ngày.')
                return
            }
            if (isNaN(formData.days) || formData.days <= 0) {
                setError('Số ngày phải là số dương.')
                return
            }
        }
        if (step === 5) {
            if (!formData.budget) {
                setError('Vui lòng điền ngân sách.')
                return
            }
            if (isNaN(formData.budget) || formData.budget <= 0) {
                setError('Ngân sách phải là số dương.')
                return
            }
        }

        if (step < 9) {
            setStep(step + 1)
            setError(null)
        }
    }

    // Handle navigation to the previous step
    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1)
            setError(null)
        }
    }

    // Handle form submission
    const handleSubmit = async () => {
        setError(null)
        setLoading(true)

        // Full validation
        if (
            !formData.destination ||
            !formData.days ||
            !formData.budget ||
            !formData.travelDate
        ) {
            setError(
                'Vui lòng điền đầy đủ các trường bắt buộc: Điểm đến, Số ngày, Ngân sách, Ngày đi.'
            )
            setLoading(false)
            return
        }

        if (new Date(formData.travelDate) < new Date(today)) {
            setError('Ngày đi phải từ hôm nay trở đi.')
            setLoading(false)
            return
        }

        if (isNaN(formData.days) || formData.days <= 0) {
            setError('Số ngày phải là số dương.')
            setLoading(false)
            return
        }

        if (isNaN(formData.budget) || formData.budget <= 0) {
            setError('Ngân sách phải là số dương.')
            setLoading(false)
            return
        }

        //Chuẩn bị dữ liệu để submission
        const submissionData = {
            ...formData,
            preferences:
                formData.preferences.length > 0
                    ? formData.preferences.join(', ')
                    : null,
            diningStyle:
                formData.diningStyle.length > 0
                    ? formData.diningStyle.join(', ')
                    : null,
            transportation: formData.transportation || null,
            groupType: formData.groupType || null,
            accommodation: formData.accommodation || null
        }

        // Create itinerary
        try {
            const response = await travelFormAPI.createItinerary(submissionData)

            if (response.status === 200 && response.data.success) {
                setItineraryData(response.data.data)
                setShowForm(false)
                toast.success('Tạo lịch trình thành công!')
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

    // Define form fields for each step
    const formFields = [
        {
            label: 'Điểm đến *',
            name: 'destination',
            type: 'text',
            placeholder: 'Ví dụ: Đà Lạt',
            required: true
        },
        {
            label: 'Ngày đi *',
            name: 'travelDate',
            type: 'date',
            min: today,
            required: true
        },
        {
            label: 'Số ngày *',
            name: 'days',
            type: 'number',
            placeholder: 'Ví dụ: 3',
            min: '1',
            required: true
        },
        {
            label: 'Sở thích',
            name: 'preferences',
            type: 'checkbox',
            options: [
                {
                    label: 'Di tích lịch sử',
                    value: 'Di tích lịch sử',
                    emoji: '🏛️'
                },
                {
                    label: 'Thức ăn đường phố',
                    value: 'Thức ăn đường phố',
                    emoji: '🍜'
                },
                {
                    label: 'Phòng trưng bày nghệ thuật',
                    value: 'Phòng trưng bày nghệ thuật',
                    emoji: '🎨'
                },
                {
                    label: 'Chợ địa phương',
                    value: 'Chợ địa phương',
                    emoji: '🏬'
                },
                {
                    label: 'Đi bộ trong thành phố',
                    value: 'Đi bộ trong thành phố',
                    emoji: '🚶'
                },
                { label: 'Thiền định', value: 'Thiền định', emoji: '🧘' },
                { label: 'Nhạc sống', value: 'Nhạc sống', emoji: '🎶' },
                {
                    label: 'Trải nghiệm văn hóa',
                    value: 'Trải nghiệm văn hóa',
                    emoji: '🎭'
                },
                { label: 'Cảnh đẹp', value: 'Cảnh đẹp', emoji: '🏞️' },
                { label: 'Nhiếp ảnh', value: 'Nhiếp ảnh', emoji: '📸' },
                {
                    label: 'Công viên thiên nhiên',
                    value: 'Công viên thiên nhiên',
                    emoji: '🌳'
                },
                {
                    label: 'Lớp học nấu ăn',
                    value: 'Lớp học nấu ăn',
                    emoji: '🍳'
                },
                { label: 'Đền thờ', value: 'Đền thờ', emoji: '⛩️' },
                { label: 'Đạp xe', value: 'Đạp xe', emoji: '🚴' },
                {
                    label: 'Khung cảnh dưỡng sinh',
                    value: 'Khung cảnh dưỡng sinh',
                    emoji: '🏕️'
                },
                { label: 'Chill', value: 'Chill', emoji: '🕉️' }
            ]
        },
        {
            label: 'Ngân sách (USD) *',
            name: 'budget',
            type: 'number',
            placeholder: 'Ví dụ: 200',
            min: '1',
            step: 'any',
            required: true
        },
        {
            label: 'Phương tiện di chuyển',
            name: 'transportation',
            type: 'radio',
            options: [
                {
                    label: 'Giao thông công cộng',
                    value: 'Giao thông công cộng'
                },
                { label: 'Đi bộ', value: 'Đi bộ' },
                { label: 'Taxi or Uber', value: 'Taxi or Uber' },
                { label: 'Xe thuê', value: 'Xe thuê' }
            ]
        },
        {
            label: 'Phong cách ăn uống',
            name: 'diningStyle',
            type: 'checkbox',
            options: [
                { label: 'Món ăn vỉa hè', value: 'Món ăn vỉa hè', emoji: '🌯' },
                {
                    label: 'Uống thử rượu nho',
                    value: 'Uống thử rượu nho',
                    emoji: '🍷'
                },
                {
                    label: 'Ẩm thực cân bằng',
                    value: 'Ẩm thực cân bằng',
                    emoji: '🥗'
                },
                {
                    label: 'Thưởng thức món ngon',
                    value: 'Thưởng thức món ngon',
                    emoji: '🍽️'
                },
                {
                    label: 'Khám phá hương vị đặc biệt',
                    value: 'Khám phá hương vị đặc biệt',
                    emoji: '🍲'
                },
                {
                    label: 'Khóa học chế biến món mới',
                    value: 'Khóa học chế biến món mới',
                    emoji: '👩‍🍳'
                },
                { label: 'Vị quê nhà', value: 'Vị quê nhà', emoji: '🌶️' },
                {
                    label: 'Ẩm thực tinh tế',
                    value: 'Ẩm thực tinh tế',
                    emoji: '🍴'
                },
                {
                    label: 'Khóa học làm bánh đặc sản',
                    value: 'Khóa học làm bánh đặc sản',
                    emoji: '🎂'
                },
                {
                    label: 'Thư giãn với ẩm thực',
                    value: 'Thư giãn với ẩm thực',
                    emoji: '🍵'
                }
            ]
        },
        {
            label: 'Nhóm người',
            name: 'groupType',
            type: 'radio',
            options: [
                { label: 'Một mình', value: 'Một mình' },
                { label: 'Cặp đôi', value: 'Cặp đôi' },
                { label: 'Bạn bè', value: 'Bạn bè' },
                { label: 'Gia Đình', value: 'Gia Đình' }
            ]
        },
        {
            label: 'Chỗ ở',
            name: 'accommodation',
            type: 'radio',
            options: [
                { label: 'Khách sạn', value: 'Khách sạn' },
                { label: 'Nhà nghỉ', value: 'Nhà nghỉ' },
                { label: 'Homestay', value: 'Homestay' },
                { label: 'Resort', value: 'Resort' }
            ]
        }
    ]

    // Render form
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-blue-800">
                    Nhập thông tin chuyến đi ({step}/9)
                </h2>
                <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <svg
                        className="w-6 h-6"
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
                </button>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-1">
                    {formFields[step - 1].label}
                </label>
                {formFields[step - 1].type === 'checkbox' ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {formFields[step - 1].options.map((option) => (
                            <label
                                key={option.value}
                                className="flex items-center p-2 bg-white border rounded-full hover:bg-gray-100 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    name={formFields[step - 1].name}
                                    value={option.value}
                                    checked={formData[
                                        formFields[step - 1].name
                                    ].includes(option.value)}
                                    onChange={handleChange}
                                    className="hidden"
                                />
                                <span className="flex items-center">
                                    <span className="mr-2">{option.emoji}</span>
                                    <span className="text-sm">
                                        {option.label}
                                    </span>
                                </span>
                            </label>
                        ))}
                    </div>
                ) : formFields[step - 1].type === 'radio' ? (
                    <div className="space-y-2">
                        {formFields[step - 1].options.map((option) => (
                            <label
                                key={option.value}
                                className="flex items-center p-2 bg-white border rounded-lg cursor-pointer"
                            >
                                <input
                                    type="radio"
                                    name={formFields[step - 1].name}
                                    value={option.value}
                                    checked={
                                        formData[formFields[step - 1].name] ===
                                        option.value
                                    }
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                <span className="text-sm">{option.label}</span>
                            </label>
                        ))}
                    </div>
                ) : (
                    <input
                        type={formFields[step - 1].type}
                        name={formFields[step - 1].name}
                        value={formData[formFields[step - 1].name]}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder={formFields[step - 1].placeholder}
                        min={formFields[step - 1].min}
                        step={formFields[step - 1].step}
                        required={formFields[step - 1].required}
                    />
                )}
                {formFields[step - 1].type === 'checkbox' && (
                    <p className="text-sm text-gray-500 mt-2">
                        {formData[formFields[step - 1].name].length}{' '}
                        {formFields[step - 1].name === 'transportation'
                            ? 'phương tiện'
                            : 'interests'}{' '}
                        selected
                    </p>
                )}
            </div>
            <div className="flex justify-between mt-6">
                <button
                    onClick={handleBack}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                        step === 1
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                    }`}
                    disabled={step === 1}
                >
                    Quay lại
                </button>
                {step < 9 ? (
                    <button
                        onClick={handleNext}
                        className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
                    >
                        Tiếp theo
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
                    >
                        Tạo lịch trình
                    </button>
                )}
            </div>
        </div>
    )
}

export default TravelForm
