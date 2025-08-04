import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import TourCard from '@/pages/HomePage/TourCard.jsx'

const RelatedToursSection = ({
    relatedTours,
    itineraryData,
    relatedTourMessage
}) => {
    const [filteredTours, setFilteredTours] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        // Format and filter tours, limit to maximum 3
        const validTours =
            relatedTours
                ?.filter(
                    (tour) =>
                        tour.tourId && !isNaN(tour.tourId) && tour.tourId > 0
                )
                ?.map((tour) => ({
                    id: tour.tourId,
                    name: tour.tourName || 'Tour không tên',
                    price: tour.price
                        ? new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND'
                          }).format(tour.price)
                        : '0 đ',
                    image: tour.thumbnail || 'Không xác định',
                    address: tour.location || 'Không xác định'
                }))
                ?.sort(
                    (a, b) =>
                        new Date(b.createdDate || new Date()) -
                        new Date(a.createdDate || new Date())
                )
                ?.slice(0, 3) || [] // Limit to 3 tours

        setFilteredTours(validTours)
    }, [relatedTours])

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

    return (
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-100 rounded-2xl shadow-xl mt-8">
            <div className="text-center mb-8">
                <h3 className="text-4xl font-bold text-blue-900 tracking-tight">
                    Tours du lịch tại {itineraryData?.destination || 'Địa điểm'}{' '}
                    liên quan
                </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredTours.length === 0 ? (
                    <div className="col-span-full text-center bg-white p-6 rounded-xl shadow-lg">
                        <p className="text-lg text-gray-600">
                            {relatedTourMessage ||
                                'Không có tour liên quan nào để hiển thị.'}
                        </p>
                    </div>
                ) : (
                    filteredTours.map((tour) => (
                        <TourCard
                            key={tour.id}
                            tour={tour}
                            onViewDetail={() => handleViewDetail(tour.id)}
                        />
                    ))
                )}
            </div>
        </section>
    )
}

export default RelatedToursSection
