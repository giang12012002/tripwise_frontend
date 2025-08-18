import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import tourUserAPI from '@/apis/TourUserAPI'
import Swal from 'sweetalert2'
import TourCard from '@/pages/HomePage/TourCard.jsx'
import Header from '@/components/header/Header.jsx'
import Footer from '@/components/footer/Footer.jsx'
import TourFilter from '@/pages/AllToursPage/TourFilter.jsx'

const AllToursPage = () => {
    const [tours, setTours] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [error, setError] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [priceFilter, setPriceFilter] = useState('')
    const [cityFilter, setCityFilter] = useState('')
    const toursPerPage = 6
    const navigate = useNavigate()

    const cities = [
        'Hà Nội',
        'TP. Hồ Chí Minh',
        'Đà Nẵng',
        'Hội An',
        'Huế',
        'Nha Trang',
        'Đà Lạt',
        'Phú Quốc',
        'Hạ Long',
        'Sapa'
    ]

    useEffect(() => {
        const fetchApprovedTours = async () => {
            try {
                const response = await tourUserAPI.getApprovedTours()

                const validTours = response.data
                    .filter(
                        (tour) =>
                            tour.tourId &&
                            !isNaN(tour.tourId) &&
                            tour.tourId > 0
                    )
                    .sort(
                        (a, b) =>
                            new Date(b.createdDate) - new Date(a.createdDate)
                    )
                    .map((tour) => ({
                        id: tour.tourId,
                        name: tour.tourName,
                        price: tour.price || 0,
                        formattedPrice: tour.price
                            ? new Intl.NumberFormat('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND'
                              }).format(tour.price)
                            : '0 đ',
                        image:
                            tour.imageUrls?.[0] ||
                            'https://via.placeholder.com/150',
                        address: tour.location || 'Không xác định',
                        city: tour.location
                            ? extractCity(tour.location)
                            : 'Không xác định',
                        note: tour.note
                    }))
                setTours(validTours)
            } catch (err) {
                console.error('Error fetching all tours:', err)
                setError('Không thể tải danh sách tour. Vui lòng thử lại.')
            }
        }
        fetchApprovedTours()
    }, [])

    const extractCity = (location) => {
        const cityMatch = cities.find((city) =>
            location.toLowerCase().includes(city.toLowerCase())
        )
        return cityMatch || 'Không xác định'
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1)
    }

    const handleViewDetail = (tourId) => {
        if (!tourId || isNaN(tourId)) {
            console.error('Invalid tourId:', tourId)
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'ID tour không hợp lệ. Vui lòng thử lại.',
                showConfirmButton: false,
                timer: 1800
            })
            return
        }

        navigate(`/tour-detail/${tourId}`)
    }

    const filteredTours = tours.filter((tour) => {
        const matchesSearch =
            tour.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tour.address?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesPrice =
            priceFilter === ''
                ? true
                : priceFilter === 'low'
                  ? tour.price < 5000000
                  : priceFilter === 'medium'
                    ? tour.price >= 5000000 && tour.price <= 10000000
                    : tour.price > 10000000
        const matchesCity =
            cityFilter === '' ||
            tour.city.toLowerCase() === cityFilter.toLowerCase()
        return matchesSearch && matchesPrice && matchesCity
    })

    const totalPages = Math.ceil(filteredTours.length / toursPerPage)
    const indexOfLastTour = currentPage * toursPerPage
    const indexOfFirstTour = indexOfLastTour - toursPerPage
    const currentTours = filteredTours.slice(indexOfFirstTour, indexOfLastTour)

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <div className="flex flex-1 w-full px-4 sm:px-6 lg:px-4 mt-6 mb-8">
                {/* TourFilter Sidebar */}
                <div className="hidden lg:block w-80 ml-2 mr-2 bg-white shadow-lg rounded-lg p-4">
                    <TourFilter
                        priceFilter={priceFilter}
                        setPriceFilter={setPriceFilter}
                        cityFilter={cityFilter}
                        setCityFilter={setCityFilter}
                    />
                </div>
                {/* Main Content */}
                <section className="flex-1 bg-white shadow-lg rounded-lg p-4 ml-2">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-800">
                            Tất Cả Tour Du Lịch
                        </h2>
                        <div className="relative w-full mt-4">
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên tour hoặc địa điểm..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full p-2 pl-10 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <svg
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>
                    {error && (
                        <div className="col-span-full text-center bg-red-100 p-4 rounded-md mb-6">
                            <p className="text-base text-red-700">{error}</p>
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentTours.length === 0 ? (
                            <div className="col-span-full text-center bg-gray-50 p-4 rounded-md">
                                <p className="text-base text-gray-600">
                                    {searchTerm || priceFilter || cityFilter
                                        ? 'Không tìm thấy tour phù hợp với tiêu chí.'
                                        : 'Không có tour nào.'}
                                </p>
                            </div>
                        ) : (
                            currentTours.map((tour) => (
                                <TourCard
                                    key={tour.id}
                                    tour={{
                                        ...tour,
                                        price: tour.formattedPrice
                                    }}
                                    onViewDetail={() =>
                                        handleViewDetail(tour.id)
                                    }
                                />
                            ))
                        )}
                    </div>
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6 space-x-2">
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className="px-3 py-1 bg-gray-300 text-white rounded-md hover:bg-gray-400 disabled:opacity-50 flex items-center"
                            >
                                <svg
                                    className="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                                Trước
                            </button>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`px-3 py-1 rounded-md text-sm ${
                                        currentPage === index + 1
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center"
                            >
                                Sau
                                <svg
                                    className="w-4 h-4 ml-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                        </div>
                    )}
                </section>
            </div>
            <Footer />
        </div>
    )
}

export default AllToursPage
