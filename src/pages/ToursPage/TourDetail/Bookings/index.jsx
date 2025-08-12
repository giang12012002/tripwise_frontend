import React, { useEffect, useState } from 'react'
import BookingConfirmDialog from './BookingConfirmDialog'
import NumberInput from './NumberInput'
import EstimatedCost from './EstimatedCost'
import { paymentAPI } from '@/apis'
import { toast } from 'react-toastify'

function Index({ tour }) {
    const [adultNum, setAdultNum] = useState(1)
    const [childUnder10Num, setChildUnder10Num] = useState(0)
    const [childUnder5Num, setChildUnder5Num] = useState(0)

    const [estimatedCost, setEstimatedCost] = useState(0)
    const [adultCost, setAdultCost] = useState(0)
    const [childUnder10Cost, setChildUnder10Cost] = useState(0)
    const [childUnder5Cost, setChildUnder5Cost] = useState(0)

    useEffect(() => {
        if (
            tour?.priceAdult &&
            tour?.priceChildUnder5 &&
            tour?.priceChild5To10 &&
            tour?.days
        ) {
            const dayNum = parseInt(tour.days)
            const price1Adult = tour.priceAdult
            const price1ChildUnder10 = tour.priceChild5To10
            const price1ChildUnder5 = tour.priceChildUnder5

            const adultTotal = adultNum * price1Adult * dayNum
            const childUnder9Total =
                childUnder10Num * price1ChildUnder10 * dayNum
            const childUnder3Total = childUnder5Num * price1ChildUnder5 * dayNum

            setAdultCost(adultTotal)
            setChildUnder10Cost(childUnder9Total)
            setChildUnder5Cost(childUnder3Total)

            setEstimatedCost(adultTotal + childUnder9Total + childUnder3Total)
        }
    }, [adultNum, childUnder10Num, childUnder5Num, tour])

    const [showBookingConfirmDialog, setShowBookingConfirmDialog] =
        useState(false)

    const handleConfirm = async (
        tourId,
        adultNum,
        childUnder10Num,
        childUnder5Num
    ) => {
        setShowBookingConfirmDialog(false)
        try {
            const response = await paymentAPI.sendBookingRequest({
                tourId: tourId,
                numAdults: adultNum,
                numChildren5To10: childUnder10Num,
                numChildrenUnder5: childUnder5Num,
                paymentMethod: 'vnpay'
            })
            if (response.status === 200) {
                localStorage.setItem('vnpay-redirect', '/tour-detail/' + tourId)
                window.location.href = response.data.url
            }
            if (response.status === 400) {
                toast.error(response.data)
            }
        } catch (err) {
            toast.error(err.response.data || 'Lỗi khi đặt chỗ.')
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
                    label="Trẻ em dưới 10 tuổi:"
                    value={childUnder10Num}
                    onChange={setChildUnder10Num}
                    min={0}
                />

                <NumberInput
                    label="Trẻ em dưới 5 tuổi:"
                    value={childUnder5Num}
                    onChange={setChildUnder5Num}
                    min={0}
                />

                {/* Estimated cost */}
                <EstimatedCost
                    adultNum={adultNum}
                    childUnder10Num={childUnder10Num}
                    childUnder5Num={childUnder5Num}
                    adultCost={adultCost}
                    childUnder10Cost={childUnder10Cost}
                    childUnder5Cost={childUnder5Cost}
                    price1Adult={tour.priceAdult}
                    price1ChildUnder10={tour.priceChild5To10}
                    price1ChildUnder5={tour.priceChildUnder5}
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
                peopleNum={adultNum + childUnder10Num + childUnder5Num}
                dayNum={tour.days}
                tourName={tour.tourName}
                estimatedCost={estimatedCost}
                adultNum={adultNum}
                childUnder10Num={childUnder10Num}
                childUnder5Num={childUnder5Num}
            />
        </div>
    )
}

export default Index
