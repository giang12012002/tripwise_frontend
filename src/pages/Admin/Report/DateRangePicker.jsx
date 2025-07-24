import { useState, useEffect } from 'react'
import { format, subDays } from 'date-fns'

const DateRangePicker = ({ onDateChange }) => {
    const [fromDate, setFromDate] = useState(
        format(subDays(new Date(), 30), 'yyyy-MM-dd')
    )
    const [toDate, setToDate] = useState(format(new Date(), 'yyyy-MM-dd'))

    useEffect(() => {
        onDateChange(fromDate, toDate)
    }, [])

    const handleSubmit = () => {
        if (fromDate && toDate) {
            onDateChange(fromDate, toDate)
        }
    }

    return (
        <div className="flex space-x-4 mb-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Từ ngày
                </label>
                <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="mt-1 p-2 border rounded-md"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Đến ngày
                </label>
                <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="mt-1 p-2 border rounded-md"
                />
            </div>
            <button
                onClick={handleSubmit}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
                Lọc
            </button>
        </div>
    )
}

export default DateRangePicker
