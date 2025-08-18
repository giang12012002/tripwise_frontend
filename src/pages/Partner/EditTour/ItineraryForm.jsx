import React from 'react'

function ItineraryForm({ itinerary, onChange }) {
    const handleDayAdd = () => {
        const newDay = {
            dayNumber: itinerary.length + 1,
            title: '',
            dailyCost: 0,
            activities: []
        }
        onChange([...itinerary, newDay])
    }

    const handleDayRemove = (dayIndex) => {
        const updated = itinerary.filter((_, i) => i !== dayIndex)
        updated.forEach((d, i) => (d.dayNumber = i + 1))
        onChange(updated)
    }

    const handleActivityAdd = (dayIndex) => {
        const updated = [...itinerary]
        updated[dayIndex].activities.push({
            description: '',
            address: '',
            startTime: '',
            endTime: '',
            estimatedCost: 0,
            imageUrl: ''
        })
        onChange(updated)
    }

    const handleActivityRemove = (dayIndex, actIndex) => {
        const updated = [...itinerary]
        updated[dayIndex].activities.splice(actIndex, 1)
        onChange(updated)
    }

    const handleActivityImage = (dayIndex, actIndex, file) => {
        const updated = [...itinerary]
        updated[dayIndex].activities[actIndex].imageUrl =
            URL.createObjectURL(file)
        onChange(updated)
    }

    return (
        <div className="border p-4 rounded bg-white">
            <h3 className="text-xl font-bold">Lịch trình</h3>

            {itinerary.map((day, dayIndex) => (
                <div
                    key={dayIndex}
                    className="border p-3 rounded mt-4 bg-gray-50"
                >
                    <div className="flex justify-between items-center">
                        <h4 className="font-bold">Ngày {day.dayNumber}</h4>
                        <button
                            type="button"
                            onClick={() => handleDayRemove(dayIndex)}
                            className="text-red-500 text-sm"
                        >
                            Xóa ngày
                        </button>
                    </div>

                    <input
                        type="text"
                        placeholder="Tiêu đề"
                        value={day.title}
                        onChange={(e) => {
                            const updated = [...itinerary]
                            updated[dayIndex].title = e.target.value
                            onChange(updated)
                        }}
                        className="border p-2 w-full rounded mt-2"
                    />

                    <input
                        type="number"
                        min="0"
                        step="1000"
                        placeholder="Chi phí trong ngày"
                        value={day.dailyCost}
                        onChange={(e) => {
                            const updated = [...itinerary]
                            updated[dayIndex].dailyCost = e.target.value
                            onChange(updated)
                        }}
                        className="border p-2 w-full rounded mt-2"
                    />

                    <div className="mt-3">
                        <h5 className="font-semibold">Hoạt động</h5>
                        {day.activities.map((act, actIndex) => (
                            <div
                                key={actIndex}
                                className="border p-2 rounded bg-white mt-2 relative"
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleActivityRemove(dayIndex, actIndex)
                                    }
                                    className="absolute top-1 right-1 text-red-500 text-xs"
                                >
                                    ×
                                </button>
                                <input
                                    type="text"
                                    placeholder="Tên địa điểm"
                                    value={act.description}
                                    onChange={(e) => {
                                        const updated = [...itinerary]
                                        updated[dayIndex].activities[
                                            actIndex
                                        ].description = e.target.value
                                        onChange(updated)
                                    }}
                                    className="border p-2 w-full rounded mb-1"
                                />
                                <input
                                    type="text"
                                    placeholder="Địa chỉ"
                                    value={act.address}
                                    onChange={(e) => {
                                        const updated = [...itinerary]
                                        updated[dayIndex].activities[
                                            actIndex
                                        ].address = e.target.value
                                        onChange(updated)
                                    }}
                                    className="border p-2 w-full rounded mb-1"
                                />
                                <input
                                    type="time"
                                    value={act.startTime}
                                    onChange={(e) => {
                                        const updated = [...itinerary]
                                        updated[dayIndex].activities[
                                            actIndex
                                        ].startTime = e.target.value
                                        onChange(updated)
                                    }}
                                    className="border p-2 w-full rounded mb-1"
                                />
                                <input
                                    type="time"
                                    value={act.endTime}
                                    onChange={(e) => {
                                        const updated = [...itinerary]
                                        updated[dayIndex].activities[
                                            actIndex
                                        ].endTime = e.target.value
                                        onChange(updated)
                                    }}
                                    className="border p-2 w-full rounded mb-1"
                                />
                                <div className="flex items-center">
                                    <input
                                        type="number"
                                        min="0"
                                        step="1000"
                                        placeholder="Chi phí"
                                        value={act.estimatedCost}
                                        onChange={(e) => {
                                            const updated = [...itinerary]
                                            updated[dayIndex].activities[
                                                actIndex
                                            ].estimatedCost = e.target.value
                                            onChange(updated)
                                        }}
                                        className="border p-2 w-full rounded"
                                    />
                                    <span className="ml-2">đ</span>
                                </div>

                                {act.imageUrl ? (
                                    <div className="mt-2 relative">
                                        <img
                                            src={act.imageUrl}
                                            alt="activity"
                                            className="w-24 h-24 object-cover rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const updated = [...itinerary]
                                                updated[dayIndex].activities[
                                                    actIndex
                                                ].imageUrl = ''
                                                onChange(updated)
                                            }}
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 text-xs"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            handleActivityImage(
                                                dayIndex,
                                                actIndex,
                                                e.target.files[0]
                                            )
                                        }
                                        className="mt-2"
                                    />
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={() => handleActivityAdd(dayIndex)}
                            className="mt-2 text-blue-500 text-sm"
                        >
                            + Thêm hoạt động
                        </button>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={handleDayAdd}
                className="mt-4 bg-green-500 text-white px-3 py-1 rounded"
            >
                + Thêm ngày
            </button>
        </div>
    )
}

export default ItineraryForm
