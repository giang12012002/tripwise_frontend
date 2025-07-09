import React, { useState, useEffect } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import Swal from 'sweetalert2'
import UserList from './UserList'
import DeletedUserList from './DeletedUserList'
import CreateUserForm from './CreateUserForm'
import UserDetailsModal from './UserDetails'
import userManagerApi from '@/apis/userManagerApi'

const UserManager = () => {
    const [allUsers, setAllUsers] = useState([])
    const [nonActiveUsers, setNonActiveUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false)
    const [createForm, setCreateForm] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        phoneNumber: '',
        password: '',
        role: 'USER'
    })
    const [updateForm, setUpdateForm] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        phoneNumber: '',
        country: '',
        city: '',
        ward: '',
        district: '',
        streetAddress: ''
    })
    const [deleteReasons, setDeleteReasons] = useState({})
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const usersPerPage = 6

    // Fetch all users
    const fetchAllUsers = async () => {
        try {
            const response = await userManagerApi.fetchAllUsers()
            setAllUsers(response.data)
            console.log('Fetched all users:', response.data.length)
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Lỗi khi lấy danh sách người dùng: ' + err.message,
                confirmButtonColor: '#2563eb'
            })
        }
    }

    // Fetch non-active users
    const fetchNonActiveUsers = async () => {
        try {
            const response = await userManagerApi.fetchNonActiveUsers()
            setNonActiveUsers(response.data)
            console.log('Fetched non-active users:', response.data.length)
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text:
                    'Lỗi khi lấy danh sách người dùng không active: ' +
                    err.message,
                confirmButtonColor: '#2563eb'
            })
        }
    }

    // Create a new user
    const handleCreateUser = async (e) => {
        e.preventDefault()
        try {
            await userManagerApi.createUser(createForm)
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Tạo người dùng thành công',
                confirmButtonColor: '#2563eb'
            })
            setCreateForm({
                firstName: '',
                lastName: '',
                userName: '',
                email: '',
                phoneNumber: '',
                password: '',
                role: 'USER'
            })
            setIsCreatePopupOpen(false)
            fetchAllUsers()
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text:
                    'Lỗi khi tạo người dùng: ' +
                    (err.response?.data?.message || err.message),
                confirmButtonColor: '#2563eb'
            })
        }
    }

    // View user details
    const handleViewUserDetail = async (userId) => {
        try {
            const response = await userManagerApi.fetchUserDetail(userId)
            setSelectedUser(response.data)
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Lỗi khi lấy chi tiết người dùng: ' + err.message,
                confirmButtonColor: '#2563eb'
            })
        }
    }

    // Update user
    const handleUpdateUser = async (e) => {
        e.preventDefault()
        try {
            await userManagerApi.updateUser(selectedUser.userId, updateForm)
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Cập nhật người dùng thành công',
                confirmButtonColor: '#2563eb'
            })
            setSelectedUser(null)
            fetchAllUsers()
            fetchNonActiveUsers()
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text:
                    'Lỗi khi cập nhật người dùng: ' +
                    (err.response?.data?.message || err.message),
                confirmButtonColor: '#2563eb'
            })
        }
    }

    // Delete user
    const handleDeleteUser = async (userId, reason) => {
        if (!reason) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Vui lòng nhập lý do xóa',
                confirmButtonColor: '#2563eb'
            })
            return
        }
        try {
            await userManagerApi.deleteUser(userId, reason)
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Xóa người dùng thành công',
                confirmButtonColor: '#2563eb'
            })
            setDeleteReasons((prev) => {
                const newReasons = { ...prev }
                delete newReasons[userId]
                return newReasons
            })
            fetchAllUsers()
            fetchNonActiveUsers()
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text:
                    'Lỗi khi xóa người dùng: ' +
                    (err.response?.data?.message || err.message),
                confirmButtonColor: '#2563eb'
            })
        }
    }

    // Activate user
    const handleActivateUser = async (userId) => {
        try {
            await userManagerApi.activateUser(userId)
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Kích hoạt người dùng thành công',
                confirmButtonColor: '#2563eb'
            })
            fetchAllUsers()
            fetchNonActiveUsers()
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text:
                    'Lỗi khi kích hoạt người dùng: ' +
                    (err.response?.data?.message || err.message),
                confirmButtonColor: '#2563eb'
            })
        }
    }

    // Load data when component mounts
    useEffect(() => {
        fetchAllUsers()
        fetchNonActiveUsers()
    }, [])

    // Update form when a user is selected
    useEffect(() => {
        if (selectedUser) {
            setUpdateForm({
                firstName: selectedUser.firstName || '',
                lastName: selectedUser.lastName || '',
                userName: selectedUser.userName || '',
                email: selectedUser.email || '',
                phoneNumber: selectedUser.phoneNumber || '',
                country: selectedUser.country || '',
                city: selectedUser.city || '',
                ward: selectedUser.ward || '',
                district: selectedUser.district || '',
                streetAddress: selectedUser.streetAddress || ''
            })
        }
    }, [selectedUser])

    // Reset page when search term changes
    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm])

    // Filter users based on search term
    const filteredAllUsers = allUsers.filter((user) =>
        user.userName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    const filteredNonActiveUsers = nonActiveUsers.filter((user) =>
        user.userName?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Pagination logic for all users
    const totalPagesAllUsers = Math.ceil(filteredAllUsers.length / usersPerPage)
    const startIndexAllUsers = (currentPage - 1) * usersPerPage
    const currentAllUsers = filteredAllUsers.slice(
        startIndexAllUsers,
        startIndexAllUsers + usersPerPage
    )

    // Pagination logic for non-active users
    const totalPagesNonActiveUsers = Math.ceil(
        filteredNonActiveUsers.length / usersPerPage
    )
    const startIndexNonActiveUsers = (currentPage - 1) * usersPerPage
    const currentNonActiveUsers = filteredNonActiveUsers.slice(
        startIndexNonActiveUsers,
        startIndexNonActiveUsers + usersPerPage
    )

    // Debugging logs
    console.log('Filtered All Users:', filteredAllUsers.length)
    console.log('Total Pages All Users:', totalPagesAllUsers)
    console.log('Current All Users:', currentAllUsers.length)
    console.log('Filtered Non-Active Users:', filteredNonActiveUsers.length)
    console.log('Total Pages Non-Active Users:', totalPagesNonActiveUsers)
    console.log('Current Non-Active Users:', currentNonActiveUsers.length)
    console.log('Current Page:', currentPage)

    const handlePageChange = (page) => {
        if (
            page >= 1 &&
            page <= Math.max(totalPagesAllUsers, totalPagesNonActiveUsers)
        ) {
            setCurrentPage(page)
            console.log('Page changed to:', page)
        }
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
            console.log('Previous page:', currentPage - 1)
        }
    }

    const handleNextPage = () => {
        if (
            currentPage < Math.max(totalPagesAllUsers, totalPagesNonActiveUsers)
        ) {
            setCurrentPage(currentPage + 1)
            console.log('Next page:', currentPage + 1)
        }
    }

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Quản lý người dùng
            </h1>
            <div className="mb-5 flex flex-col sm:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên người dùng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            <Tabs>
                <TabList className="flex border-b border-gray-200 mb-4">
                    <Tab
                        className="px-4 py-2 text-gray-600 font-semibold cursor-pointer hover:bg-gray-200 rounded-t-md focus:outline-none"
                        selectedClassName="bg-white border-b-2 border-blue-600 text-blue-600"
                    >
                        Tất cả người dùng
                    </Tab>
                    <Tab
                        className="px-4 py-2 text-gray-600 font-semibold cursor-pointer hover:bg-gray-200 rounded-t-md focus:outline-none"
                        selectedClassName="bg-white border-b-2 border-blue-600 text-blue-600"
                    >
                        Người dùng đã xóa
                    </Tab>
                </TabList>

                <TabPanel>
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => setIsCreatePopupOpen(true)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200"
                        >
                            Thêm khách hàng
                        </button>
                    </div>
                    {filteredAllUsers.length > 0 ? (
                        <UserList
                            users={currentAllUsers}
                            deleteReasons={deleteReasons}
                            setDeleteReasons={setDeleteReasons}
                            onViewUserDetail={handleViewUserDetail}
                            onDeleteUser={handleDeleteUser}
                        />
                    ) : (
                        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
                            <p className="text-lg text-gray-600">
                                Không tìm thấy người dùng phù hợp với tìm kiếm.
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
                            { length: totalPagesAllUsers },
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
                            disabled={currentPage === totalPagesAllUsers}
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
                    {filteredNonActiveUsers.length > 0 ? (
                        <DeletedUserList
                            users={currentNonActiveUsers}
                            onViewUserDetail={handleViewUserDetail}
                            onActivateUser={handleActivateUser}
                        />
                    ) : (
                        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
                            <p className="text-lg text-gray-600">
                                Không tìm thấy người dùng đã xóa phù hợp với tìm
                                kiếm.
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
                            { length: totalPagesNonActiveUsers },
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
                            disabled={currentPage === totalPagesNonActiveUsers}
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

            {selectedUser && (
                <UserDetailsModal
                    user={selectedUser}
                    updateForm={updateForm}
                    setUpdateForm={setUpdateForm}
                    onUpdate={handleUpdateUser}
                    onClose={() => setSelectedUser(null)}
                />
            )}
            {isCreatePopupOpen && (
                <CreateUserForm
                    createForm={createForm}
                    setCreateForm={setCreateForm}
                    onSubmit={handleCreateUser}
                    onClose={() => setIsCreatePopupOpen(false)}
                />
            )}
        </div>
    )
}

export default UserManager
