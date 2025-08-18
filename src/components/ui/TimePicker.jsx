import React, { useState, useRef, useEffect } from 'react'

const TimePicker = ({ value, onChange, placeholder = 'Chọn giờ' }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedHour, setSelectedHour] = useState('09')
    const [selectedMinute, setSelectedMinute] = useState('00')
    const dropdownRef = useRef(null)

    // Parse initial value
    useEffect(() => {
        if (value) {
            const [hour, minute] = value.split(':')
            setSelectedHour(hour.padStart(2, '0'))
            setSelectedMinute(minute.padStart(2, '0'))
        }
    }, [value])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Generate hours (00-23)
    const hours = Array.from({ length: 24 }, (_, i) =>
        i.toString().padStart(2, '0')
    )

    // Generate minutes (00-59)
    const minutes = Array.from({ length: 60 }, (_, i) =>
        i.toString().padStart(2, '0')
    )

    const handleHourSelect = (hour) => {
        setSelectedHour(hour)
        const timeValue = `${hour}:${selectedMinute}`
        onChange(timeValue)
        // Không đóng dropdown, để người dùng chọn tiếp phút
    }

    const handleMinuteSelect = (minute) => {
        setSelectedMinute(minute)
        const timeValue = `${selectedHour}:${minute}`
        onChange(timeValue)
        // Đóng dropdown sau khi chọn xong phút
        setIsOpen(false)
    }

    const handleQuickSelect = (hour, minute) => {
        setSelectedHour(hour)
        setSelectedMinute(minute)
        const timeValue = `${hour}:${minute}`
        onChange(timeValue)
        setIsOpen(false)
    }

    const displayTime = value
        ? `${selectedHour}:${selectedMinute}`
        : placeholder

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Input Display */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer bg-blue-50 flex items-center justify-between hover:bg-gray-50"
            >
                <span className={value ? 'text-gray-900' : 'text-gray-500'}>
                    {displayTime}
                </span>
                <svg
                    className={`w-5 h-5 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                    <div className="flex" style={{ height: '280px' }}>
                        {/* Hours Column */}
                        <div className="flex-1 border-r border-gray-200 flex flex-col">
                            <div className="p-2 bg-gray-50 text-center text-sm font-medium text-gray-700 border-b flex-shrink-0">
                                Giờ
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {hours.map((hour) => (
                                    <div
                                        key={hour}
                                        onClick={() => handleHourSelect(hour)}
                                        className={`px-4 py-2 cursor-pointer text-center hover:bg-blue-50 ${
                                            selectedHour === hour
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'text-gray-700'
                                        }`}
                                    >
                                        {hour}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Minutes Column */}
                        <div className="flex-1 flex flex-col">
                            <div className="p-2 bg-gray-50 text-center text-sm font-medium text-gray-700 border-b flex-shrink-0">
                                Phút
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {minutes.map((minute) => (
                                    <div
                                        key={minute}
                                        onClick={() =>
                                            handleMinuteSelect(minute)
                                        }
                                        className={`px-4 py-2 cursor-pointer text-center hover:bg-blue-50 ${
                                            selectedMinute === minute
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'text-gray-700'
                                        }`}
                                    >
                                        {minute}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Select Buttons */}
                    <div className="border-t border-gray-200 p-2 bg-gray-50">
                        <div className="flex flex-wrap gap-1">
                            {[
                                '08:00',
                                '09:00',
                                '12:00',
                                '13:00',
                                '17:00',
                                '18:00'
                            ].map((time) => (
                                <button
                                    key={time}
                                    onClick={() => {
                                        const [h, m] = time.split(':')
                                        handleQuickSelect(h, m)
                                    }}
                                    className="px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-gray-100 text-gray-600"
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TimePicker
