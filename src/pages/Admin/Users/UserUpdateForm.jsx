import React, { useState, useEffect } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import Swal from 'sweetalert2'
import UserList from './UserList'
import DeletedUserList from './DeletedUserList'
import CreateUserForm from './CreateUserForm'
import UserDetails from './UserDetails'
import UserUpdateForm from './UserUpdateForm'
import userManagerApi from '@/apis/userManagerApi'

const UserManager = () => {
    const [allUsers, setAllUsers] = useState([])
    const [nonActiveUsers, setNonActiveUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false)
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)
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

    // Fetch all users
    const fetchAllUsers = async () => {
        try {
            const response = await userManagerApi.fetchAllUsers()
            setAllUsers(response.data)
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
            setIsCreateFormOpen(false)
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
            setIsUpdateFormOpen(false)
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

    // Open update form
    const handleOpenUpdateForm = () => {
        setIsUpdateFormOpen(true)
    }

    // Close update form
    const handleCloseUpdateForm = () => {
        setIsUpdateFormOpen(false)
    }

    // Open create form
    const handleOpenCreateForm = () => {
        setIsCreateFormOpen(true)
    }

    // Close create form
    const handleCloseCreateForm = () => {
        setIsCreateFormOpen(false)
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

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Quản lý người dùng
            </h1>
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
                    <Tab
                        className="px-4 py-2 text-gray-600 font-semibold cursor-pointer hover:bg-gray-200 rounded-t-md focus:outline-none"
                        selectedClassName="bg-white border-b-2 border-blue-600 text-blue-600"
                    >
                        Tạo người dùng
                    </Tab>
                </TabList>

                <TabPanel>
                    <UserList
                        users={allUsers}
                        onViewUserDetail={handleViewUserDetail}
                        onDeleteUser={handleDeleteUser}
                        onAddUser={handleOpenCreateForm}
                    />
                </TabPanel>
                <TabPanel>
                    <DeletedUserList
                        users={nonActiveUsers}
                        onViewUserDetail={handleViewUserDetail}
                        onActivateUser={handleActivateUser}
                    />
                </TabPanel>
                <TabPanel>
                    <CreateUserForm
                        createForm={createForm}
                        setCreateForm={setCreateForm}
                        onSubmit={handleCreateUser}
                    />
                </TabPanel>
            </Tabs>

            {selectedUser && (
                <>
                    <UserDetails
                        user={selectedUser}
                        onClose={() => setSelectedUser(null)}
                        onOpenUpdateForm={handleOpenUpdateForm}
                    />
                    {isUpdateFormOpen && (
                        <UserUpdateForm
                            updateForm={updateForm}
                            setUpdateForm={setUpdateForm}
                            onUpdate={handleUpdateUser}
                            onClose={handleCloseUpdateForm}
                        />
                    )}
                </>
            )}
            {isCreateFormOpen && (
                <CreateUserForm
                    createForm={createForm}
                    setCreateForm={setCreateForm}
                    onSubmit={handleCreateUser}
                    onClose={handleCloseCreateForm}
                />
            )}
        </div>
    )
}

export default UserManager
