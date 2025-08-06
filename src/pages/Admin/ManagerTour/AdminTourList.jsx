import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/AuthContext'
import AdminManagerTourAPI from '@/apis/adminManagerTourAPI.js'
import Swal from 'sweetalert2'

const AdminTourList = () => {
    const [tours, setTours] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('') // New state for status filter
    const [error, setError] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const toursPerPage = 6
    const navigate = useNavigate()
    const { isLoggedIn, isAuthLoading } = useAuth()

    const statusTranslations = {
        Draft: 'Bản Nháp',
        PendingApproval: 'Chờ duyệt',
        Approved: 'Đã duyệt',
        Rejected: 'Bị từ chối'
    }

    const statusColors = {
        Draft: 'bg-yellow-100 text-yellow-800',
        PendingApproval: 'bg-blue-100 text-blue-800',
        Approved: 'bg-green-100 text-green-800',
        Rejected: 'bg-red-100 text-red-800'
    }

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
                const response = await AdminManagerTourAPI.getAllTours(
                    statusFilter || null
                )
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
                console.error('Error fetching tours:', err)
                setError('Không thể tải danh sách tour. Vui lòng thử lại.')
            }
        }
        fetchTours()
    }, [statusFilter]) // Re-fetch when statusFilter changes

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1)
    }

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value)
        setCurrentPage(1)
    }

    const handleViewDetail = async (tourId) => {
        try {
            await AdminManagerTourAPI.getTourDetail(tourId)
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

    const filteredTours = tours.filter(
        (tour) =>
            tour.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tour.tourName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            false
    )

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

    const formatCurrency = (value) => {
        if (!value || isNaN(value)) return '0 đ'
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value)
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
                    Danh Sách Tour
                </h1>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo địa điểm hoặc tên tour..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full sm:w-2/3 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <select
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                        className="w-full sm:w-1/3 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="Draft">Bản Nháp</option>
                        <option value="PendingApproval">Chờ duyệt</option>
                        <option value="Approved">Đã duyệt</option>
                        <option value="Rejected">Bị từ chối</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentTours.length === 0 ? (
                    <div className="col-span-full text-center bg-white p-8 rounded-xl shadow-lg">
                        <p className="text-lg text-gray-600">
                            {searchTerm || statusFilter
                                ? 'Không tìm thấy tour phù hợp với tiêu chí.'
                                : 'Không có tour nào.'}
                        </p>
                    </div>
                ) : (
                    currentTours.map((tour, index) => (
                        <div
                            key={tour.tourId}
                            className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl flex flex-col"
                        >
                            <div className="relative h-48">
                                {tour.imageUrls && tour.imageUrls.length > 0 ? (
                                    <img
                                        src={tour.imageUrls[0]}
                                        alt={tour.tourName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-500">
                                            No Image
                                        </span>
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 bg-white bg-opacity-80 px-2 py-1 rounded-full text-xs font-semibold text-gray-800">
                                    #{indexOfFirstTour + index + 1}
                                </div>
                            </div>
                            <div className="p-4 flex-grow">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2 break-words">
                                    {tour.tourName}
                                </h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <svg
                                            className="w-4 h-4 mr-2 text-indigo-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                        {tour.location || 'N/A'}
                                    </div>
                                    <div className="flex items-center">
                                        <svg
                                            className="w-4 h-4 mr-2 text-indigo-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${
                                                statusColors[tour.status] ||
                                                'bg-gray-100 text-gray-800'
                                            }`}
                                        >
                                            {statusTranslations[tour.status] ||
                                                tour.status ||
                                                'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg
                                            className="w-4 h-4 mr-2 text-indigo-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        {new Date(
                                            tour.createdDate
                                        ).toLocaleDateString('vi-VN')}
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 pt-0 flex justify-end">
                                <span className="text-2xl font-bold text-blue-700">
                                    {formatCurrency(tour.price)}
                                </span>
                            </div>
                            <div className="p-6 pt-0 flex space-x-2">
                                <button
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition duration-200 flex items-center justify-center space-x-1"
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
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                    <span>Xem</span>
                                </button>
                                {tour.status === 'PendingApproval' && (
                                    <>
                                        <button
                                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition duration-200 flex items-center justify-center space-x-1"
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
                                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition duration-200 flex items-center justify-center space-x-1"
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
                                    </>
                                )}
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
