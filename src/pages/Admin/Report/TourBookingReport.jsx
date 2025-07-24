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

const TourBookingReport = ({ data, onExport, loading }) => {
    const formatCurrency = (amount) => {
        const validAmount =
            typeof amount === 'number' && !isNaN(amount) ? amount : 0
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(validAmount)
    }

    // Chuẩn bị dữ liệu cho biểu đồ (BarChart) - nhóm theo tour
    const chartData = data.map((item) => ({
        name: item.tourName || 'N/A',
        totalBookings: item.totalBookings || 0,
        totalRevenue: item.totalRevenue || 0
    }))

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">
                    Thống Kê Đặt Tour
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
            {/* Biểu đồ */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h4 className="text-lg font-medium mb-4 text-gray-700">
                    So Sánh Đặt Tour Theo Tour
                </h4>
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
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
                        Không có dữ liệu để hiển thị biểu đồ.
                    </p>
                )}
            </div>
            {/* Bảng */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                {data.length === 0 && !loading && (
                    <p className="text-red-500 p-4">
                        Không có dữ liệu thống kê đặt tour cho khoảng thời gian
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
                                Mã Tour
                            </th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tên Tour
                            </th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Số lượt đặt
                            </th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tổng doanh thu
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="py-4 px-6">{index + 1}</td>
                                <td className="py-4 px-6">
                                    {item.month || 'N/A'}
                                </td>
                                <td className="py-4 px-6">
                                    {item.tourID || 'N/A'}
                                </td>
                                <td className="py-4 px-6">
                                    {item.tourName || 'N/A'}
                                </td>
                                <td className="py-4 px-6">
                                    {item.totalBookings || 0}
                                </td>
                                <td className="py-4 px-6">
                                    {formatCurrency(item.totalRevenue)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TourBookingReport
