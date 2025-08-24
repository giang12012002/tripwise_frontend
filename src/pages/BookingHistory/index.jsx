import React, { useEffect, useState } from 'react'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import { paymentAPI, tourUserAPI } from '@/apis'
import Swal from 'sweetalert2'
import BookingDetailDialog from './BookingDetailDialog'
import ConfirmDialog from './ConfirmDialog'

import { bookingStatus } from './status'

const getStatusConfig = (value) => {
    return (
        bookingStatus.find((s) => s.value === value) || {
            background: 'bg-gray-100',
            text: 'text-gray-800',
            vietnamese: value
        }
    )
}

function normalizeVietnamese(str) {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd') // đ → d
        .replace(/[^a-z0-9\s]/g, '')
        .trim()
}

function Index() {
    const [payments, setPayments] = useState([])
    const [filteredPayments, setFilteredPayments] = useState([])
    const [search, setSearch] = useState('')
    const [sortType, setSortType] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const [bookings, setBookings] = useState([])
    const [filteredBookings, setFilteredBookings] = useState([])
    const [showBookingDetailDialog, setShowBookingDetailDialog] =
        useState(false)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [selectedPayment, setSelectedPayment] = useState(null)
    const [selectedBooking, setSelectedBooking] = useState(null)

    const handleOpenBookingDetailDialog = async ({ bookingId, tourId }) => {
        try {
            const payment = await tourUserAPI.getBookedTourDetail(bookingId)
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

    const fetchBookingHistory = async () => {
        try {
            const response = await tourUserAPI.getBookedTours()
            if (response.status === 200) {
                setBookings(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchBookingHistory()
    }, [])

    useEffect(() => {
        let filtered = [...bookings]

        if (search.trim()) {
            const searchNormalized = normalizeVietnamese(search)
            filtered = filtered.filter((p) =>
                normalizeVietnamese(p.tourName).includes(searchNormalized)
            )
        }

        if (sortType !== 'all') {
            filtered = filtered.filter((p) => p.orderCode.includes(sortType))
        }

        setFilteredBookings(filtered)
        setCurrentPage(1)
    }, [search, sortType, bookings])

    const pageCount = Math.ceil(filteredBookings.length / itemsPerPage)
    const paginatedBookings = filteredBookings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const handleOpenConfirmDialog = async (booking) => {
        try {
            const response = await paymentAPI.getRefundPreview(
                booking.bookingId
            )
            let message
            if (response.status === 200) {
                message = response.data.message
            } else {
                message = 'Chưa có'
            }
            setSelectedBooking({ ...booking, refundMessage: message })
            setShowConfirmDialog(true)
        } catch (error) {
            console.log(error)
        }
    }

    const handleRefund = async ({ bookingId, refundMethod, cancelReason }) => {
        try {
            const response = await paymentAPI.sendRefundRequest({
                bookingId,
                refundMethod,
                cancelReason
            })

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text:
                        response.data?.message ||
                        'Yêu cầu hoàn tiền đã được gửi!'
                })
            }

            fetchBookingHistory()
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text:
                    error.response.data.message ||
                    'Không thể gửi yêu cầu hoàn tiền'
            })
        } finally {
            setShowConfirmDialog(false)
            setSelectedBooking(null)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
            <Header />
            <main className="flex-grow max-w px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white shadow-2xl rounded-2xl p-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
                        Lịch sử đặt chỗ
                    </h1>

                    <>
                        {/* Controls */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                            <div className="relative w-full sm:w-80">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên tour..."
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
                                className="hidden w-full sm:w-48 py-3 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-700"
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
                                        <th className="p-3 border">STT</th>
                                        <th className="p-3 border">Tên tour</th>
                                        <th className="p-3 border">Số tiền</th>
                                        <th className="p-3 border">
                                            Trạng thái
                                        </th>
                                        <th className="p-3 border">
                                            Ngày thanh toán
                                        </th>
                                        <th className="p-3 border">
                                            Hành động
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedBookings.length > 0 ? (
                                        paginatedBookings.map((item, index) => {
                                            const stt = getStatusConfig(
                                                item.bookingStatus
                                            )
                                            return (
                                                <tr
                                                    key={item.bookingId}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="p-3 border">
                                                        {index + 1}
                                                    </td>
                                                    <td className="p-3 border">
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
                                                    </td>
                                                    <td className="p-3 border">
                                                        {item.totalAmount.toLocaleString()}
                                                        đ
                                                    </td>
                                                    <td className="p-3 border">
                                                        <span
                                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${stt.background} ${stt.text}`}
                                                        >
                                                            {stt.vietnamese}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 border">
                                                        {new Date(
                                                            item.createdDate
                                                        ).toLocaleString(
                                                            'vi-VN'
                                                        )}
                                                    </td>
                                                    <td className="p-3 border">
                                                        {item.bookingStatus ===
                                                            'Success' && (
                                                            <div className="group relative">
                                                                <button
                                                                    onClick={() =>
                                                                        // handleRefund(
                                                                        //     item
                                                                        // )
                                                                        handleOpenConfirmDialog(
                                                                            item
                                                                        )
                                                                    }
                                                                    className="p-2 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 hover:text-yellow-800 transition-all duration-200 shadow-sm"
                                                                >
                                                                    {/* <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke-width="1.5"
                                                                    stroke="currentColor"
                                                                    class="size-6"
                                                                    className="h-5 w-5"
                                                                >
                                                                    <path
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                        d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                                                                    />
                                                                </svg> */}
                                                                    Hủy
                                                                </button>
                                                                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 p-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition">
                                                                    Yêu cầu hoàn
                                                                    tiền
                                                                </span>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="p-3 text-center text-gray-500"
                                            >
                                                Đây là lịch sử đặt chỗ của bạn.
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
                                onClick={() =>
                                    setCurrentPage((prev) => prev - 1)
                                }
                                disabled={currentPage === 1}
                            >
                                Trước
                            </button>
                            <span className="text-gray-700 font-medium">
                                Trang {currentPage} / {pageCount}
                            </span>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
                                onClick={() =>
                                    setCurrentPage((prev) => prev + 1)
                                }
                                disabled={currentPage === pageCount}
                            >
                                Sau
                            </button>
                        </div>
                    </>
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
            <ConfirmDialog
                isOpen={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                onConfirm={handleRefund}
                booking={selectedBooking}
            />
        </div>
    )
}

export default Index
