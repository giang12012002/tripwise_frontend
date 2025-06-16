import React, { useState } from 'react'

function ItineraryDisplay({ itineraryData }) {
    const [openDays, setOpenDays] = useState({})

    const toggleDay = (dayNumber) => {
        setOpenDays((prev) => ({ ...prev, [dayNumber]: !prev[dayNumber] }))
    }
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value)
    }

    return (
        <div className="max-w-6xl w-full p-6 bg-white rounded-lg shadow-lg mt-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">
                Lịch trình du lịch tại {itineraryData.destination}
            </h2>
            <div className="mb-4">
                <p>
                    <strong>Số ngày:</strong> {itineraryData.days}
                </p>
                <p>
                    <strong>Ngân sách:</strong>{' '}
                    {formatCurrency(itineraryData.budget)}
                </p>
                <p>
                    <strong>Tổng chi phí ước tính:</strong>{' '}
                    {formatCurrency(itineraryData.totalEstimatedCost)}
                </p>
                <p>
                    <strong>Ngày đi:</strong>{' '}
                    {new Date(itineraryData.travelDate).toLocaleDateString(
                        'vi-VN'
                    )}
                </p>
                <p>
                    <strong>Sở thích:</strong>{' '}
                    {itineraryData.preferences || 'Không xác định'}
                </p>
                <p>
                    <strong>Phương tiện:</strong>{' '}
                    {itineraryData.transportation || 'Không xác định'}
                </p>
                <p>
                    <strong>Phong cách ăn uống:</strong>{' '}
                    {itineraryData.diningStyle || 'Không xác định'}
                </p>
                <p>
                    <strong>Nhóm:</strong>{' '}
                    {itineraryData.groupType || 'Không xác định'}
                </p>
                <p>
                    <strong>Chỗ ở:</strong>{' '}
                    {itineraryData.accommodation || 'Không xác định'}
                </p>
                <p>
                    <strong>Đề xuất chỗ ở:</strong>{' '}
                    <a
                        href={itineraryData.suggestedAccommodation}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        Tìm khách sạn trên Google Maps
                    </a>
                </p>
            </div>
            <h3 className="text-xl font-semibold text-blue-800 mb-4">
                Chi tiết lịch trình
            </h3>
            {itineraryData.itinerary.map((day) => (
                <div key={day.dayNumber} className="mb-4 border rounded-lg">
                    <button
                        onClick={() => toggleDay(day.dayNumber)}
                        className="w-full p-4 text-left bg-blue-100 hover:bg-blue-200 transition-colors flex justify-between items-center"
                    >
                        <span className="font-semibold">
                            {day.title} (Ngày {day.dayNumber})
                        </span>
                        <span>{openDays[day.dayNumber] ? '▲' : '▼'}</span>
                    </button>
                    {openDays[day.dayNumber] && (
                        <div className="p-4">
                            <p>
                                <strong>Chi phí ngày:</strong>{' '}
                                {formatCurrency(day.dailyCost)}
                            </p>
                            <ul className="mt-2 space-y-4">
                                {day.activities.map((activity, index) => (
                                    <li
                                        key={index}
                                        className="border-l-4 border-blue-600 pl-4"
                                    >
                                        <p>
                                            <strong>Thời gian:</strong>{' '}
                                            {activity.timeOfDay}
                                        </p>
                                        <p>
                                            <strong>Hoạt động:</strong>{' '}
                                            {activity.description}
                                        </p>
                                        <p>
                                            <strong>Chi phí ước tính:</strong>{' '}
                                            {formatCurrency(
                                                activity.estimatedCost
                                            )}
                                        </p>
                                        <p>
                                            <strong>Phương tiện:</strong>{' '}
                                            {activity.transportation ||
                                                'Không xác định'}
                                        </p>
                                        {activity.address && (
                                            <p>
                                                <strong>Địa chỉ:</strong>{' '}
                                                <a
                                                    href={activity.mapUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {activity.address}
                                                </a>
                                            </p>
                                        )}
                                        <p>
                                            <strong>Chi tiết:</strong>{' '}
                                            {activity.placeDetail}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default ItineraryDisplay
