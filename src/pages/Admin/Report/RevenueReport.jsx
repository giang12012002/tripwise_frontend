import { format } from 'date-fns'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts'

const RevenueReport = ({ data, onExport, loading }) => {
    const { details, totals } = data

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)

    const isValidDate = (date) => {
        return date && !isNaN(new Date(date).getTime())
    }

    // Chuẩn bị dữ liệu cho biểu đồ tổng doanh thu (LineChart)
    const totalChartData = totals.map((item) => ({
        month: item.month || 'N/A',
        totalTour: item.totalBookingRevenue || 0,
        totalPlan: item.totalPlanRevenue || 0,
        totalCombined: item.totalCombinedRevenue || 0
    }))

    // Chuẩn bị dữ liệu cho biểu đồ chi tiết (BarChart) - nhóm theo loại giao dịch
    const detailChartData = details.reduce((acc, item) => {
        const type = item.transactionType || 'N/A'
        if (!acc[type]) acc[type] = 0
        acc[type] += item.amount || 0
        return acc
    }, {})
    const detailBarData = Object.entries(detailChartData).map(
        ([type, amount]) => ({
            type,
            amount
        })
    )

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
                {/* Biểu đồ Tổng Doanh Thu Theo Tháng */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h4 className="text-lg font-medium mb-4 text-gray-700">
                        Xu Hướng Doanh Thu Theo Tháng
                    </h4>
                    {totals.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={totalChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value) => formatCurrency(value)}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="totalTour"
                                    stroke="#8884d8"
                                    name="Tổng Tour"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="totalPlan"
                                    stroke="#82ca9d"
                                    name="Tổng Gói"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="totalCombined"
                                    stroke="#ff7300"
                                    name="Tổng Cộng"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-red-500">
                            Không có dữ liệu để hiển thị biểu đồ.
                        </p>
                    )}
                </div>
                {/* Biểu đồ Chi Tiết Doanh Thu */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h4 className="text-lg font-medium mb-4 text-gray-700">
                        Phân Bổ Doanh Thu Theo Loại Giao Dịch
                    </h4>
                    {details.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={detailBarData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="type" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value) => formatCurrency(value)}
                                />
                                <Legend />
                                <Bar
                                    dataKey="amount"
                                    fill="#8884d8"
                                    name="Số Tiền"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-red-500">
                            Không có dữ liệu để hiển thị biểu đồ.
                        </p>
                    )}
                </div>
            </div>
            {/* Bảng Chi Tiết */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <h4 className="text-lg font-medium p-4 text-gray-700">
                    Chi Tiết Doanh Thu
                </h4>
                {details.length === 0 && !loading && (
                    <p className="text-red-500 p-4">
                        Không có dữ liệu doanh thu cho khoảng thời gian này.
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
                        {details.map((item, index) => (
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
            {/* Bảng Tổng Doanh Thu */}
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
