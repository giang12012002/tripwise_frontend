import { useState, useEffect } from 'react'
import { format } from 'date-fns'

const DateRangePicker = ({ onDateChange }) => {
    const currentYear = new Date().getFullYear()
    const [fromDate, setFromDate] = useState(
        format(new Date(currentYear, 0, 1), 'yyyy-MM-dd')
    )
    const [toDate, setToDate] = useState(
        format(new Date(currentYear, 11, 31), 'yyyy-MM-dd')
    )

    useEffect(() => {
        if (fromDate && toDate) {
            onDateChange(fromDate, toDate)
        }
    }, [fromDate, toDate, onDateChange])

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
        </div>
    )
}

export default DateRangePicker
