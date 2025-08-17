import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/AuthContext'
import AdminManagerTourAPI from '@/apis/adminManagerTourAPI.js'
import partnerManagerApi from '@/apis/partnerManagerApi.js'
import Swal from 'sweetalert2'

const AdminTourList = () => {
    const [tours, setTours] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [partners, setPartners] = useState([])
    const [selectedPartnerId, setSelectedPartnerId] = useState('')
    const [fromDate, setFromDate] = useState(() => {
        const date = new Date()
        date.setDate(date.getDate() - 6)
        return date.toISOString().split('T')[0]
    })
    const [toDate, setToDate] = useState(
        () => new Date().toISOString().split('T')[0]
    )
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
        Draft: 'bg-yellow-200 text-yellow-800',
        PendingApproval: 'bg-blue-200 text-blue-800',
        Approved: 'bg-green-200 text-green-800',
        Rejected: 'bg-red-200 text-red-800'
    }

    // Fetch partners
    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const response = await partnerManagerApi.fetchAllPartners()
                setPartners(response.data || [])
            } catch (err) {
                console.error('Lỗi khi lấy danh sách đối tác:', err)
                setError('Không thể tải danh sách đối tác.')
            }
        }
        fetchPartners()
    }, [])

    // Fetch tours on mount with default filters
    useEffect(() => {
        handleFilterApply()
    }, []) // Empty dependency array to run once on mount

    // Check login
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

    // Handle filter button click
    const handleFilterApply = async () => {
        try {
            const response = await AdminManagerTourAPI.getAllTours(
                statusFilter || null,
                selectedPartnerId || null,
                fromDate || null,
                toDate || null
            )
            const validTours = response.data
                .filter(
                    (tour) =>
                        tour.tourId && !isNaN(tour.tourId) && tour.tourId > 0
                )
                .sort(
                    (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
                )
            setTours(validTours)
            console.log('Danh sách tour:', validTours)
            setCurrentPage(1)
        } catch (err) {
            console.error('Lỗi khi lấy danh sách tour:', err)
            setError('Không thể tải danh sách tour. Vui lòng thử lại.')
        }
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1)
    }

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value)
    }

    const handlePartnerFilterChange = (e) => {
        setSelectedPartnerId(e.target.value)
    }

    const handleFromDateChange = (e) => {
        setFromDate(e.target.value)
    }

    const handleToDateChange = (e) => {
        setToDate(e.target.value)
    }

    const handleViewDetail = async (tourId) => {
        try {
            await AdminManagerTourAPI.getTourDetail(tourId)
            navigate(`/admin/tourDetail/${tourId}`)
        } catch (err) {
            console.error('Lỗi khi kiểm tra tour:', err)
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

    const handleApproveTour = async (tour) => {
        try {
            let response
            if (tour.originalTourId !== null) {
                response = await AdminManagerTourAPI.approveTourUpdate(
                    tour.originalTourId
                )
            } else {
                response = await AdminManagerTourAPI.approveTour(tour.tourId)
            }

            Swal.fire({
                icon: 'success',
                text: response.data.message || 'Tour đã được phê duyệt!',
                showConfirmButton: false,
                timer: 1800
            })
            // setTours(tours.filter((tour) => tour.tourId !== tour.tourId))
            handleFilterApply()
        } catch (err) {
            console.error('Lỗi khi phê duyệt tour:', err)
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể phê duyệt tour. Vui lòng thử lại.',
                showConfirmButton: false,
                timer: 1800
            })
        }
    }

    const handleRejectTour = async (tour) => {
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
                let response
                if (tour.originalTourId !== null) {
                    response = await AdminManagerTourAPI.rejectTourUpdate(
                        tour.originalTourId,
                        rejectReason
                    )
                } else {
                    response = await AdminManagerTourAPI.rejectTour(
                        tour.tourId,
                        rejectReason
                    )
                }
                Swal.fire({
                    icon: 'success',
                    text: response.data || 'Tour đã bị từ chối thành công!',
                    showConfirmButton: false,
                    timer: 1800
                })
                // setTours(tours.filter((tour) => tour.tourId !== tourId))
                handleFilterApply()
            } catch (err) {
                console.error('Lỗi khi từ chối tour:', err)
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

    const getCompanyName = (partnerId) => {
        const partner = partners.find((p) => p.partnerId === partnerId)
        return partner ? partner.companyName : 'N/A'
    }

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Content */}
                <div className="flex-1 bg-white rounded-2xl shadow-lg p-8">
                    {error && (
                        <p className="text-red-600 mb-6 text-center font-semibold">
                            {error}
                        </p>
                    )}
                    <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                        Quản Lý Tour Du Lịch
                    </h1>
                    <div className="mb-4 relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tìm kiếm
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Địa điểm hoặc tên tour..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full p-3 pl-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentTours.length === 0 ? (
                            <div className="col-span-full text-center bg-gray-100 p-8 rounded-xl">
                                <p className="text-lg text-gray-600">
                                    {searchTerm ||
                                    statusFilter ||
                                    selectedPartnerId ||
                                    fromDate ||
                                    toDate
                                        ? 'Không tìm thấy tour phù hợp với tiêu chí.'
                                        : 'Không có tour nào.'}
                                </p>
                            </div>
                        ) : (
                            currentTours.map((tour, index) => (
                                <div
                                    key={tour.tourId}
                                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
                                >
                                    {/* Hình ảnh */}
                                    <div className="relative h-48">
                                        {tour.imageUrls?.length > 0 ? (
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
                                        <div className="absolute top-3 right-3 bg-indigo-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                            #{indexOfFirstTour + index + 1}
                                        </div>
                                    </div>

                                    {/* Nội dung */}
                                    <div className="flex flex-col flex-1 p-6">
                                        {/* Tên tour */}
                                        <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2 min-h-[56px]">
                                            {tour.tourName}
                                        </h3>

                                        {/* Thông tin */}
                                        <div className="space-y-3 text-sm text-gray-600 flex-1">
                                            {/* Địa điểm */}
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
                                                {tour.location || 'N/A'}
                                            </div>

                                            {/* Trạng thái */}
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
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                        statusColors[
                                                            tour.status
                                                        ] ||
                                                        'bg-gray-100 text-gray-800'
                                                    }`}
                                                >
                                                    {statusTranslations[
                                                        tour.status
                                                    ] ||
                                                        tour.status ||
                                                        'N/A'}
                                                </span>
                                            </div>

                                            {/* Ngày tạo */}
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
                                                {new Date(
                                                    tour.createdDate
                                                ).toLocaleDateString('vi-VN')}
                                            </div>

                                            {/* Công ty */}
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
                                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                    />
                                                </svg>
                                                {tour.companyName}
                                            </div>

                                            {/* Ghi chú cập nhật (nếu có) */}
                                            {tour.updateNote && (
                                                <div className="flex items-center">
                                                    <svg
                                                        className="w-5 h-5 mr-2 text-indigo-500"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M9 12h6m-6 4h6M5 7h14M5 7a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7z"
                                                        />
                                                    </svg>
                                                    {tour.updateNote}
                                                </div>
                                            )}
                                        </div>

                                        {/* Giá + nút */}
                                        <div className="mt-4">
                                            <div className="flex justify-end">
                                                <span className="text-2xl font-bold text-indigo-600">
                                                    {formatCurrency(tour.price)}
                                                </span>
                                            </div>

                                            <div className="mt-4 flex gap-2">
                                                {/* Nút Xem */}
                                                <button
                                                    className="flex-1 min-w-0 px-2 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition duration-200 flex items-center justify-center space-x-2 text-xs"
                                                    onClick={() =>
                                                        handleViewDetail(
                                                            tour.tourId
                                                        )
                                                    }
                                                >
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
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
                                                    <span className="hidden sm:inline">
                                                        Xem
                                                    </span>
                                                </button>

                                                {tour.status ===
                                                    'PendingApproval' && (
                                                    <>
                                                        {/* Nút Phê duyệt */}
                                                        <button
                                                            className="flex-1 min-w-0 px-2 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition duration-200 flex items-center justify-center space-x-2 text-xs"
                                                            onClick={() =>
                                                                handleApproveTour(
                                                                    tour
                                                                )
                                                            }
                                                        >
                                                            <svg
                                                                className="w-5 h-5"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                />
                                                            </svg>
                                                            <span className="hidden sm:inline">
                                                                Phê duyệt
                                                            </span>
                                                        </button>

                                                        {/* Nút Từ chối */}
                                                        <button
                                                            className="flex-1 min-w-0 px-2 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition duration-200 flex items-center justify-center space-x-2 text-xs"
                                                            onClick={() =>
                                                                handleRejectTour(
                                                                    tour
                                                                )
                                                            }
                                                        >
                                                            <svg
                                                                className="w-5 h-5"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M6 18L18 6M6 6l12 12"
                                                                />
                                                            </svg>
                                                            <span className="hidden sm:inline">
                                                                Từ chối
                                                            </span>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-8 space-x-3">
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 disabled:opacity-50 flex items-center"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
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
                                    className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
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
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 disabled:opacity-50 flex items-center"
                            >
                                Sau
                                <svg
                                    className="w-5 h-5 ml-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
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
                {/* Filter Sidebar */}
                <div className="w-80 max-h-fit lg:w-80 bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                        Bộ Lọc
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Trạng thái
                            </label>
                            <select
                                value={statusFilter}
                                onChange={handleStatusFilterChange}
                                className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                            >
                                <option value="">Tất cả trạng thái</option>
                                <option value="Draft">Bản Nháp</option>
                                <option value="PendingApproval">
                                    Chờ duyệt
                                </option>
                                <option value="Approved">Đã duyệt</option>
                                <option value="Rejected">Bị từ chối</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Đối tác
                            </label>
                            <select
                                value={selectedPartnerId}
                                onChange={handlePartnerFilterChange}
                                className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                            >
                                <option value="">Tất cả đối tác</option>
                                {partners.map((partner) => (
                                    <option
                                        key={partner.partnerId}
                                        value={partner.partnerId}
                                    >
                                        {partner.companyName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Từ ngày
                                </label>
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={handleFromDateChange}
                                    className="w-34 p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Đến ngày
                                </label>
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={handleToDateChange}
                                    className="w-34 p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleFilterApply}
                            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition duration-200"
                        >
                            Áp dụng bộ lọc
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminTourList
