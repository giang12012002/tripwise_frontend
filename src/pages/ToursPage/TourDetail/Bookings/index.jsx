import React, { useEffect, useState } from 'react'
import BookingConfirmDialog from './BookingConfirmDialog'
import NumberInput from './NumberInput'
import EstimatedCost from './EstimatedCost'
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
        <div className="w-full mt-8 px-6 py-4 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold text-center text-gray-800 mb-2">
                Đặt tour
            </h1>

            <div className="flex flex-col gap-1">
                <NumberInput
                    label="Người lớn:"
                    value={adultNum}
                    onChange={setAdultNum}
                    min={0}
                />

                <NumberInput
                    label="Trẻ em dưới 9 tuổi:"
                    value={childUnder9Num}
                    onChange={setChildUnder9Num}
                    min={0}
                />

                <NumberInput
                    label="Trẻ em dưới 3 tuổi:"
                    value={childUnder3Num}
                    onChange={setChildUnder3Num}
                    min={0}
                />

                <NumberInput
                    label="Số ngày"
                    value={dayNum}
                    onChange={handleDayNumChange}
                    min={1}
                />

                {/* Estimated cost */}
                <EstimatedCost
                    adultNum={adultNum}
                    childUnder9Num={childUnder9Num}
                    childUnder3Num={childUnder3Num}
                    adultCost={adultCost}
                    childUnder9Cost={childUnder9Cost}
                    childUnder3Cost={childUnder3Cost}
                    estimatedCost={estimatedCost}
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
                peopleNum={adultNum + childUnder9Num + childUnder3Num}
                tourName={tour.tourName}
            />
        </div>
    )
}

export default Index
