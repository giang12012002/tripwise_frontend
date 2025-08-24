// BookingTable.jsx
import React from 'react'
import { status } from './bookingStatus'

function BookingTable({
    bookings,
    onViewDetails,
    onConfirmRefund,
    onRejectRefund,
    onCompleteRefund
}) {
    const getStatusConfig = (value) => {
        return (
            status.find((s) => s.value === value) || {
                background: 'bg-gray-100',
                text: 'text-gray-800',
                vietnamese: value
            }
        )
    }
    return (
        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4">Chi tiết Booking</h2>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3">STT</th>
                        <th className="px-6 py-3">Tên Tour</th>
                        <th className="px-6 py-3">Người đặt</th>
                        <th className="px-6 py-3">Tổng tiền</th>
                        <th className="px-6 py-3">Trạng thái</th>
                        <th className="px-6 py-3">Ngày tạo</th>
                        <th className="px-6 py-3">Hành động</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking, index) => {
                        const stt = getStatusConfig(booking.bookingStatus)
                        return (
                            <tr key={index}>
                                <td className="px-6 py-4">{index + 1}</td>
                                <td className="px-6 py-4">
                                    {booking.tourName}
                                </td>
                                <td className="px-6 py-4">
                                    {booking.userName}
                                </td>
                                <td className="px-6 py-4">
                                    {booking.totalAmount.toLocaleString(
                                        'vi-VN'
                                    )}{' '}
                                    đ
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${stt.background} ${stt.text}`}
                                    >
                                        {stt.vietnamese}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {new Date(
                                        booking.createdDate
                                    ).toLocaleDateString('vi-VN')}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex space-x-4">
                                        <div className="group relative">
                                            <button
                                                onClick={() =>
                                                    onViewDetails(
                                                        booking.bookingId,
                                                        booking.tourId
                                                    )
                                                }
                                                title="Xem chi tiết"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="currentColor"
                                                    class="size-6"
                                                    className="h-6 w-6 text-blue-600 hover:text-blue-800"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                                    />
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                    />
                                                </svg>
                                            </button>
                                            {/* <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 p-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition">
                                            Xem chi tiết
                                        </span> */}
                                        </div>

                                        {booking.bookingStatus ===
                                            'CancelPending' && (
                                            <>
                                                <div className="group relative">
                                                    <button
                                                        onClick={() =>
                                                            onConfirmRefund(
                                                                booking.bookingId
                                                            )
                                                        }
                                                        title="Xác nhận hoàn tiền"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke-width="1.5"
                                                            stroke="currentColor"
                                                            class="size-6"
                                                            className="h-6 w-6 text-green-600 hover:text-green-800"
                                                        >
                                                            <path
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                            />
                                                        </svg>
                                                    </button>
                                                    {/* <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 p-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition">
                                            Xác nhận hoàn
                                        </span> */}
                                                </div>

                                                <div className="group relative">
                                                    <button
                                                        onClick={() =>
                                                            onRejectRefund(
                                                                booking.bookingId
                                                            )
                                                        }
                                                        title="Từ chối hoàn tiền"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke-width="1.5"
                                                            stroke="currentColor"
                                                            class="size-6"
                                                            className="h-6 w-6 text-red-600 hover:text-red-800"
                                                        >
                                                            <path
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                            />
                                                        </svg>
                                                    </button>
                                                    {/* <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 p-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition">
                                            Từ chối hoàn
                                        </span> */}
                                                </div>

                                                <div className="group relative">
                                                    <button
                                                        onClick={() =>
                                                            onCompleteRefund(
                                                                booking.bookingId
                                                            )
                                                        }
                                                        title="Hoàn tất hoàn tiền"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke-width="1.5"
                                                            stroke="currentColor"
                                                            class="size-6"
                                                            className="h-6 w-6 text-purple-600 hover:text-purple-800"
                                                        >
                                                            <path
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                                                            />
                                                        </svg>
                                                    </button>
                                                    {/* <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 p-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition">
                                            Hoàn tất hoàn
                                        </span> */}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default BookingTable
