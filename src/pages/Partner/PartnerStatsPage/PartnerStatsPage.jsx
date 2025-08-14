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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const PartnerStatsPage = () => {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Format currency in VND
    const formatCurrency = (amount) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)

    // Fetch stats when component mounts
    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true)
            setError(null)
            try {
                const response = await partnerTourAPI.getStatistics()
                console.log('API Response:', response) // In toàn bộ response
                console.log('API Data:', response.data) // In dữ liệu cụ thể
                setStats(response.data)
            } catch (err) {
                console.error('Lỗi khi lấy thống kê:', err)
                setError('Không thể tải thống kê. Vui lòng thử lại.')
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    // Prepare chart data
    const chartData = stats
        ? {
              labels: ['Tổng Quan'],
              datasets: [
                  {
                      label: 'Tổng Số Tour',
                      data: [stats.totalTours || 0], // Sửa TotalTours thành totalTours
                      backgroundColor: '#2563eb',
                      borderColor: '#1e3a8a',
                      borderWidth: 1
                  },
                  {
                      label: 'Số Tour Đã Đặt',
                      data: [stats.totalBookedTours || 0], // Sửa TotalBookedTours thành totalBookedTours
                      backgroundColor: '#10b981',
                      borderColor: '#065f46',
                      borderWidth: 1
                  },
                  {
                      label: 'Tổng Doanh Thu (VND)',
                      data: [stats.totalRevenue || 0], // Sửa TotalRevenue thành totalRevenue
                      backgroundColor: '#f59e0b',
                      borderColor: '#b45309',
                      borderWidth: 1
                  }
              ]
          }
        : { labels: [], datasets: [] }

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: {
                display: true,
                text: 'Thống Kê Hoạt Động Đối Tác'
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.raw
                        const label = context.dataset.label
                        if (label === 'Tổng Doanh Thu (VND)') {
                            return `${label}: ${formatCurrency(value)}`
                        }
                        return `${label}: ${value}`
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Giá Trị'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Danh Mục'
                }
            }
        }
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
                Thống Kê Đối Tác
            </h1>

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

            {!loading && stats && (
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-500 text-white p-4 rounded-lg text-center">
                        <h2 className="text-xl font-semibold">Tổng Số Tour</h2>
                        <p className="text-2xl">{stats.totalTours || 0}</p>
                    </div>
                    <div className="bg-green-500 text-white p-4 rounded-lg text-center">
                        <h2 className="text-xl font-semibold">
                            Số Tour Đã Đặt
                        </h2>
                        <p className="text-2xl">
                            {stats.totalBookedTours || 0}
                        </p>
                    </div>
                    <div className="bg-yellow-500 text-white p-4 rounded-lg text-center">
                        <h2 className="text-xl font-semibold">
                            Tổng Doanh Thu
                        </h2>
                        <p className="text-2xl">
                            {formatCurrency(stats.totalRevenue || 0)}
                        </p>
                    </div>
                </div>
            )}

            {/* Chart */}
            {!loading && stats && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <Bar data={chartData} options={chartOptions} />
                </div>
            )}

            {/* No Data Message */}
            {!loading && !stats && !error && (
                <div className="text-center text-gray-600">
                    Không có dữ liệu thống kê.
                </div>
            )}
        </div>
    )
}

export default PartnerStatsPage
