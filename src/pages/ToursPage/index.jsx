import React, { useEffect, useState } from 'react'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import { useNavigate } from 'react-router-dom'
import { tourUserAPI } from '@/apis'

function Index() {
    const [tours, setTours] = useState([])
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const fetchTours = async () => {
        try {
            const response = await tourUserAPI.getApprovedTours()
            setTours(response.data)
        } catch (err) {
            setError(err.message)
        }
    }

    useEffect(() => {
        fetchTours()
    }, [])

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const toursPerPage = 4 // số blog mỗi trang

    const totalPages = Math.ceil(tours.length / toursPerPage)
    const startIndex = (currentPage - 1) * toursPerPage
    const currentTours = tours.slice(startIndex, startIndex + toursPerPage)

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
            <Header />
            <main className="flex-grow py-10">
                <h1 className="text-3xl font-bold text-center">
                    Danh sách các tour
                </h1>
                <p className="mt-4 text-gray-600 text-center">
                    Tận hưởng các tour du lịch mới nhất từ các đối tác của chúng
                    tôi.
                </p>
                <div className="mt-8 max-w-4xl mx-auto px-4">
                    {tours.length === 0 ? (
                        <p className="text-center text-gray-500">
                            Không có tour nào.
                        </p>
                    ) : (
                        <>
                            <ul className="space-y-6">
                                {currentTours.map((tour) => (
                                    <li
                                        key={tour.tourId}
                                        className="flex bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-200 cursor-pointer hover:ring-2 hover:ring-blue-400 active:scale-95 gap-6"
                                        onClick={() =>
                                            setTimeout(() => {
                                                navigate(
                                                    `/tour-detail/${tour.tourId}`
                                                )
                                            }, 100)
                                        }
                                    >
                                        <div className="w-3/10 max-w-[30%] aspect-[4/3] bg-gray-200 overflow-hidden rounded-md flex items-center justify-center">
                                            <img
                                                src={
                                                    tour.imageUrls.length > 0
                                                        ? tour.imageUrls[0]
                                                        : '/image.png'
                                                }
                                                alt={`Đây là ảnh của ${tour.tourName}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="w-7/10">
                                            <h2
                                                className="text-xl font-semibold line-clamp-2"
                                                title={tour.tourName}
                                            >
                                                {tour.tourName}
                                            </h2>
                                            <p className="mt-2 text-gray-600 line-clamp-3">
                                                {tour.description}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* Pagination */}
                            <div className="flex justify-center mt-8 space-x-2">
                                <button
                                    onClick={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 hover:cursor-pointer"
                                >
                                    Trước
                                </button>

                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`px-4 py-2 rounded hover:cursor-pointer ${
                                            currentPage === i + 1
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-200 hover:bg-gray-300'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 hover:cursor-pointer"
                                >
                                    Tiếp
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default Index
