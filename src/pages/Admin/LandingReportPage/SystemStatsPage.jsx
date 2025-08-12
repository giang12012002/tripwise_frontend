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
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Format currency in VND
    const formatCurrency = (amount) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)

    // Fetch data when year changes
    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true)
            setError(null)
            try {
                const data = await reportSystemAPI.getAnnualAdminStats(year)
                // Ensure 12 months of data, filling missing months with zeros
                const monthlyStats = Array.from({ length: 12 }, (_, month) => {
                    const stat = data.find(
                        (s) => Number(s.month) === month + 1
                    ) || {
                        month: month + 1,
                        bookingRevenue: 0,
                        planRevenue: 0,
                        totalBookings: 0,
                        totalPlans: 0
                    }
                    return {
                        Month: Number(stat.month) || month + 1,
                        BookingRevenue: Number(stat.bookingRevenue) || 0,
                        PlanRevenue: Number(stat.planRevenue) || 0,
                        TotalBookings: Number(stat.totalBookings) || 0,
                        TotalPlans: Number(stat.totalPlans) || 0
                    }
                })
                setStats(monthlyStats)
            } catch (err) {
                console.error('Error fetching stats:', err)
                setError('Failed to fetch system statistics. Please try again.')
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [year])

    // Calculate total revenue for the year
    const totalRevenue = stats.reduce(
        (sum, stat) => sum + stat.BookingRevenue + stat.PlanRevenue,
        0
    )

    // Prepare chart data for revenue (BookingRevenue and PlanRevenue as separate lines)
    const chartData = {
        labels: stats.map((stat) => `Tháng ${stat.Month}`),
        datasets: [
            {
                label: 'Doanh Thu Đặt Tour (VND)',
                data: stats.map((stat) => stat.BookingRevenue || 0),
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6
            },
            {
                label: 'Doanh Thu Bán Gói (VND)',
                data: stats.map((stat) => stat.PlanRevenue || 0),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
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

    // Handle year change
    const handleYearChange = (e) => {
        setYear(parseInt(e.target.value))
    }

    // Generate year options (last 5 years)
    const yearOptions = Array.from(
        { length: 5 },
        (_, i) => new Date().getFullYear() - i
    )

    return (
        <div className="container mx-auto p-6">
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

            {/* Error Message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="text-center text-gray-600">
                    Đang tải thống kê...
                </div>
            )}

            {/* Summary Statistics */}
            {!loading && stats.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-500 text-white p-4 rounded-lg text-center">
                        <h2 className="text-xl font-semibold">
                            Số lượng Tour đã bán
                        </h2>
                        <p className="text-2xl">
                            {stats.reduce(
                                (sum, stat) => sum + stat.TotalBookings,
                                0
                            )}
                        </p>
                    </div>
                    <div className="bg-yellow-400 text-white p-4 rounded-lg text-center">
                        <h2 className="text-xl font-semibold">
                            Số lượng gói đã bán
                        </h2>
                        <p className="text-2xl">
                            {stats.reduce(
                                (sum, stat) => sum + stat.TotalPlans,
                                0
                            )}
                        </p>
                    </div>
                </div>
            )}

            {/* Total Revenue */}
            {!loading && stats.length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow-md mb-6 text-center">
                    <h2 className="text-xl font-semibold">Tổng Doanh Thu</h2>
                    <p className="text-2xl">{formatCurrency(totalRevenue)}</p>
                </div>
            )}

            {/*/!* Table *!/*/}
            {/*{!loading && stats.length > 0 && (*/}
            {/*    <div className="overflow-x-auto mb-8">*/}
            {/*        <table className="min-w-full bg-white border border-gray-200">*/}
            {/*            <thead>*/}
            {/*                <tr className="bg-gray-100">*/}
            {/*                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">*/}
            {/*                        Tháng*/}
            {/*                    </th>*/}
            {/*                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">*/}
            {/*                        Doanh Thu Đặt Tour (VND)*/}
            {/*                    </th>*/}
            {/*                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">*/}
            {/*                        Doanh Thu Bán Gói (VND)*/}
            {/*                    </th>*/}
            {/*                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">*/}
            {/*                        Số Lượng Tour Đã Đặt*/}
            {/*                    </th>*/}
            {/*                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">*/}
            {/*                        Số Lượng Gói Đã Bán*/}
            {/*                    </th>*/}
            {/*                </tr>*/}
            {/*            </thead>*/}
            {/*            <tbody>*/}
            {/*                {stats.map((stat) => (*/}
            {/*                    <tr key={stat.Month} className="border-t">*/}
            {/*                        <td className="px-4 py-2 text-sm text-gray-600">*/}
            {/*                            {stat.Month}*/}
            {/*                        </td>*/}
            {/*                        <td className="px-4 py-2 text-sm text-gray-600">*/}
            {/*                            {formatCurrency(*/}
            {/*                                stat.BookingRevenue || 0*/}
            {/*                            )}*/}
            {/*                        </td>*/}
            {/*                        <td className="px-4 py-2 text-sm text-gray-600">*/}
            {/*                            {formatCurrency(stat.PlanRevenue || 0)}*/}
            {/*                        </td>*/}
            {/*                        <td className="px-4 py-2 text-sm text-gray-600">*/}
            {/*                            {stat.TotalBookings || 0}*/}
            {/*                        </td>*/}
            {/*                        <td className="px-4 py-2 text-sm text-gray-600">*/}
            {/*                            {stat.TotalPlans || 0}*/}
            {/*                        </td>*/}
            {/*                    </tr>*/}
            {/*                ))}*/}
            {/*            </tbody>*/}
            {/*        </table>*/}
            {/*    </div>*/}
            {/*)}*/}

            {/* Chart */}
            {!loading && stats.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <Line data={chartData} options={chartOptions} />
                </div>
            )}

            {/* No Data Message */}
            {!loading && stats.length === 0 && !error && (
                <div className="text-center text-gray-600">
                    Không có thống kê cho năm được chọn.
                </div>
            )}
        </div>
    )
}

export default SystemStatsPage
