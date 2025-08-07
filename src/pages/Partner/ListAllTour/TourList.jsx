import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/AuthContext'
import partnerTourAPI from '@/apis/partnerTourAPI'
import Swal from 'sweetalert2'

const TourList = () => {
    const [tours, setTours] = useState([])
    const [topDestinations, setTopDestinations] = useState([])
    const [status, setStatus] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
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
        Draft: 'bg-yellow-200 text-yellow-900',
        PendingApproval: 'bg-blue-200 text-blue-900',
        Approved: 'bg-green-200 text-green-900',
        Rejected: 'bg-red-200 text-red-900'
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
        const savedScrollPosition = localStorage.getItem('scrollPosition')
        if (savedScrollPosition) {
            window.scrollTo(0, parseInt(savedScrollPosition, 10))
        }

        const handleBeforeUnload = () => {
            localStorage.setItem('scrollPosition', window.scrollY)
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        return () =>
            window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [])

    useEffect(() => {
        const fetchTopDestinations = async () => {
            try {
                const response = await partnerTourAPI.getTopDestinations(10)
                const destinations = Object.entries(response.data || {}).map(
                    ([location, count]) => ({
                        location,
                        count
                    })
                )
                setTopDestinations(destinations)
            } catch (err) {
                console.error('Failed to fetch top destinations:', err)
                setError(
                    'Không thể tải danh sách địa điểm hàng đầu. Vui lòng thử lại.'
                )
                setTopDestinations([])
            }
        }

        const fetchTours = async () => {
            try {
                const response = await partnerTourAPI.getAllTours(status)
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
                setError('Không thể tải danh sách tour. Vui lòng thử lại.')
            }
        }

        fetchTopDestinations()
        fetchTours()
    }, [status])

    const handleStatusChange = (e) => {
        setStatus(e.target.value)
        setCurrentPage(1)
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1)
    }

    const handleViewDetail = async (tourId) => {
        try {
            await partnerTourAPI.getTourDetail(tourId)
            navigate(`/partner/detailTour/${tourId}`)
        } catch (err) {
            console.error('Error checking tour:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                errors: err.response?.data?.errors || 'Không có chi tiết lỗi'
            })
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Tour không tồn tại hoặc không thể truy cập.',
                showConfirmButton: false,
                timer: 1800
            })
        }
    }

    const handleEditTour = (tourId) => {
        navigate(`/partner/edit/${tourId}`)
    }

    const handleDeleteOrDraftTour = async (tourId, action) => {
        const confirm = await Swal.fire({
            icon: 'warning',
            title: 'Xác nhận hành động',
            text: 'Chọn một hành động cho tour này:',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Lưu về bản nháp',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#2563eb',
            showDenyButton: true,
            denyButtonText: 'Hủy',
            denyButtonColor: '#6b7280',
            customClass: {
                popup: 'swal-custom-width'
            },
            didOpen: () => {
                const popup = Swal.getPopup()
                if (popup) {
                    popup.style.width = '400px'
                }
            }
        })

        if (confirm.isConfirmed) {
            try {
                await partnerTourAPI.deleteOrDraftTour(tourId, 'delete')
                setTours(tours.filter((tour) => tour.tourId !== tourId))
                Swal.fire({
                    icon: 'success',
                    text: 'Xóa tour thành công!',
                    showConfirmButton: false,
                    timer: 1800
                })
            } catch (err) {
                console.error('Error deleting tour:', {
                    message: err.message,
                    response: err.response?.data,
                    status: err.response?.status,
                    errors:
                        err.response?.data?.errors || 'Không có chi tiết lỗi'
                })
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Không thể xóa tour. Vui lòng thử lại.',
                    showConfirmButton: false,
                    timer: 1800
                })
            }
        } else if (confirm.dismiss === Swal.DismissReason.cancel) {
            try {
                await partnerTourAPI.deleteOrDraftTour(tourId, 'to_draft')
                const response = await partnerTourAPI.getAllTours(status)
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
                Swal.fire({
                    icon: 'success',
                    text: 'Chuyển tour về bản nháp thành công!',
                    showConfirmButton: false,
                    timer: 1800
                })
            } catch (err) {
                console.error('Error moving tour to draft:', {
                    message: err.message,
                    response: err.response?.data,
                    status: err.response?.status,
                    errors:
                        err.response?.data?.errors || 'Không có chi tiết lỗi'
                })
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Không thể chuyển tour về bản nháp. Vui lòng thử lại.',
                    showConfirmButton: false,
                    timer: 1800
                })
            }
        }
    }

    const filteredTours = tours.filter((tour) =>
        tour.location?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
            {/* Top Destinations Section */}
            <section className="mb-12 bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl text-center font-bold text-gray-900 mb-6">
                    Top các thành phố được khách hàng quan tâm khi sử dụng AI
                    của TripWise
                </h2>
                {topDestinations.length === 0 ? (
                    <p className="text-gray-500 text-center text-lg">
                        Không có dữ liệu địa điểm hàng đầu.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {topDestinations.map((destination, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-indigo-600 font-bold text-lg">
                                            {index + 1}.
                                        </span>
                                        <span className="text-gray-800 font-medium">
                                            {destination.location || 'N/A'}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
                                        {destination.count || 0} tours
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Tour List Header */}
            <div className="flex flex-row justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Danh Sách Tour
                </h1>
                <button
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md flex items-center space-x-2"
                    onClick={() =>
                        navigate('/partner/createTour', { relative: 'path' })
                    }
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    <span>Tạo Tour Mới</span>
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-red-600 mb-6 text-center font-medium text-lg bg-red-50 p-4 rounded-lg">
                    {error}
                </p>
            )}

            {/* Search and Filter */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo địa điểm..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="flex-1 p-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm"
                />
                <select
                    value={status}
                    onChange={handleStatusChange}
                    className="p-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm"
                >
                    <option value="">Tất cả</option>
                    <option value="Draft">Bản Nháp</option>
                    <option value="PendingApproval">Chờ duyệt</option>
                    <option value="Approved">Đã duyệt</option>
                    <option value="Rejected">Bị từ chối</option>
                </select>
            </div>

            {/* Tour List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentTours.length === 0 ? (
                    <div className="col-span-full text-center bg-white p-12 rounded-2xl shadow-lg">
                        <p className="text-lg text-gray-600">
                            {searchTerm
                                ? 'Không tìm thấy tour phù hợp với địa điểm.'
                                : 'Không có tour nào.'}
                        </p>
                    </div>
                ) : (
                    currentTours.map((tour, index) => (
                        <div
                            key={tour.tourId}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col"
                        >
                            <div className="relative h-56">
                                {tour.imageUrls && tour.imageUrls.length > 0 ? (
                                    <img
                                        src={tour.imageUrls[0]}
                                        alt={tour.tourName}
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                        <span className="text-gray-400 text-lg">
                                            No Image
                                        </span>
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    #{indexOfFirstTour + index + 1}
                                </div>
                            </div>
                            <div className="p-6 flex-grow">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                                    {tour.tourName}
                                </h3>
                                <div className="space-y-3 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <svg
                                            className="w-5 h-5 mr-2 text-indigo-600"
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
                                        <span>{tour.location || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg
                                            className="w-5 h-5 mr-2 text-indigo-600"
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
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[tour.status] || 'bg-gray-100 text-gray-800'}`}
                                        >
                                            {statusTranslations[tour.status] ||
                                                tour.status ||
                                                'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg
                                            className="w-5 h-5 mr-2 text-indigo-600"
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
                                        <span>
                                            {new Date(
                                                tour.createdDate
                                            ).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 pt-0 flex justify-end">
                                <span className="text-2xl font-bold text-indigo-700">
                                    {formatCurrency(tour.price)}
                                </span>
                            </div>
                            <div className="p-6 pt-0 flex space-x-3">
                                <button
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2"
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
                                <button
                                    className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition-all duration-200 flex items-center justify-center space-x-2"
                                    onClick={() => handleEditTour(tour.tourId)}
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
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        />
                                    </svg>
                                    <span>Sửa</span>
                                </button>
                                <button
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all duration-200 flex items-center justify-center space-x-2"
                                    onClick={() =>
                                        handleDeleteOrDraftTour(tour.tourId)
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
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0h4m-7 4h12"
                                        />
                                    </svg>
                                    <span>Xóa/Nháp</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-12 space-x-3">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-md flex items-center disabled:opacity-50"
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
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                currentPage === index + 1
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50'
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-md flex items-center disabled:opacity-50"
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

export default TourList
