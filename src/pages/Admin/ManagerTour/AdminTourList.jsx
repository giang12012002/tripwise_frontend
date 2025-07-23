import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/AuthContext'
import AdminManagerTourAPI from '@/apis/adminManagerTourAPI.js'
import Swal from 'sweetalert2'

const AdminTourList = () => {
    const [tours, setTours] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [error, setError] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const toursPerPage = 6
    const navigate = useNavigate()
    const { isLoggedIn, isAuthLoading } = useAuth()

    useEffect(() => {
        if (!isAuthLoading && !isLoggedIn) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Vui lòng đăng nhập để xem danh sách tour.',
                showConfirmButton: false,
                timer: 1800
            })
            navigate('/signin')
        }
    }, [isLoggedIn, isAuthLoading, navigate])

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const response = await AdminManagerTourAPI.getPendingTours()
                console.log('Pending tours fetched:', response.data)
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
                setTours(validTours)
            } catch (err) {
                console.error('Error fetching pending tours:', err)
                setError(
                    'Không thể tải danh sách tour chờ duyệt. Vui lòng thử lại.'
                )
            }
        }
        fetchTours()
    }, [])

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1)
    }

    const handleViewDetail = async (tourId) => {
        try {
            await AdminManagerTourAPI.getTourDetail(tourId)
            console.log('Navigating to tour with ID:', tourId)
            navigate(`/admin/tourDetail/${tourId}`)
        } catch (err) {
            console.error('Error checking tour:', err)
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text:
                    err.response?.status === 404
                        ? `Tour với ID ${tourId} không tồn tại hoặc đã bị xóa.`
                        : 'Không thể truy cập tour. Vui lòng thử lại.',
                showConfirmButton: false,
                timer: 1800
            })
        }
    }

    const handleApproveTour = async (tourId) => {
        try {
            await AdminManagerTourAPI.approveTour(tourId)
            Swal.fire({
                icon: 'success',
                text: 'Tour đã được phê duyệt!',
                showConfirmButton: false,
                timer: 1800
            })
            setTours(tours.filter((tour) => tour.tourId !== tourId))
        } catch (err) {
            console.error('Error approving tour:', err)
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể phê duyệt tour. Vui lòng thử lại.',
                showConfirmButton: false,
                timer: 1800
            })
        }
    }

    const handleRejectTour = async (tourId) => {
        const { value: rejectReason } = await Swal.fire({
            title: 'Lý do từ chối',
            input: 'textarea',
            inputPlaceholder: 'Nhập lý do từ chối (ít nhất 5 ký tự)...',
            inputAttributes: {
                'aria-label': 'Lý do từ chối'
            },
            showCancelButton: true,
            confirmButtonText: 'Từ chối',
            cancelButtonText: 'Hủy',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#2563eb',
            inputValidator: (value) => {
                if (!value || value.trim().length < 5) {
                    return 'Lý do từ chối phải có ít nhất 5 ký tự.'
                }
            }
        })

        if (rejectReason) {
            try {
                await AdminManagerTourAPI.rejectTour(
                    tourId,
                    rejectReason.trim()
                )
                Swal.fire({
                    icon: 'success',
                    text: 'Tour đã bị từ chối thành công!',
                    showConfirmButton: false,
                    timer: 1800
                })
                setTours(tours.filter((tour) => tour.tourId !== tourId))
            } catch (err) {
                console.error('Error rejecting tour:', err)
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Không thể từ chối tour. Vui lòng thử lại.',
                    showConfirmButton: false,
                    timer: 1800
                })
            }
        }
    }

    // Filter tours based on search term
    const filteredTours = tours.filter(
        (tour) =>
            tour.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tour.tourName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        <div className="flex-grow max-w-6xl w-full mx-auto p-8 bg-gradient-to-b from-blue-50 to-white rounded-2xl shadow-xl mt-8">
            {error && (
                <p className="text-red-500 mb-6 text-center font-medium text-lg">
                    {error}
                </p>
            )}
            <div className="mb-6">
                <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight text-center">
                    Danh Sách Tour Chờ Duyệt
                </h1>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo địa điểm hoặc tên tour..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mt-4"
                />
            </div>
            <div className="grid grid-cols-1 gap-4">
                {currentTours.length === 0 ? (
                    <div className="text-center bg-white p-8 rounded-xl shadow-lg w-full">
                        <p className="text-lg text-gray-600">
                            {searchTerm
                                ? 'Không tìm thấy tour phù hợp với địa điểm hoặc tên.'
                                : 'Không có tour chờ duyệt.'}
                        </p>
                    </div>
                ) : (
                    currentTours.map((tour, index) => (
                        <div
                            key={tour.tourId}
                            className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl w-full"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-lg font-bold text-indigo-600">
                                            #{indexOfFirstTour + index + 1}.
                                        </span>
                                        <h3 className="text-xl font-semibold text-gray-800 truncate">
                                            {tour.tourName}
                                        </h3>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 flex items-center space-x-1"
                                            onClick={() =>
                                                handleViewDetail(tour.tourId)
                                            }
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M15 12c0-1.5-1.5-3-3-3s-3 1.5-3 3 1.5 3 3 3 3-1.5 3-3zm6 0c0 4.5-4.5 9-9 9s-9-4.5-9-9 4.5-9 9-9 9 4.5 9 9z"
                                                />
                                            </svg>
                                            <span>Xem chi tiết</span>
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 flex items-center space-x-1"
                                            onClick={() =>
                                                handleApproveTour(tour.tourId)
                                            }
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <span>Phê duyệt</span>
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 flex items-center space-x-1"
                                            onClick={() =>
                                                handleRejectTour(tour.tourId)
                                            }
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                            <span>Từ chối</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-3 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <span className="font-medium w-24">
                                            Địa điểm:
                                        </span>
                                        <span>{tour.location || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="font-medium w-24">
                                            Mô tả:
                                        </span>
                                        <span>{tour.description || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="font-medium w-24">
                                            Ngày tạo:
                                        </span>
                                        <span>
                                            {new Date(
                                                tour.createdDate
                                            ).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
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
        </div>
    )
}

export default AdminTourList
