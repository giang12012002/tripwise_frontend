import React, { useState } from 'react'
import BookingConfirmDialog from './BookingConfirmDialog'
import { tours } from './data'
import { paymentAPI } from '@/apis'
import { toast } from 'react-toastify'

function Index() {
    const [peopleNum, setPeopleNum] = useState(1)
    const [dayNum, setDayNum] = useState(1)

    const [showBookingConfirmDialog, setShowBookingConfirmDialog] =
        useState(false)

    const tour = tours[0] // giả sử đang chọn tour đầu tiên

    const handlePeopleNumChange = (e) => {
        const value = parseInt(e.target.value)
        if (!isNaN(value) && value > 0) setPeopleNum(value)
    }

    const handleDayNumChange = (e) => {
        const value = parseInt(e.target.value)
        if (!isNaN(value) && value > 0) setDayNum(value)
    }

    const handleConfirm = async (tourId, peopleNum, dayNum) => {
        setShowBookingConfirmDialog(false)
        try {
            const response = await paymentAPI.sendBookingRequest({
                tourId: tourId,
                numberOfPeople: peopleNum,
                numberOfDays: dayNum,
                paymentMethod: 'vnpay'
            })
            if (response.status === 200) {
                localStorage.setItem('vnpay-redirect', '/bookings')
                window.location.href = response.data.url
            }
        } catch (err) {
            toast.error(err.message || 'Lỗi khi đặt chỗ.')
        }
    }

    return (
        <div className="w-full mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                Đặt tour: {tour.tourName}
            </h1>

            <div className="flex flex-col gap-4">
                <label className="text-gray-700 font-medium">Số người:</label>
                <input
                    type="number"
                    value={peopleNum}
                    onChange={handlePeopleNumChange}
                    min="1"
                    className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <label className="text-gray-700 font-medium">Số ngày:</label>
                <input
                    type="number"
                    value={dayNum}
                    onChange={handleDayNumChange}
                    min="1"
                    className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <button
                    onClick={() => setShowBookingConfirmDialog(true)}
                    className="mt-4 bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition duration-200"
                >
                    Xác nhận đặt chỗ
                </button>
            </div>

            <BookingConfirmDialog
                isOpen={showBookingConfirmDialog}
                onClose={() => setShowBookingConfirmDialog(false)}
                onConfirm={handleConfirm}
                tourId={tour.tourId}
                dayNum={dayNum}
                peopleNum={peopleNum}
                tourName={tour.tourName}
            />
        </div>
    )
}

export default Index
