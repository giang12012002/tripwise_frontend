import React, { useEffect, useState } from 'react'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import { paymentAPI } from '@/apis'

import BookingDetailDialog from './BookingDetailDialog'

function Index() {
    const [payments, setPayments] = useState([])
    const [filteredPayments, setFilteredPayments] = useState([])
    const [search, setSearch] = useState('')
    const [sortType, setSortType] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    const [showBookingDetailDialog, setShowBookingDetailDialog] =
        useState(false)
    const [selectedPayment, setSelectedPayment] = useState(null)

    const handleOpenBookingDetailDialog = async ({ bookingId, tourId }) => {
        try {
            const payment = await paymentAPI.fetchBookingDetail({ bookingId })
            if (payment.status === 200) {
                setSelectedPayment({
                    ...payment.data,
                    tourId
                })
                setShowBookingDetailDialog(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchPaymentHistory = async () => {
        try {
            const response = await paymentAPI.fetchPaymentHistory({
                status: 'success'
            })
            if (response.status === 200) {
                setPayments(response.data)
                setFilteredPayments(response.data)
            }

            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchPaymentHistory()
        console.log('Payments:', payments)
    }, [])

    useEffect(() => {
        let filtered = [...payments]

        if (search.trim()) {
            filtered = filtered.filter((p) =>
                p.orderCode.toLowerCase().includes(search.toLowerCase())
            )
        }

        if (sortType !== 'all') {
            filtered = filtered.filter((p) => p.orderCode.includes(sortType))
        }

        setFilteredPayments(filtered)
        setCurrentPage(1)
    }, [search, sortType, payments])

    const pageCount = Math.ceil(filteredPayments.length / itemsPerPage)
    const paginatedPayments = filteredPayments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
            <Header />
            <main className="flex-grow max-w  px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white shadow-2xl rounded-2xl p-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
                        Lịch sử thanh toán
                    </h1>

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <div className="relative w-full sm:w-80">
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo Order Code..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
                            />
                            <svg
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                        <select
                            value={sortType}
                            onChange={(e) => setSortType(e.target.value)}
                            className="w-full sm:w-48 py-3 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-700"
                        >
                            <option value="all">Tất cả</option>
                            <option value="plan">Theo Plan</option>
                            <option value="booking">Theo Booking</option>
                        </select>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border border-gray-200 text-sm">
                            <thead className="bg-gray-100 text-left">
                                <tr>
                                    <th className="p-3 border">Mã giao dịch</th>
                                    <th className="p-3 border">Tên</th>
                                    <th className="p-3 border">Số tiền</th>
                                    <th className="p-3 border">Trạng thái</th>
                                    <th className="p-3 border">Ngân hàng</th>
                                    <th className="p-3 border">
                                        Ngày thanh toán
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedPayments.length > 0 ? (
                                    paginatedPayments.map((item) => (
                                        <tr
                                            key={item.transactionId}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="p-3 border">
                                                {item.transactionId}
                                            </td>
                                            <td className="p-3 border">
                                                {item.planName === null ? (
                                                    <button
                                                        onClick={() =>
                                                            handleOpenBookingDetailDialog(
                                                                {
                                                                    bookingId:
                                                                        item?.bookingId,
                                                                    tourId: item?.tourId
                                                                }
                                                            )
                                                        }
                                                        className="text-blue-600 hover:underline cursor-pointer text-left"
                                                    >
                                                        {item.tourName}
                                                    </button>
                                                ) : (
                                                    item.planName
                                                )}
                                            </td>
                                            <td className="p-3 border">
                                                {item.amount.toLocaleString()}đ
                                            </td>
                                            <td className="p-3 border text-green-600">
                                                {item.paymentStatus}
                                            </td>
                                            <td className="p-3 border">
                                                {item.bankCode}
                                            </td>
                                            <td className="p-3 border">
                                                {new Date(
                                                    item.paymentTime
                                                ).toLocaleString('vi-VN')}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="p-3 text-center text-gray-500"
                                        >
                                            Không có kết quả
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-8 flex justify-center items-center gap-4">
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                            disabled={currentPage === 1}
                        >
                            Trước
                        </button>
                        <span className="text-gray-700 font-medium">
                            Trang {currentPage} / {pageCount}
                        </span>
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            disabled={currentPage === pageCount}
                        >
                            Sau
                        </button>
                    </div>
                </div>
            </main>
            <Footer />

            <BookingDetailDialog
                isOpen={showBookingDetailDialog}
                onClose={() => {
                    setShowBookingDetailDialog(false)
                    setSelectedPayment(null)
                }}
                payment={selectedPayment}
            />
        </div>
    )
}

export default Index
