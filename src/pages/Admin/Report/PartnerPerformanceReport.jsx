import { useState } from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts'

const PartnerPerformanceReport = ({
    data,
    onExport,
    loading,
    onMonthChange
}) => {
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().toISOString().slice(0, 7)
    ) // Mặc định là tháng hiện tại (YYYY-MM)
    const [searchPartnerID, setSearchPartnerID] = useState('')

    const formatCurrency = (amount) => {
        const validAmount =
            typeof amount === 'number' && !isNaN(amount) ? amount : 0
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(validAmount)
    }

    const formatYAxis = (value) => {
        if (value >= 1_000_000_000) {
            const billion = value / 1_000_000_000
            return Number.isInteger(billion)
                ? `${billion} tỷ`
                : `${billion.toFixed(1)} tỷ`
        } else if (value >= 1_000_000) {
            const million = value / 1_000_000
            return Number.isInteger(million)
                ? `${million} triệu`
                : `${million.toFixed(1)} triệu`
        }
        return value
    }

    // Chuẩn bị dữ liệu cho biểu đồ (BarChart)
    const chartData = data.map((item) => ({
        name: item.partnerName || 'N/A',
        totalBookings: item.totalBookings || 0,
        totalRevenue: item.totalRevenue || 0,
        totalCancelled: item.totalCancelled || 0,
        cancelledRevenue: item.cancelledRevenue || 0
    }))

    // Danh sách tháng/năm để chọn
    const generateMonthOptions = () => {
        const options = []
        const currentDate = new Date()
        for (let i = 0; i < 12; i++) {
            const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() - i,
                1
            )
            const value = date.toISOString().slice(0, 7) // YYYY-MM
            const label = `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`
            options.push({ value, label })
        }
        return options
    }

    // Filter data based on searchPartnerID
    const filteredData = data.filter((item) => {
        const partnerID = item.partnerID != null ? String(item.partnerID) : ''
        return partnerID.toLowerCase().includes(searchPartnerID.toLowerCase())
    })

    const handleMonthChange = (e) => {
        const newMonth = e.target.value
        setSelectedMonth(newMonth)
        if (onMonthChange) {
            onMonthChange(newMonth) // Gọi callback để lấy dữ liệu mới từ backend
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">
                    Hiệu Suất Đối Tác Theo Tháng
                </h3>
                <div className="flex items-center space-x-4">
                    <select
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {generateMonthOptions().map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={onExport}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 transition duration-200"
                    >
                        {loading ? 'Đang tải...' : 'Tải xuống báo cáo'}
                    </button>
                </div>
            </div>
            {loading && (
                <p className="text-blue-600 font-medium">Đang tải dữ liệu...</p>
            )}
            {/* Biểu đồ */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h4 className="text-lg font-medium mb-4 text-gray-700">
                    So Sánh Hiệu Suất Đối Tác
                </h4>
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis
                                width={100}
                                tickFormatter={formatYAxis}
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                                formatter={(value, name) =>
                                    name === 'totalRevenue'
                                        ? formatCurrency(value)
                                        : value
                                }
                            />
                            <Legend />
                            <Bar
                                dataKey="totalBookings"
                                fill="#8884d8"
                                name="Số Lượt Đặt"
                            />
                            <Bar
                                dataKey="totalRevenue"
                                fill="#82ca9d"
                                name="Tổng Doanh Thu"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-red-500">
                        Không có dữ liệu để hiển thị biểu đồ cho tháng{' '}
                        {selectedMonth.replace('-', '/')}
                    </p>
                )}
            </div>
            {/* Bảng */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <div className="p-4">
                    <div className="relative w-full max-w-md">
                        <input
                            type="text"
                            value={searchPartnerID}
                            onChange={(e) => setSearchPartnerID(e.target.value)}
                            placeholder="Nhập mã đối tác..."
                            className="p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                        <svg
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>
                {filteredData.length === 0 && !loading && (
                    <p className="text-red-500 p-4">
                        Không có dữ liệu hiệu suất đối tác cho tháng{' '}
                        {selectedMonth.replace('-', '/')} hoặc mã đối tác này.
                    </p>
                )}
                {filteredData.length > 0 && (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    STT
                                </th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mã đối tác
                                </th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tên đối tác
                                </th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Số tour cung cấp
                                </th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Số lượt đặt
                                </th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Số lượt hủy tour
                                </th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Doanh thu hủy tour
                                </th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tổng doanh thu
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredData.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="py-4 px-6">{index + 1}</td>
                                    <td className="py-4 px-6">
                                        {item.partnerID || 'N/A'}
                                    </td>
                                    <td className="py-4 px-6">
                                        {item.partnerName || 'N/A'}
                                    </td>
                                    <td className="py-4 px-6">
                                        {item.totalToursProvided || 0}
                                    </td>
                                    <td className="py-4 px-6">
                                        {item.totalBookings || 0}
                                    </td>
                                    <td className="py-4 px-6">
                                        {item.totalCancelled || 0}
                                    </td>
                                    <td className="py-4 px-6">
                                        {item.cancelledRevenue || 0}
                                    </td>
                                    <td className="py-4 px-6">
                                        {formatCurrency(item.totalRevenue)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default PartnerPerformanceReport
