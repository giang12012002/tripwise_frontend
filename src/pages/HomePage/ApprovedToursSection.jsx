import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import tourUserAPI from '@/apis/TourUserAPI'
import Swal from 'sweetalert2'
import TourCard from './TourCard'
import defaultTourImage from '@/assets/images/Biển.jpg'

const ApprovedToursSection = () => {
    const [tours, setTours] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [error, setError] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const toursPerPage = 6
    const navigate = useNavigate()

    useEffect(() => {
        const fetchApprovedTours = async () => {
            try {
                const response = await tourUserAPI.getApprovedTours()
                console.log('Approved tours fetched:', response.data)
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
                        price: tour.price
                            ? new Intl.NumberFormat('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND'
                              }).format(tour.price)
                            : '0 đ',
                        image: tour.imageUrls?.[0] || defaultTourImage,
                        address: tour.location || 'N/A'
                    }))
                setTours(validTours)
            } catch (err) {
                console.error('Error fetching approved tours:', err)
                setError('Không thể tải danh sách tour. Vui lòng thử lại.')
            }
        }
        fetchApprovedTours()
    }, [])

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
        console.log('Navigating to tour detail with ID:', tourId)
        navigate(`/tour-detail/${tourId}`)
    }

    // Filter tours based on search term
    const filteredTours = tours.filter(
        (tour) =>
            tour.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tour.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            false
    )

    // Pagination logic
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
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-100">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-blue-900 tracking-tight">
                    Tour Du Lịch Hot
                </h2>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên tour hoặc địa điểm..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full max-w p-3 mt-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mx-auto block"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {currentTours.length === 0 ? (
                    <div className="col-span-full text-center bg-white p-6 rounded-xl shadow-lg">
                        <p className="text-lg text-gray-600">
                            {searchTerm
                                ? 'Không tìm thấy tour phù hợp với tên hoặc địa điểm.'
                                : 'Không có tour nào.'}
                        </p>
                    </div>
                ) : (
                    currentTours.map((tour) => (
                        <TourCard
                            key={tour.id}
                            tour={tour}
                            onViewDetail={() => handleViewDetail(tour.id)}
                        />
                    ))
                )}
            </div>
            {totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gradient-to-r from-gray-400 to-gray-600 text-white rounded-lg hover:from-gray-500 hover:to-gray-700 transition-all duration-300 shadow-md flex items-center disabled:opacity-50"
                    >
                        <svg
                            className="w-5 h-5 mr-2"
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
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                                currentPage === index + 1
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50'
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg hover:from-blue-500 hover:to-blue-700 transition-all duration-300 shadow-md flex items-center disabled:opacity-50"
                    >
                        Sau
                        <svg
                            className="w-5 h-5 ml-2"
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
            <div className="text-center mt-6">
                <button
                    onClick={() => navigate('/tour-list')}
                    className="text-blue-600 font-semibold hover:underline hover:text-blue-800 transition-colors"
                >
                    Xem tất cả
                </button>
            </div>
        </section>
    )
}

export default ApprovedToursSection
