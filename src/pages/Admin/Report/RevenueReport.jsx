import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts'

const RevenueReport = ({ data, onExport, loading }) => {
    const { details, totals } = data
    const [selectedMonth, setSelectedMonth] = useState('')
    const [searchUserID, setSearchUserID] = useState('')

    // Synchronize selectedMonth with totals when data is available
    useEffect(() => {
        if (totals.length > 0 && !selectedMonth) {
            setSelectedMonth(totals[0].month || '')
        }
    }, [totals, selectedMonth])

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)

    const isValidDate = (date) => {
        return date && !isNaN(new Date(date).getTime())
    }

    // Prepare data for bar chart of total combined revenue by month
    const totalCombinedBarData = totals.map((item) => ({
        month: item.month || 'N/A',
        totalCombined: item.totalCombinedRevenue || 0
    }))

    // Prepare data for pie chart of tour vs plan revenue for the selected month
    const getPieData = (month) => {
        const selectedTotal = totals.find((item) => item.month === month)
        if (!selectedTotal) {
            return [
                { name: 'Tổng Tour', value: 0, percentage: 0 },
                { name: 'Tổng Gói', value: 0, percentage: 0 }
            ]
        }
        const totalTour = selectedTotal.totalBookingRevenue || 0
        const totalPlan = selectedTotal.totalPlanRevenue || 0
        const total = totalTour + totalPlan
        const tourPercentage = total ? (totalTour / total) * 100 : 0
        const planPercentage = total ? (totalPlan / total) * 100 : 0
        return [
            { name: 'Tổng Tour', value: totalTour, percentage: tourPercentage },
            { name: 'Tổng Gói', value: totalPlan, percentage: planPercentage }
        ]
    }

    // Filter details based on exact match for searchUserID
    const filteredDetails = details.filter((item) => {
        if (!searchUserID) return true // Show all data if search input is empty
        const userID = item.userID != null ? String(item.userID) : ''
        return userID.toLowerCase() === searchUserID.toLowerCase()
    })

    const COLORS = ['#8884d8', '#82ca9d']

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">
                    Báo Cáo Doanh Thu
                </h3>
                <button
                    onClick={onExport}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 transition duration-200"
                >
                    {loading ? 'Đang xuất...' : 'Xuất Excel'}
                </button>
            </div>
            {loading && (
                <p className="text-blue-600 font-medium">Đang tải dữ liệu...</p>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart for Total Combined Revenue by Month */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h4 className="text-lg font-medium mb-4 text-gray-700">
                        Tổng Doanh Thu Theo Tháng
                    </h4>
                    {totals.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={totalCombinedBarData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value) => formatCurrency(value)}
                                />
                                <Legend />
                                <Bar
                                    barSize={40}
                                    dataKey="totalCombined"
                                    fill="#ff7300"
                                    name="Tổng Cộng"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-red-500">
                            Không có dữ liệu để hiển thị biểu đồ.
                        </p>
                    )}
                </div>
                {/* Pie Chart for Tour vs Plan Revenue by Selected Month */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h4 className="text-lg font-medium mb-4 text-gray-700">
                        Tỷ Lệ Doanh Thu Tour vs Gói Theo Từng Tháng
                    </h4>
                    <div className="mb-4">
                        <label className="mr-2 text-gray-700">
                            Chọn tháng:
                        </label>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {totals.map((item) => (
                                <option key={item.month} value={item.month}>
                                    {item.month || 'N/A'}
                                </option>
                            ))}
                        </select>
                    </div>
                    {totals.length > 0 && selectedMonth ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={getPieData(selectedMonth)}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label={({ name, percentage }) =>
                                        `${name}: ${percentage.toFixed(1)}%`
                                    }
                                >
                                    {getPieData(selectedMonth).map(
                                        (entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    COLORS[
                                                        index % COLORS.length
                                                    ]
                                                }
                                            />
                                        )
                                    )}
                                </Pie>
                                <Tooltip
                                    formatter={(value, name, props) => [
                                        formatCurrency(value),
                                        `${name} (${props.payload.percentage.toFixed(1)}%)`
                                    ]}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-red-500">
                            Không có dữ liệu để hiển thị biểu đồ.
                        </p>
                    )}
                </div>
            </div>
            {/* Detailed Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <h4 className="text-lg font-medium p-4 text-gray-700">
                    Chi Tiết Doanh Thu
                </h4>
                <div className="p-4">
                    <label className="mr-2 text-gray-700">
                        Tìm kiếm theo Mã người dùng:
                    </label>
                    <input
                        type="text"
                        value={searchUserID}
                        onChange={(e) => setSearchUserID(e.target.value)}
                        placeholder="Nhập mã người dùng..."
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-md"
                    />
                </div>
                {filteredDetails.length === 0 && !loading && (
                    <p className="text-red-500 p-4">
                        Không có dữ liệu doanh thu cho khoảng thời gian này hoặc
                        mã người dùng này.
                    </p>
                )}
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                STT
                            </th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tháng
                            </th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Loại giao dịch
                            </th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tên mặt hàng
                            </th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Số tiền
                            </th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mã người dùng
                            </th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Họ tên
                            </th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ngày giao dịch
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredDetails.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="py-4 px-6">{index + 1}</td>
                                <td className="py-4 px-6">
                                    {item.month || 'N/A'}
                                </td>
                                <td className="py-4 px-6">
                                    {item.transactionType || 'N/A'}
                                </td>
                                <td className="py-4 px-6">
                                    {item.itemDescription || 'N/A'}
                                </td>
                                <td className="py-4 px-6">
                                    {formatCurrency(item.amount || 0)}
                                </td>
                                <td className="py-4 px-6">
                                    {item.userID || 'N/A'}
                                </td>
                                <td className="py-4 px-6">
                                    {item.email || 'N/A'}
                                </td>
                                <td className="py-4 px-6">
                                    {item.fullName || 'N/A'}
                                </td>
                                <td className="py-4 px-6">
                                    {isValidDate(item.transactionDate)
                                        ? format(
                                              new Date(item.transactionDate),
                                              'dd/MM/yyyy HH:mm:ss'
                                          )
                                        : 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Total Revenue Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <h4 className="text-lg font-medium p-4 text-gray-700">
                    Tổng Doanh Thu Theo Tháng
                </h4>
                {totals.length === 0 && !loading && (
                    <p className="text-red-500 p-4">
                        Không có dữ liệu tổng doanh thu cho khoảng thời gian
                        này.
                    </p>
                )}
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                STT
                            </th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tháng
                            </th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tổng tour
                            </th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tổng gói
                            </th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tổng cộng
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {totals.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="py-4 px-6">{index + 1}</td>
                                <td className="py-4 px-6">
                                    {item.month || 'N/A'}
                                </td>
                                <td className="py-4 px-6">
                                    {formatCurrency(
                                        item.totalBookingRevenue || 0
                                    )}
                                </td>
                                <td className="py-4 px-6">
                                    {formatCurrency(item.totalPlanRevenue || 0)}
                                </td>
                                <td className="py-4 px-6">
                                    {formatCurrency(
                                        item.totalCombinedRevenue || 0
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default RevenueReport
