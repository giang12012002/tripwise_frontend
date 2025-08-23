import React, { useState, useEffect } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import Swal from 'sweetalert2'
import PartnerList from './PartnerList'
import DeletedPartnerList from './DeletedPartnerList'
import CreatePartnerForm from './CreatePartnerForm'
import PartnerDetails from './PartnerDetails'
import partnerManagerApi from '@/apis/partnerManagerApi'

const PartnerManager = () => {
    const [allPartners, setAllPartners] = useState([])
    const [nonActivePartners, setNonActivePartners] = useState([])
    const [selectedPartner, setSelectedPartner] = useState(null)
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false)
    const [createForm, setCreateForm] = useState({
        userName: '',
        email: '',
        password: '',
        companyName: '',
        phoneNumber: '',
        address: '',
        website: ''
    })
    const [updateForm, setUpdateForm] = useState({
        userName: '',
        email: '',
        companyName: '',
        phoneNumber: '',
        address: '',
        website: ''
    })
    const [deleteReasons, setDeleteReasons] = useState({})
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const partnersPerPage = 6

    // Fetch all partners
    const fetchAllPartners = async () => {
        try {
            const response = await partnerManagerApi.fetchAllPartners()
            setAllPartners(response.data)
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Lỗi khi lấy danh sách đối tác: ' + err.message,
                confirmButtonColor: '#2563eb'
            })
        }
    }

    // Fetch non-active partners
    const fetchNonActivePartners = async () => {
        try {
            const response = await partnerManagerApi.fetchNonActivePartners()
            setNonActivePartners(response.data)
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text:
                    'Lỗi khi lấy danh sách đối tác không hoạt động: ' +
                    err.message,
                confirmButtonColor: '#2563eb'
            })
        }
    }

    // Create a new partner
    const handleCreatePartner = async (e) => {
        e.preventDefault()
        try {
            await partnerManagerApi.createPartner(createForm)
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Tạo đối tác thành công',
                confirmButtonColor: '#2563eb'
            })
            setCreateForm({
                userName: '',
                email: '',
                password: '',
                companyName: '',
                phoneNumber: '',
                address: '',
                website: ''
            })
            setIsCreatePopupOpen(false)
            fetchAllPartners()
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text:
                    'Lỗi khi tạo đối tác: ' +
                    (err.response?.data?.message || err.message),
                confirmButtonColor: '#2563eb'
            })
        }
    }

    // View partner details
    const handleViewPartnerDetail = async (partnerId) => {
        try {
            const response =
                await partnerManagerApi.fetchPartnerDetail(partnerId)
            setSelectedPartner(response.data)
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Lỗi khi lấy chi tiết đối tác: ' + err.message,
                confirmButtonColor: '#2563eb'
            })
        }
    }

    // Update partner
    const handleUpdatePartner = async (e) => {
        e.preventDefault()
        try {
            await partnerManagerApi.updatePartner(
                selectedPartner.partnerId,
                updateForm
            )
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Cập nhật đối tác thành công',
                confirmButtonColor: '#2563eb'
            })
            setSelectedPartner(null)
            fetchAllPartners()
            fetchNonActivePartners()
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text:
                    'Lỗi khi cập nhật đối tác: ' +
                    (err.response?.data?.message || err.message),
                confirmButtonColor: '#2563eb'
            })
        }
    }

    // Delete partner
    const handleDeletePartner = async (partnerId, reason) => {
        if (!reason) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Vui lòng nhập lý do',
                confirmButtonColor: '#2563eb'
            })
            return
        }
        try {
            await partnerManagerApi.deletePartner(partnerId, reason)
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Vô hiệu hóa đối tác thành công',
                confirmButtonColor: '#2563eb'
            })
            setDeleteReasons((prev) => {
                const newReasons = { ...prev }
                delete newReasons[partnerId]
                return newReasons
            })
            fetchAllPartners()
            fetchNonActivePartners()
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text:
                    'Lỗi khi vô hiệu hóa đối tác: ' +
                    (err.response?.data?.message || err.message),
                confirmButtonColor: '#2563eb'
            })
        }
    }

    // Activate partner
    const handleActivatePartner = async (partnerId) => {
        try {
            await partnerManagerApi.activatePartner(partnerId)
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Kích hoạt đối tác thành công',
                confirmButtonColor: '#2563eb'
            })
            fetchAllPartners()
            fetchNonActivePartners()
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text:
                    'Lỗi khi kích hoạt đối tác: ' +
                    (err.response?.data?.message || err.message),
                confirmButtonColor: '#2563eb'
            })
        }
    }

    // Load data when component mounts
    useEffect(() => {
        fetchAllPartners()
        fetchNonActivePartners()
    }, [])

    // Update form when a partner is selected
    useEffect(() => {
        if (selectedPartner) {
            setUpdateForm({
                userName: selectedPartner.userName || '',
                email: selectedPartner.email || '',
                companyName: selectedPartner.companyName || '',
                phoneNumber: selectedPartner.phoneNumber || '',
                address: selectedPartner.address || '',
                website: selectedPartner.website || ''
            })
        }
    }, [selectedPartner])

    // Reset page when search term changes
    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm])

    // Filter partners based on search term
    const filteredAllPartners = allPartners.filter(
        (partner) =>
            partner.companyName
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            partner.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    const filteredNonActivePartners = nonActivePartners.filter(
        (partner) =>
            partner.companyName
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            partner.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Pagination logic for all partners
    const totalPagesAllPartners = Math.ceil(
        filteredAllPartners.length / partnersPerPage
    )
    const startIndexAllPartners = (currentPage - 1) * partnersPerPage
    const currentAllPartners = filteredAllPartners.slice(
        startIndexAllPartners,
        startIndexAllPartners + partnersPerPage
    )

    // Pagination logic for non-active partners
    const totalPagesNonActivePartners = Math.ceil(
        filteredNonActivePartners.length / partnersPerPage
    )
    const startIndexNonActivePartners = (currentPage - 1) * partnersPerPage
    const currentNonActivePartners = filteredNonActivePartners.slice(
        startIndexNonActivePartners,
        startIndexNonActivePartners + partnersPerPage
    )

    const handlePageChange = (page) => {
        if (
            page >= 1 &&
            page <= Math.max(totalPagesAllPartners, totalPagesNonActivePartners)
        ) {
            setCurrentPage(page)
        }
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handleNextPage = () => {
        if (
            currentPage <
            Math.max(totalPagesAllPartners, totalPagesNonActivePartners)
        ) {
            setCurrentPage(currentPage + 1)
        }
    }

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Quản lý đối tác
            </h1>
            <div className="mb-5 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên công ty hoặc email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
            <Tabs>
                <TabList className="flex border-b border-gray-200 mb-4">
                    <Tab
                        className="px-4 py-2 text-gray-600 font-semibold cursor-pointer hover:bg-gray-200 rounded-t-md focus:outline-none"
                        selectedClassName="bg-white border-b-2 border-blue-600 text-blue-600"
                    >
                        Tất cả đối tác
                    </Tab>
                    <Tab
                        className="px-4 py-2 text-gray-600 font-semibold cursor-pointer hover:bg-gray-200 rounded-t-md focus:outline-none"
                        selectedClassName="bg-white border-b-2 border-blue-600 text-blue-600"
                    >
                        Tài khoản vô hiệu hóa
                    </Tab>
                </TabList>

                <TabPanel>
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => setIsCreatePopupOpen(true)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200"
                        >
                            Thêm đối tác
                        </button>
                    </div>
                    {filteredAllPartners.length > 0 ? (
                        <PartnerList
                            partners={currentAllPartners}
                            deleteReasons={deleteReasons}
                            setDeleteReasons={setDeleteReasons}
                            onViewPartnerDetail={handleViewPartnerDetail}
                            onDeletePartner={handleDeletePartner}
                        />
                    ) : (
                        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
                            <p className="text-lg text-gray-600">
                                Không tìm thấy đối tác phù hợp với tìm kiếm.
                            </p>
                        </div>
                    )}
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
                        {Array.from(
                            { length: totalPagesAllPartners },
                            (_, index) => index + 1
                        ).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                                    currentPage === page
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPagesAllPartners}
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
                </TabPanel>
                <TabPanel>
                    {filteredNonActivePartners.length > 0 ? (
                        <DeletedPartnerList
                            partners={currentNonActivePartners}
                            onViewPartnerDetail={handleViewPartnerDetail}
                            onActivatePartner={handleActivatePartner}
                        />
                    ) : (
                        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
                            <p className="text-lg text-gray-600">
                                Không tìm thấy đối tác phù hợp với tìm kiếm.
                            </p>
                        </div>
                    )}
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
                        {Array.from(
                            { length: totalPagesNonActivePartners },
                            (_, index) => index + 1
                        ).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                                    currentPage === page
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={handleNextPage}
                            disabled={
                                currentPage === totalPagesNonActivePartners
                            }
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
                </TabPanel>
            </Tabs>

            {selectedPartner && (
                <PartnerDetails
                    partner={selectedPartner}
                    updateForm={updateForm}
                    setUpdateForm={setUpdateForm}
                    onUpdate={handleUpdatePartner}
                    onClose={() => setSelectedPartner(null)}
                />
            )}
            {isCreatePopupOpen && (
                <CreatePartnerForm
                    createForm={createForm}
                    setCreateForm={setCreateForm}
                    onSubmit={handleCreatePartner}
                    onClose={() => setIsCreatePopupOpen(false)}
                />
            )}
        </div>
    )
}

export default PartnerManager
