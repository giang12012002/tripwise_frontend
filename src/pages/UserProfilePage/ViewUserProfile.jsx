import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import userProfileAPI from '@/apis/userProfileAPI.js'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import Swal from 'sweetalert2'
import { useAuth } from '@/AuthContext'
import avatarImage from '@/assets/images/maleAvatar.png' // Default avatar image

function ViewUserProfile() {
    const navigate = useNavigate()
    const { isLoggedIn, isAuthLoading } = useAuth()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    // Save and restore scroll position
    useEffect(() => {
        const savedScrollPosition = localStorage.getItem('scrollPosition')
        if (savedScrollPosition) {
            window.scrollTo(0, parseInt(savedScrollPosition, 10))
        }

        const handleBeforeUnload = () => {
            localStorage.setItem('scrollPosition', window.scrollY)
        }

        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [])

    // Check login status
    useEffect(() => {
        if (!isAuthLoading && !isLoggedIn) {
            Swal.fire({
                icon: 'success',
                text: 'Đăng xuất thành công!',
                showConfirmButton: false,
                timer: 1800
            })
            navigate('/')
        }
    }, [isLoggedIn, isAuthLoading, navigate])

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await userProfileAPI.getProfile()
                console.log('Profile response:', response.data)
                if (response.status === 200 && response.data) {
                    setProfile(response.data)
                } else if (response.status === 404) {
                    throw new Error(
                        'Không tìm thấy người dùng hoặc tài khoản đã bị khóa.'
                    )
                } else {
                    throw new Error('Không thể tải thông tin.')
                }
            } catch (err) {
                console.error('Fetch profile error:', err)
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text:
                        err.message ||
                        'Không thể tải thông tin. Vui lòng thử lại.',
                    showConfirmButton: false,
                    timer: 500
                })
                if (err.response?.status === 401) {
                    localStorage.removeItem('accessToken')
                    localStorage.removeItem('userId')
                    navigate('/signin')
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.',
                        showConfirmButton: false,
                        timer: 500
                    })
                } else if (err.response?.status === 404) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: 'Không tìm thấy người dùng hoặc tài khoản đã bị khóa.',
                        showConfirmButton: false,
                        timer: 500
                    })
                }
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [navigate])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <Header />
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
                    <p className="text-gray-600 text-lg">
                        Không tìm thấy thông tin người dùng.
                    </p>
                    <button
                        onClick={() => navigate('/signin')}
                        className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
                    >
                        Đăng nhập lại
                    </button>
                </div>
                <Footer />
            </div>
        )
    }

    // Combine address fields into fullAddress for display
    const fullAddress =
        `${profile.streetAddress || ''}, ${profile.district || ''}, ${profile.city || ''}`
            .replace(/, ,/g, '')
            .replace(/,$/, '') || 'Chưa cập nhật'

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
            <Header />
            <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                            Thông tin cá nhân
                        </h1>
                        <p className="mt-3 text-lg text-gray-600">
                            Xem và quản lý thông tin tài khoản của bạn
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Header with Avatar */}
                        <div className="bg-blue-600 p-6 flex flex-col items-center">
                            <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-4 bg-blue-500 flex items-center justify-center overflow-hidden">
                                <img
                                    src={profile.avatar || avatarImage}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = avatarImage // Fallback to default image on error
                                    }}
                                />
                            </div>
                            <h2 className="text-2xl font-semibold text-white">
                                {profile.userName || 'Không có tên'}
                            </h2>
                            <p className="text-blue-200">{profile.email}</p>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center space-x-3">
                                    <span className="font-medium text-gray-700">
                                        Tên đăng nhập
                                    </span>
                                    <span className="text-gray-900">
                                        {profile.userName || 'Chưa cập nhật'}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="font-medium text-gray-700">
                                        Họ tên:
                                    </span>
                                    <span className="text-gray-900">
                                        {profile.lastName +
                                            ' ' +
                                            profile.firstName ||
                                            'Chưa cập nhật'}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="font-medium text-gray-700">
                                        Phường/Xã:
                                    </span>
                                    <span className="text-gray-900">
                                        {profile.ward || 'Chưa cập nhật'}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="font-medium text-gray-700">
                                        Email:
                                    </span>
                                    <span className="text-gray-900">
                                        {profile.email}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="font-medium text-gray-700">
                                        Quận/Huyện:
                                    </span>
                                    <span className="text-gray-900">
                                        {profile.district || 'Chưa cập nhật'}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="font-medium text-gray-700">
                                        Số điện thoại:
                                    </span>
                                    <span className="text-gray-900">
                                        {profile.phoneNumber || 'Chưa cập nhật'}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="font-medium text-gray-700">
                                        Thành phố:
                                    </span>
                                    <span className="text-gray-900">
                                        {profile.city || 'Chưa cập nhật'}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="font-medium text-gray-700">
                                        Quốc gia:
                                    </span>
                                    <span className="text-gray-900">
                                        {profile.country || 'Chưa cập nhật'}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="font-medium text-gray-700">
                                        Địa chỉ:
                                    </span>
                                    <span className="text-gray-900">
                                        {fullAddress}
                                    </span>
                                </div>
                                <div className="md:col-span-2 mt-6">
                                    <button
                                        onClick={() =>
                                            navigate('/user/edit-Profile')
                                        }
                                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
                                    >
                                        Chỉnh sửa thông tin
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default ViewUserProfile
