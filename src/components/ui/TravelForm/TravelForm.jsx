import React, { useState } from 'react'
import { travelFormAPI } from '@/apis' // Adjust the import path as needed
import { toast } from 'react-toastify'

function TravelForm({ setItineraryData, setError, setLoading, setShowForm }) {
    const today = new Date().toISOString().split('T')[0]
    const [formData, setFormData] = useState({
        destination: '',
        travelDate: today,
        days: '',
        preferences: '',
        budget: '',
        transportation: '',
        diningStyle: '',
        groupType: '',
        accommodation: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async () => {
        setError(null)
        setLoading(true)

        // Basic validation
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

        try {
            const response = await travelFormAPI.createItinerary(formData)

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

    return (
        <div className="max-w-6xl w-full p-6 bg-white rounded-lg shadow-lg mt-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">
                Nhập thông tin chuyến đi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 mb-1">
                        Điểm đến *
                    </label>
                    <input
                        type="text"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Ví dụ: Đà Lạt"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">
                        Ngày đi *
                    </label>
                    <input
                        type="date"
                        name="travelDate"
                        value={formData.travelDate}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        min={today}
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">
                        Số ngày *
                    </label>
                    <input
                        type="number"
                        name="days"
                        value={formData.days}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Ví dụ: 3"
                        min="1"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">Sở thích</label>
                    <input
                        type="text"
                        name="preferences"
                        value={formData.preferences}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Ví dụ: Khám phá văn hóa"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">
                        Ngân sách (USD) *
                    </label>
                    <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Ví dụ: 200"
                        min="1"
                        step="any"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">
                        Phương tiện di chuyển
                    </label>
                    <input
                        type="text"
                        name="transportation"
                        value={formData.transportation}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Ví dụ: Xe máy"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">
                        Phong cách ăn uống
                    </label>
                    <input
                        type="text"
                        name="diningStyle"
                        value={formData.diningStyle}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Ví dụ: Ẩm thực địa phương"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">
                        Nhóm người
                    </label>
                    <input
                        type="text"
                        name="groupType"
                        value={formData.groupType}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Ví dụ: 2 người"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-1">Chỗ ở</label>
                    <input
                        type="text"
                        name="accommodation"
                        value={formData.accommodation}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Ví dụ: Khách sạn 3 sao"
                    />
                </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
                <button
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                    Hủy
                </button>
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
                >
                    Tạo lịch trình
                </button>
            </div>
        </div>
    )
}

export default TravelForm
