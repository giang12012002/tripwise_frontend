// Index.jsx
import React, { useEffect, useState } from 'react'
import BookingTable from './BookingTable'
import BookingSummary from './BookingSummary'
import LoadingSpinner from '@/components/states/LoadingSpinner'
import { adminManagerTourAPI } from '@/apis'
import { useBookingActions } from './bookingActions'

function Index() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchBookingList = async () => {
        try {
            const response = await adminManagerTourAPI.getBookings({})
            setBookings(response.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBookingList()
    }, [])

    const {
        handleViewDetails,
        handleConfirmRefund,
        handleRejectRefund,
        handleCompleteRefund
    } = useBookingActions(fetchBookingList)

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
                <main className="flex-grow py-10 max-w-7xl mx-auto w-full px-4">
                    <h1 className="text-3xl font-bold text-center mb-8">
                        Tổng Quan Booking
                    </h1>
                    <LoadingSpinner />
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
            <main className="flex-grow py-10 max-w-7xl mx-auto w-full px-4">
                <h1 className="text-3xl font-bold text-center mb-8">
                    Tổng Quan Booking
                </h1>

                <BookingSummary bookings={bookings} />

                <BookingTable
                    bookings={bookings}
                    onViewDetails={handleViewDetails}
                    onConfirmRefund={handleConfirmRefund}
                    onRejectRefund={handleRejectRefund}
                    onCompleteRefund={handleCompleteRefund}
                />
            </main>
        </div>
    )
}

export default Index
