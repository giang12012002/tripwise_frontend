import React, { useState, useEffect } from 'react'
import partnerTourAPI from '@/apis/partnerTourAPI.js'
import { Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { vi } from 'date-fns/locale'
import { FaMap, FaShoppingCart, FaDollarSign } from 'react-icons/fa'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const PartnerStatsPage = () => {
    const [stats, setStats] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [fromDate, setFromDate] = useState(new Date(2025, 0, 1)) // January 1, 2025
    const [toDate, setToDate] = useState(new Date(2025, 11, 31)) // December 31, 2025

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)

    // Format monthYear from "YYYY-MM" or other formats to "MM/YYYY"
    const formatMonthYear = (monthYear) => {
        if (!monthYear) return 'Không xác định'
        // Handle common formats like "YYYY-MM" or "MM/YYYY"
        const parts = monthYear.includes('-')
            ? monthYear.split('-')
            : monthYear.split('/')
        if (parts.length === 2) {
            const [year, month] =
                parts[0].length === 4
                    ? [parts[0], parts[1]]
                    : [parts[1], parts[0]]
            return `${month.padStart(2, '0')}/${year}`
        }
        return monthYear // Fallback to original if format is unexpected
    }

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true)
            setError(null)
            try {
                const from = fromDate
                    ? fromDate.toISOString().split('T')[0]
                    : null
                const to = toDate ? toDate.toISOString().split('T')[0] : null
                const response = await partnerTourAPI.getStatistics(from, to)
                const data = Array.isArray(response.data)
                    ? response.data
                    : [response.data]
                console.log('API Response Data:', data) // Debug: Log raw stats data
                setStats(data)
            } catch (err) {
                console.error('Lỗi khi lấy thống kê:', err)
                setError('Không thể tải thống kê. Vui lòng thử lại.')
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [fromDate, toDate])

    const handleFilterSubmit = (e) => {
        e.preventDefault()
    }

    // Generate labels for all 12 months of 2025
    const generateMonthLabels = () => {
        const months = []
        for (let i = 1; i <= 12; i++) {
            months.push(`${i.toString().padStart(2, '0')}/2025`)
        }
        return months
    }

    // Map stats to chart data, handling scaling and monthYear format
    const chartData = {
        labels: generateMonthLabels(),
        datasets: [
            {
                label: 'Tổng Doanh Thu (VND)',
                data: generateMonthLabels().map((month) => {
                    const stat = stats.find(
                        (s) => formatMonthYear(s.monthYear) === month
                    )
                    const revenue = stat ? stat.totalRevenue || 0 : 0 // Convert billions to VND
                    console.log(
                        `Month: ${month}, Raw Revenue: ${stat ? stat.totalRevenue : 'N/A'}, Scaled Revenue: ${revenue}`
                    ) // Debug
                    return revenue
                }),
                backgroundColor: '#f59e0b',
                borderColor: '#f59e0b',
                borderWidth: 1
            }
        ]
    }

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: {
                display: true,
                text: 'Thống Kê Doanh Thu Đối Tác Theo Tháng'
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.raw
                        return `Tổng Doanh Thu: ${formatCurrency(value)}`
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
                },
                ticks: {
                    callback: (value) => formatCurrency(value) // Format y-axis ticks as currency
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

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
                Thống Kê Đối Tác
            </h1>

            {/* Date Filter Form */}
            <div className="mb-6 bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                    Bộ Lọc Thời Gian
                </h2>
                <form className="flex flex-col sm:flex-row gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Từ ngày
                        </label>
                        <DatePicker
                            selected={fromDate}
                            onChange={(date) => setFromDate(date)}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Chọn ngày bắt đầu"
                            className="block w-full max-w-xs p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            locale={vi}
                            maxDate={toDate || new Date()}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Đến ngày
                        </label>
                        <DatePicker
                            selected={toDate}
                            onChange={(date) => setToDate(date)}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Chọn ngày kết thúc"
                            className="block w-full max-w-xs p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            locale={vi}
                            minDate={fromDate}
                            maxDate={new Date()}
                        />
                    </div>
                    {/*<button*/}
                    {/*    type="submit"*/}
                    {/*    onClick={handleFilterSubmit}*/}
                    {/*    className="mt-8 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"*/}
                    {/*>*/}
                    {/*    Lọc*/}
                    {/*</button>*/}
                </form>
            </div>

            {/* Company Info */}
            {stats.length > 0 && (
                <div className="mb-6 bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-center text-blue-500">
                        {stats[0].companyName || 'Không xác định'}
                    </h2>
                </div>
            )}

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

            {/* Chart */}
            {!loading && stats.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <Bar data={chartData} options={chartOptions} />
                </div>
            )}

            {/* Monthly Statistics */}
            {!loading && stats.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">
                        Thống Kê Theo Tháng
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 p-6 rounded-lg text-center hover:scale-105 transition duration-200"
                            >
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Tháng:{' '}
                                    {formatMonthYear(stat.monthYear) ||
                                        'Không xác định'}
                                </h3>
                                <div className="mt-4">
                                    <p className="text-blue-500">
                                        Tổng Số Tour: {stat.totalTours || 0}
                                    </p>

                                    <p className="text-green-500">
                                        Số lượng hủy tour:{' '}
                                        {stat.totalCancelled || 0}
                                    </p>
                                    <p className="text-green-500">
                                        Doanh thu hủy tour :{' '}
                                        {stat.cancelledRevenue || 0}
                                    </p>
                                    <p className="text-yellow-500">
                                        Booking Thành Công:{' '}
                                        {stat.totalBookedTours || 0}
                                    </p>
                                    <p className="text-yellow-500">
                                        Tổng Doanh Thu:{' '}
                                        {formatCurrency(stat.totalRevenue || 0)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* No Data Message */}
            {!loading && stats.length === 0 && !error && (
                <div className="text-center text-gray-600">
                    Không có dữ liệu thống kê
                </div>
            )}
        </div>
    )
}

export default PartnerStatsPage
1
