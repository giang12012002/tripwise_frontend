// BookingSummary.jsx
import React, { useEffect, useState, useRef } from 'react'
import { createRoot } from 'react-dom/client'

function BookingSummary({ bookings }) {
    const totalBookings = bookings.length
    const totalAmount = bookings.reduce(
        (sum, booking) => sum + booking.totalAmount,
        0
    )
    const successBookings = bookings.filter(
        (b) => b.bookingStatus === 'Success'
    ).length

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-xl font-bold text-gray-800">
                    Tổng số Booking
                </h3>
                <p className="text-3xl mt-2 font-semibold text-blue-600">
                    {totalBookings}
                </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-xl font-bold text-gray-800">
                    Tổng Doanh Thu
                </h3>
                <p className="text-3xl mt-2 font-semibold text-green-600">
                    {totalAmount.toLocaleString('vi-VN')} đ
                </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-xl font-bold text-gray-800">
                    Booking Thành Công
                </h3>
                <p className="text-3xl mt-2 font-semibold text-purple-600">
                    {successBookings}
                </p>
            </div>
        </div>
    )
}

export default BookingSummary
