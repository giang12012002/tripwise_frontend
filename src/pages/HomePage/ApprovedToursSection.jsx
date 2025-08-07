import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import tourUserAPI from '@/apis/TourUserAPI'
import Swal from 'sweetalert2'
import TourCard from './TourCard'

const ApprovedToursSection = () => {
    const [tours, setTours] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

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
                        price: tour.price
                            ? new Intl.NumberFormat('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND'
                              }).format(tour.price)
                            : '0 đ',
                        image:
                            tour.imageUrls?.[0] ||
                            'https://via.placeholder.com/150',
                        address: tour.location || 'Không xác định'
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

    // Filter tours based on search term
    const filteredTours = tours.filter(
        (tour) =>
            tour.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tour.address?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Limit to 6 tours for homepage display
    const displayedTours = filteredTours.slice(0, 6)

    return (
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-100 mb-12">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-blue-900 tracking-tight">
                    Tour Du Lịch Hot
                </h2>
                {/*<input*/}
                {/*    type="text"*/}
                {/*    placeholder="Tìm kiếm theo tên tour hoặc địa điểm..."*/}
                {/*    value={searchTerm}*/}
                {/*    onChange={handleSearchChange}*/}
                {/*    className="w-full max-w-md p-3 mt-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mx-auto block"*/}
                {/*/>*/}
            </div>
            {error && (
                <div className="col-span-full text-center bg-white p-6 rounded-xl shadow-lg mb-6">
                    <p className="text-lg text-red-600">{error}</p>
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {displayedTours.length === 0 ? (
                    <div className="col-span-full text-center bg-white p-6 rounded-xl shadow-lg">
                        <p className="text-lg text-gray-600">
                            {searchTerm
                                ? 'Không tìm thấy tour phù hợp với tên hoặc địa điểm.'
                                : 'Không có tour nào.'}
                        </p>
                    </div>
                ) : (
                    displayedTours.map((tour) => (
                        <TourCard
                            key={tour.id}
                            tour={tour}
                            onViewDetail={() => handleViewDetail(tour.id)}
                        />
                    ))
                )}
            </div>
            <div className="text-center mt-6">
                <button
                    onClick={() => navigate('/alltour')}
                    className="text-blue-600 font-semibold hover:underline hover:text-blue-800 transition-colors"
                >
                    Xem tất cả
                </button>
            </div>
        </section>
    )
}

export default ApprovedToursSection
