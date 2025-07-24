import { useState, useEffect } from 'react'
import DateRangePicker from './DateRangePicker'
import RevenueReport from './RevenueReport'
import PartnerPerformanceReport from './PartnerPerformanceReport'
import TourBookingReport from './TourBookingReport'
import reportSystemAPI from '@/apis/reportSystemAPI'

const ReportDashboard = () => {
    const [activeTab, setActiveTab] = useState('revenue')
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [revenueData, setRevenueData] = useState({ details: [], totals: [] })
    const [partnerData, setPartnerData] = useState([])
    const [tourData, setTourData] = useState([])
    const [loading, setLoading] = useState(false)

    const handleDateChange = (from, to) => {
        console.log('Date Change:', { from, to })
        setFromDate(from)
        setToDate(to)
    }

    useEffect(() => {
        console.log('Active Tab:', activeTab)
        console.log('From Date:', fromDate, 'To Date:', toDate)
        console.log('Revenue Data:', revenueData)
        console.log('Partner Data:', partnerData)
        console.log('Tour Data:', tourData)
        if (fromDate && toDate) {
            setLoading(true)
            if (activeTab === 'revenue') {
                reportSystemAPI
                    .fetchRevenueSummary(fromDate, toDate)
                    .then((data) => {
                        console.log('Revenue API Response:', data)
                        setRevenueData(data || { details: [], totals: [] })
                    })
                    .catch((err) => {
                        console.error('Revenue API Error:', err)
                        setRevenueData({ details: [], totals: [] })
                    })
                    .finally(() => setLoading(false))
            } else if (activeTab === 'partner') {
                reportSystemAPI
                    .fetchPartnerPerformance(fromDate, toDate)
                    .then((data) => {
                        console.log('Partner API Response:', data)
                        setPartnerData(data || [])
                    })
                    .catch((err) => {
                        console.error('Partner API Error:', err)
                        setPartnerData([])
                    })
                    .finally(() => setLoading(false))
            } else if (activeTab === 'tour') {
                reportSystemAPI
                    .fetchTourBookingStats(fromDate, toDate)
                    .then((data) => {
                        console.log('Tour API Response:', data)
                        setTourData(data || [])
                    })
                    .catch((err) => {
                        console.error('Tour API Error:', err)
                        setTourData([])
                    })
                    .finally(() => setLoading(false))
            }
        } else {
            console.warn('Missing From Date or To Date')
        }
    }, [activeTab, fromDate, toDate])

    const handleExport = async (type) => {
        setLoading(true)
        try {
            let blob
            if (type === 'revenue') {
                blob = await reportSystemAPI.exportRevenueSummary(
                    fromDate,
                    toDate
                )
            } else if (type === 'partner') {
                blob = await reportSystemAPI.exportPartnerPerformance(
                    fromDate,
                    toDate
                )
            } else if (type === 'tour') {
                blob = await reportSystemAPI.exportTourBookingStats(
                    fromDate,
                    toDate
                )
            }
            const url = window.URL.createObjectURL(new Blob([blob]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute(
                'download',
                `${type}_report_${fromDate}_${toDate}.xlsx`
            )
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error('Error exporting report:', error)
        }
        setLoading(false)
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Bảng điều khiển báo cáo</h1>
            <DateRangePicker onDateChange={handleDateChange} />
            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => setActiveTab('revenue')}
                    className={`px-4 py-2 rounded-md ${activeTab === 'revenue' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                    Doanh thu
                </button>
                <button
                    onClick={() => setActiveTab('partner')}
                    className={`px-4 py-2 rounded-md ${activeTab === 'partner' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                    Hiệu suất đối tác
                </button>
                <button
                    onClick={() => setActiveTab('tour')}
                    className={`px-4 py-2 rounded-md ${activeTab === 'tour' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                    Thống kê đặt tour
                </button>
            </div>
            {loading && <p className="text-blue-600">Đang tải...</p>}
            {activeTab === 'revenue' && (
                <RevenueReport
                    data={revenueData}
                    onExport={() => handleExport('revenue')}
                    loading={loading}
                />
            )}
            {activeTab === 'partner' && (
                <PartnerPerformanceReport
                    data={partnerData}
                    onExport={() => handleExport('partner')}
                    loading={loading}
                />
            )}
            {activeTab === 'tour' && (
                <TourBookingReport
                    data={tourData}
                    onExport={() => handleExport('tour')}
                    loading={loading}
                />
            )}
        </div>
    )
}

export default ReportDashboard
