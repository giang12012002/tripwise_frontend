import React, { useEffect, useState } from 'react'
import BookingConfirmDialog from './BookingConfirmDialog'
import { paymentAPI } from '@/apis'
import { toast } from 'react-toastify'

function Index({ tour }) {
    // const [peopleNum, setPeopleNum] = useState(1)
    const [adultNum, setAdultNum] = useState(1)
    const [childUnder9Num, setChildUnder9Num] = useState(0)
    const [childUnder3Num, setChildUnder3Num] = useState(0)
    const [dayNum, setDayNum] = useState(1)

    const [estimatedCost, setEstimatedCost] = useState(0)
    const [adultCost, setAdultCost] = useState(0)
    const [childUnder9Cost, setChildUnder9Cost] = useState(0)
    const [childUnder3Cost, setChildUnder3Cost] = useState(0)

    useEffect(() => {
        if (tour?.pricePerDay > 0) {
            const price = tour.pricePerDay

            const adultTotal = adultNum * price * dayNum
            const childUnder9Total = childUnder9Num * price * dayNum
            const childUnder3Total = 0 // miễn phí

            setAdultCost(adultTotal)
            setChildUnder9Cost(childUnder9Total)
            setChildUnder3Cost(0)

            setEstimatedCost(adultTotal + childUnder9Total)
        }
    }, [adultNum, childUnder9Num, childUnder3Num, dayNum, tour])

    const [showBookingConfirmDialog, setShowBookingConfirmDialog] =
        useState(false)

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
                localStorage.setItem('vnpay-redirect', '/tour-detail/' + tourId)
                window.location.href = response.data.url
            }
        } catch (err) {
            toast.error(err.message || 'Lỗi khi đặt chỗ.')
        }
    }

    return (
        <div className="w-full mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                Đặt tour
            </h1>

            <div className="flex flex-col gap-4">
                <label className="text-gray-700 font-medium">Người lớn:</label>
                <input
                    type="number"
                    value={adultNum}
                    onChange={(e) =>
                        setAdultNum(Math.max(0, parseInt(e.target.value) || 0))
                    }
                    min="0"
                    className="border border-gray-300 rounded px-4 py-2"
                />

                <label className="text-gray-700 font-medium">
                    Trẻ em dưới 9 tuổi:
                </label>
                <input
                    type="number"
                    value={childUnder9Num}
                    onChange={(e) =>
                        setChildUnder9Num(
                            Math.max(0, parseInt(e.target.value) || 0)
                        )
                    }
                    min="0"
                    className="border border-gray-300 rounded px-4 py-2"
                />

                <label className="text-gray-700 font-medium">
                    Trẻ em dưới 3 tuổi:
                </label>
                <input
                    type="number"
                    value={childUnder3Num}
                    onChange={(e) =>
                        setChildUnder3Num(
                            Math.max(0, parseInt(e.target.value) || 0)
                        )
                    }
                    min="0"
                    className="border border-gray-300 rounded px-4 py-2"
                />

                <label className="text-gray-700 font-medium">Số ngày:</label>
                <input
                    type="number"
                    value={dayNum}
                    onChange={handleDayNumChange}
                    min="1"
                    className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                {/* Estimated cost */}
                <p className="text-gray-700 font-medium mt-2">Chi tiết giá:</p>
                <ul className="text-gray-700 ml-4 list-disc">
                    <li>
                        Người lớn ({adultNum} người):{' '}
                        <span className="text-blue-600 font-semibold">
                            {adultCost.toLocaleString()} đ
                        </span>
                    </li>
                    <li>
                        Trẻ em dưới 9 tuổi ({childUnder9Num} người):{' '}
                        <span className="text-blue-600 font-semibold">
                            {childUnder9Cost.toLocaleString()} đ
                        </span>
                    </li>
                    <li>
                        Trẻ em dưới 3 tuổi ({childUnder3Num} người):{' '}
                        <span className="text-blue-600 font-semibold">
                            {childUnder3Cost.toLocaleString()} đ
                        </span>
                    </li>
                </ul>

                <p className="text-gray-700 font-medium mt-2">
                    Tổng cộng:{' '}
                    <span className="text-red-600 text-lg font-bold underline">
                        {estimatedCost.toLocaleString()} đ
                    </span>
                </p>

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
                peopleNum={adultNum + childUnder9Num + childUnder3Num}
                tourName={tour.tourName}
            />
        </div>
    )
}

export default Index
