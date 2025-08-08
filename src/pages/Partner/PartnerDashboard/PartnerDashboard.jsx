import React from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/AuthContext'
import Swal from 'sweetalert2'

const PartnerDashboard = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { isLoggedIn, isAuthLoading, logout } = useAuth()

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

    const navItems = [
        // { label: 'Trang Chủ', path: '/' },
        { label: 'Danh Sách Tour', path: '/partner/listTour' }
        // { label: 'Tạo Tour Mới', path: '/partner/createTour' }
    ]

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="fixed w-64 h-screen bg-white shadow-lg p-6 overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Quản Lý Đối Tác
                </h2>
                <nav className="space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path)
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`w-full text-left px-4 py-2 rounded-lg transition duration-200 ${
                                    isActive
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-700 hover:bg-blue-100'
                                }`}
                            >
                                {item.label}
                            </button>
                        )
                    })}
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 rounded-lg transition duration-200"
                    >
                        Đăng Xuất
                    </button>
                </nav>
            </div>

            {/* Nội dung chính */}
            <div className="flex-1 p-6 ml-64">
                <Outlet />
            </div>
        </div>
    )
}

export default PartnerDashboard
