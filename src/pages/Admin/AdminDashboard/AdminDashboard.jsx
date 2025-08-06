import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/AuthContext'
import Swal from 'sweetalert2'

const AdminDashboard = () => {
    const navigate = useNavigate()
    const { isLoggedIn, isAuthLoading, logout } = useAuth()

    // Kiểm tra đăng nhập
    React.useEffect(() => {
        if (!isAuthLoading && !isLoggedIn) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Vui lòng đăng nhập để truy cập trang quản lý.',
                showConfirmButton: false,
                timer: 1800
            })
            navigate('/signin')
        }
    }, [isLoggedIn, isAuthLoading, navigate])

    const handleLogout = () => {
        logout()
        Swal.fire({
            icon: 'success',
            text: 'Đăng xuất thành công!',
            showConfirmButton: false,
            timer: 1800
        })
        navigate('/signin')
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="fixed w-64 h-screen bg-white shadow-lg p-6 overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Quản Lý Admin
                </h2>
                <nav className="space-y-2">
                    <button
                        onClick={() => navigate('/admin')}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-lg transition duration-200"
                    >
                        Trang Chủ
                    </button>
                    <button
                        onClick={() => navigate('/admin/reports')}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-lg transition duration-200"
                    >
                        Báo cáo thống kê
                    </button>
                    <button
                        onClick={() => navigate('/admin/blogs')}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-lg transition duration-200"
                    >
                        Quản Lý Bài Viết
                    </button>
                    <button
                        onClick={() => navigate('/admin/tours/pending')}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-lg transition duration-200"
                    >
                        Quản Lý Tour Đối Tác
                    </button>
                    <button
                        onClick={() => navigate('/admin/partners')}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-lg transition duration-200"
                    >
                        Quản Lý Tài Khoản Đối Tác
                    </button>
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-lg transition duration-200"
                    >
                        Quản Lý Tài Khoản Khách Hàng
                    </button>
                    <button
                        onClick={() => navigate('/admin/plans')}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-lg transition duration-200"
                    >
                        Quản Lý gói đăng ký
                    </button>
                    <button
                        onClick={() => navigate('/admin/logs')}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-lg transition duration-200"
                    >
                        Logs
                    </button>
                    <button
                        onClick={() => navigate('/admin/reviews')}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-lg transition duration-200"
                    >
                        Đánh giá người dùng
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 rounded-lg transition duration-200"
                    >
                        Đăng Xuất
                    </button>
                </nav>
            </div>

            {/* Nội dung chính */}
            <div className="flex-1 ml-64">
                <Outlet />
            </div>
        </div>
    )
}

export default AdminDashboard
