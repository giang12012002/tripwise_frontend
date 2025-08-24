import React, { useState, useEffect } from 'react'
import reportSystemAPI from '@/apis/reportSystemAPI.js'
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'
import {
    FaUsers,
    FaStar,
    FaComments,
    FaRegStar,
    FaUsersCog,
    FaMap,
    FaBook,
    FaShoppingCart,
    FaTicketAlt,
    FaShoppingBag,
    FaBan
} from 'react-icons/fa'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

const SystemStatsPage = () => {
    const [year, setYear] = useState(new Date().getFullYear())
    const [stats, setStats] = useState([])
    const [dashboardStats, setDashboardStats] = useState(null)
    const [loading, setLoading] = useState(false)
    const [dashboardLoading, setDashboardLoading] = useState(false)
    const [error, setError] = useState(null)
    const [dashboardError, setDashboardError] = useState(null)

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true)
            setError(null)
            try {
                const data = await reportSystemAPI.getAnnualAdminStats(year)
                const monthlyStats = Array.from({ length: 12 }, (_, month) => {
                    const stat = data.find(
                        (s) => Number(s.month) === month + 1
                    ) || {
                        month: month + 1,
                        bookingRevenue: 0,
                        planRevenue: 0,
                        cancelledRevenue: 0,
                        totalBookings: 0,
                        totalPlans: 0,
                        totalCancelled: 0
                    }
                    return {
                        month: Number(stat.month) || month + 1,
                        bookingRevenue: Number(stat.bookingRevenue) || 0,
                        planRevenue: Number(stat.planRevenue) || 0,
                        cancelledRevenue: Number(stat.cancelledRevenue) || 0,
                        totalBookings: Number(stat.totalBookings) || 0,
                        totalPlans: Number(stat.totalPlans) || 0,
                        totalCancelled: Number(stat.totalCancelled) || 0
                    }
                })
                setStats(monthlyStats)
            } catch (err) {
                console.error('Error fetching stats:', err)
                setError('Không thể tải thống kê hệ thống. Vui lòng thử lại.')
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [year])

    useEffect(() => {
        const fetchDashboardStats = async () => {
            setDashboardLoading(true)
            setDashboardError(null)
            try {
                const data = await reportSystemAPI.fetchDashboardStatistics()
                console.log('Dashboard Stats Data:', data)
                const stats = Array.isArray(data) ? data[0] || {} : data || {}
                const normalizedStats = {
                    totalUsers: stats.TotalUsers || stats.totalUsers || 0,
                    totalReviews: stats.TotalReviews || stats.totalReviews || 0,
                    totalComments:
                        stats.TotalComments || stats.totalComments || 0,
                    totalStarRatings:
                        stats.TotalStarRatings || stats.totalStarRatings || 0,
                    totalPartners:
                        stats.TotalPartners || stats.totalPartners || 0,
                    totalTours: stats.TotalTours || stats.totalTours || 0,
                    totalBlogs: stats.TotalBlogs || stats.totalBlogs || 0,
                    totalPlans: stats.TotalPlans || stats.totalPlans || 0,
                    totalTourBookings:
                        stats.TotalTourBookings || stats.totalTourBookings || 0,
                    totalPlanPurchases:
                        stats.TotalPlanPurchases ||
                        stats.totalPlanPurchases ||
                        0,
                    totalCancelled:
                        stats.TotalCancelled || stats.totalCancelled || 0
                }
                setDashboardStats(normalizedStats)
            } catch (err) {
                console.error('Error fetching dashboard stats:', err)
                setDashboardError(
                    `Không thể tải thống kê tổng quan: ${err.message}. Vui lòng thử lại.`
                )
            } finally {
                setDashboardLoading(false)
            }
        }
        fetchDashboardStats()
    }, [])

    const totalBookingRevenue = stats.reduce(
        (sum, stat) => sum + (Number(stat.bookingRevenue) || 0),
        0
    )
    const totalPlanRevenue = stats.reduce(
        (sum, stat) => sum + (Number(stat.planRevenue) || 0),
        0
    )
    const totalCancelledRevenue = stats.reduce(
        (sum, stat) => sum + (Number(stat.cancelledRevenue) || 0),
        0
    )
    const totalRevenue =
        totalBookingRevenue + totalPlanRevenue + totalCancelledRevenue

    const chartData = {
        labels: stats.map((stat) => `Tháng ${stat.month}`),
        datasets: [
            {
                label: 'Doanh Thu Đặt Tour (VND)',
                data: stats.map((stat) => Number(stat.bookingRevenue) || 0),
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6
            },
            {
                label: 'Doanh Thu Bán Gói (VND)',
                data: stats.map((stat) => Number(stat.planRevenue) || 0),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6
            },
            {
                label: 'Doanh Thu Hủy Tour (VND)',
                data: stats.map((stat) => Number(stat.cancelledRevenue) || 0),
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6
            },
            {
                label: 'Tổng Doanh Thu (VND)',
                data: stats.map(
                    (stat) =>
                        (Number(stat.bookingRevenue) || 0) +
                        (Number(stat.planRevenue) || 0) +
                        (Number(stat.cancelledRevenue) || 0)
                ),
                borderColor: '#8b5cf6', // Màu tím để phân biệt
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6
            }
        ]
    }
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: {
                display: true,
                text: `Xu Hướng Doanh Thu Theo Tháng Năm ${year}`
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.raw
                        return `${context.dataset.label}: ${formatCurrency(value)}`
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Doanh Thu (VND)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Tháng'
                }
            }
        }
    }

    const handleYearChange = (e) => {
        setYear(parseInt(e.target.value))
    }

    const yearOptions = Array.from(
        { length: 5 },
        (_, i) => new Date().getFullYear() - i
    )

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Tổng Quan</h1>

            {/* Year Selector */}
            <div className="mb-6">
                <label
                    htmlFor="year"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Năm
                </label>
                <select
                    id="year"
                    value={year}
                    onChange={handleYearChange}
                    className="block w-full max-w-xs p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                    {yearOptions.map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>
            </div>

            {/* Error Message for Annual Stats */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {/* Loading State for Annual Stats */}
            {loading && (
                <div className="text-center text-gray-600">
                    Đang tải thống kê...
                </div>
            )}

            {/* Summary Statistics */}
            {!loading && stats.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-500 text-white p-4 rounded-lg text-center">
                        <FaMap className="mx-auto mb-2 text-2xl" />
                        <h2 className="text-lg font-semibold">
                            Số lượng Tour đã bán
                        </h2>
                        <p className="text-2xl">
                            {stats.reduce(
                                (sum, stat) =>
                                    sum + (Number(stat.totalBookings) || 0),
                                0
                            )}
                        </p>
                        <p className="text-sm text-gray-200">Tổng đặt tour</p>
                    </div>
                    <div className="bg-green-500 text-white p-4 rounded-lg shadow-md text-center">
                        <FaShoppingCart className="mx-auto mb-2 text-2xl" />
                        <h2 className="text-lg font-semibold">
                            Số lượng gói đã bán
                        </h2>
                        <p className="text-2xl">
                            {stats.reduce(
                                (sum, stat) =>
                                    sum + (Number(stat.totalPlans) || 0),
                                0
                            )}
                        </p>
                        <p className="text-sm text-gray-200">Tổng gói</p>
                    </div>
                    <div className="bg-red-500 text-white p-4 rounded-lg shadow-md text-center">
                        <FaBan className="mx-auto mb-2 text-2xl" />
                        <h2 className="text-lg font-semibold">
                            Số lượng hủy Tour
                        </h2>
                        <p className="text-2xl">
                            {stats.reduce(
                                (sum, stat) =>
                                    sum + (Number(stat.totalCancelled) || 0),
                                0
                            )}
                        </p>
                        <p className="text-sm text-gray-200">Tổng hủy</p>
                    </div>
                </div>
            )}
            {/* Revenue Breakdown */}
            {!loading && stats.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {/* Doanh Thu Đặt Tour */}
                    <div className="bg-white p-6 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">
                            Doanh Thu Đặt Tour
                        </h2>
                        <p className="text-2xl font-bold text-blue-600">
                            {formatCurrency(totalBookingRevenue)}
                        </p>
                        <div className="mt-2 h-1 bg-blue-100 rounded-full">
                            <div
                                className="h-full bg-blue-600 rounded-full"
                                style={{
                                    width: `${(totalBookingRevenue / totalRevenue) * 100 || 0}%`
                                }}
                            ></div>
                        </div>
                    </div>

                    {/* Doanh Thu Bán Gói */}
                    <div className="bg-white p-6 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">
                            Doanh Thu Bán Gói
                        </h2>
                        <p className="text-2xl font-bold text-green-600">
                            {formatCurrency(totalPlanRevenue)}
                        </p>
                        <div className="mt-2 h-1 bg-green-100 rounded-full">
                            <div
                                className="h-full bg-green-600 rounded-full"
                                style={{
                                    width: `${(totalPlanRevenue / totalRevenue) * 100 || 0}%`
                                }}
                            ></div>
                        </div>
                    </div>

                    {/* Doanh Thu Bị Hủy */}
                    <div className="bg-white p-6 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">
                            Doanh Thu Hủy Tour
                        </h2>
                        <p className="text-2xl font-bold text-red-600">
                            {formatCurrency(totalCancelledRevenue)}
                        </p>
                        <div className="mt-2 h-1 bg-red-100 rounded-full">
                            <div
                                className="h-full bg-red-600 rounded-full"
                                style={{
                                    width: `${(totalCancelledRevenue / totalRevenue) * 100 || 0}%`
                                }}
                            ></div>
                        </div>
                    </div>

                    {/* Tổng Doanh Thu */}
                    <div className="bg-white p-6 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">
                            Tổng Doanh Thu
                        </h2>
                        <p className="text-2xl font-bold text-purple-600">
                            {formatCurrency(totalRevenue)}
                        </p>
                        <div className="mt-2 h-1 bg-purple-100 rounded-full">
                            <div
                                className="h-full bg-purple-600 rounded-full"
                                style={{ width: '100%' }}
                            ></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Chart */}
            {!loading && stats.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <Line data={chartData} options={chartOptions} />
                </div>
            )}

            {/* Dashboard Statistics */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    Thống Kê Tổng Quan Hệ Thống
                </h2>

                {/* Error Message for Dashboard Stats */}
                {dashboardError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {dashboardError}
                    </div>
                )}

                {/* Loading State for Dashboard Stats */}
                {dashboardLoading && (
                    <div className="text-center text-gray-600">
                        Đang tải thống kê tổng quan...
                    </div>
                )}

                {/* Dashboard Stats Grid */}
                {!dashboardLoading && dashboardStats && (
                    <div className="space-y-6">
                        {/* Khách Hàng Section */}
                        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                                Khách Hàng
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="bg-gray-50 p-6 rounded-lg text-center hover:scale-105 transition duration-200">
                                    <FaUsers className="mx-auto mb-3 text-4xl text-blue-500" />
                                    <h4 className="text-base font-semibold text-gray-800">
                                        Tổng Khách Hàng
                                    </h4>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {dashboardStats.totalUsers}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Khách Hàng
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-lg text-center hover:scale-105 transition duration-200">
                                    <FaComments className="mx-auto mb-3 text-4xl text-green-500" />
                                    <h4 className="text-base font-semibold text-gray-800">
                                        Tổng Bình Luận
                                    </h4>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {dashboardStats.totalComments}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Bình Luận
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-lg text-center hover:scale-105 transition duration-200">
                                    <FaStar className="mx-auto mb-3 text-4xl text-yellow-500" />
                                    <h4 className="text-base font-semibold text-gray-800">
                                        Tổng Đánh Giá
                                    </h4>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {dashboardStats.totalReviews}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Đánh Giá
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Đối Tác Section */}
                        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                                Đối Tác
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-6 rounded-lg text-center hover:scale-105 transition duration-200">
                                    <FaUsersCog className="mx-auto mb-3 text-4xl text-indigo-500" />
                                    <h4 className="text-base font-semibold text-gray-800">
                                        Tổng Đối Tác
                                    </h4>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {dashboardStats.totalPartners}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Đối Tác
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-lg text-center hover:scale-105 transition duration-200">
                                    <FaMap className="mx-auto mb-3 text-4xl text-teal-500" />
                                    <h4 className="text-base font-semibold text-gray-800">
                                        Tổng Tour
                                    </h4>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {dashboardStats.totalTours}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Tour
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Other Section */}
                        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                                Khác
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="bg-gray-50 p-6 rounded-lg text-center hover:scale-105 transition duration-200">
                                    <FaBook className="mx-auto mb-3 text-4xl text-purple-500" />
                                    <h4 className="text-base font-semibold text-gray-800">
                                        Tổng Bài Blog
                                    </h4>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {dashboardStats.totalBlogs}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Bài Viết
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-lg text-center hover:scale-105 transition duration-200">
                                    <FaShoppingCart className="mx-auto mb-3 text-4xl text-gray-600" />
                                    <h4 className="text-base font-semibold text-gray-800">
                                        Tổng Gói
                                    </h4>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {dashboardStats.totalPlans}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Gói
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-lg text-center hover:scale-105 transition duration-200">
                                    <FaRegStar className="mx-auto mb-3 text-4xl text-amber-500" />
                                    <h4 className="text-base font-semibold text-gray-800">
                                        Tổng Điểm Đánh Giá
                                    </h4>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {dashboardStats.totalStarRatings}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Điểm Số
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* No Data Message for Annual Stats */}
            {!loading && stats.length === 0 && !error && (
                <div className="text-center text-gray-600">
                    Không có thống kê cho năm được chọn.
                </div>
            )}
        </div>
    )
}

export default SystemStatsPage
