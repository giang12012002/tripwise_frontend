import React, { useEffect, useState, useRef } from 'react'
import BookingSummary from './BookingSummary'
import BookingTable from './BookingTable'

import LoadingSpinner from '@/components/states/LoadingSpinner'

import { bookingTourAPI } from '@/apis'

function Index() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedTour, setSelectedTour] = useState('')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)

    const fetchBookingList = async () => {
        try {
            const response = await bookingTourAPI.getBookings()
            setBookings(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchBookingList()
        setLoading(false)
    }, [])

    // Lắng nghe sự kiện click bên ngoài dropdown để đóng nó
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [dropdownRef])

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

    // Lấy danh sách các tour duy nhất để tạo dropdown
    const uniqueTours = [
        '',
        ...new Set(bookings.map((booking) => booking.tourName))
    ]

    // Lọc danh sách bookings dựa trên tour được chọn
    const filteredBookings = selectedTour
        ? bookings.filter((booking) => booking.tourName === selectedTour)
        : bookings

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
            <main className="flex-grow py-10 max-w-7xl mx-auto w-full px-4">
                <h1 className="text-3xl font-bold text-center mb-8">
                    Tổng Quan Booking
                </h1>

                {/* Truyền mảng bookings gốc vào BookingSummary */}
                <BookingSummary bookings={bookings} />

                {/* Dropdown tùy chỉnh */}
                <div className="mb-6 flex justify-end items-center">
                    <label
                        htmlFor="tour-filter"
                        className="mr-2 text-gray-700 font-semibold"
                    >
                        Lọc theo tour:
                    </label>
                    <div
                        className="relative inline-block w-48"
                        ref={dropdownRef}
                    >
                        <button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="bg-white border border-gray-300 rounded-md shadow-sm p-2 w-full text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                        >
                            <span className="truncate">
                                {selectedTour || 'Tất cả tour'}
                            </span>
                            <svg
                                className={`h-4 w-4 transform ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>

                        {isDropdownOpen && (
                            <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {uniqueTours.map((tourName, index) => (
                                    <li
                                        key={index}
                                        onClick={() => {
                                            setSelectedTour(tourName)
                                            setIsDropdownOpen(false)
                                        }}
                                        className="p-2 cursor-pointer hover:bg-blue-50 transition duration-150 ease-in-out text-gray-900"
                                    >
                                        {tourName || 'Tất cả tour'}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Truyền mảng đã lọc vào BookingTable */}
                <BookingTable bookings={filteredBookings} />
            </main>
        </div>
    )
}

export default Index
