import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import userProfileAPI from '@/apis/userProfileAPI.js'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import Swal from 'sweetalert2'
import avatarImage from '@/assets/images/maleAvatar.png' // Import ảnh avatar

function EditUserProfile() {
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)
    const [formData, setFormData] = useState({
        userName: '',
        phoneNumber: '',
        country: '',
        city: '',
        ward: '',
        district: '',
        streetAddress: ''
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await userProfileAPI.getProfile()
                if (response.status === 200 && response.data) {
                    setProfile(response.data)
                    setFormData({
                        userName: response.data.userName || '',
                        phoneNumber: response.data.phoneNumber || '',
                        country: response.data.country || '',
                        city: response.data.city || '',
                        ward: response.data.ward || '',
                        district: response.data.district || '',
                        streetAddress: response.data.streetAddress || ''
                    })
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
                    timer: 1500
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
                        timer: 1500
                    })
                } else if (err.response?.status === 404) {
                    navigate('/view-profile')
                }
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [navigate])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await userProfileAPI.updateProfile(formData)
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Cập nhật hồ sơ thành công!',
                    showConfirmButton: false,
                    timer: 1500
                })
                navigate('/view-profile')
            } else {
                throw new Error('Không thể cập nhật hồ sơ.')
            }
        } catch (err) {
            console.error('Update profile error:', err)
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text:
                    err.response?.data?.message ||
                    'Không thể cập nhật hồ sơ. Vui lòng thử lại.',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

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

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
            <Header />
            <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                            Chỉnh sửa thông tin cá nhân
                        </h1>
                        <p className="mt-3 text-lg text-gray-600">
                            Cập nhật thông tin tài khoản của bạn
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Header with Avatar */}
                        <div className="bg-blue-600 p-6 flex flex-col items-center">
                            <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-4 bg-blue-500 flex items-center justify-center overflow-hidden">
                                <img
                                    src={avatarImage}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h2 className="text-2xl font-semibold text-white">
                                {profile.userName || 'Không có tên'}
                            </h2>
                            <p className="text-blue-200">{profile.email}</p>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-700 mb-2">
                                            Họ tên:
                                        </span>
                                        <input
                                            type="text"
                                            name="userName"
                                            value={formData.userName}
                                            onChange={handleInputChange}
                                            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Nhập họ tên"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-700 mb-2">
                                            Email:
                                        </span>
                                        <span className="text-gray-900 p-2">
                                            {profile.email}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-700 mb-2">
                                            Số điện thoại:
                                        </span>
                                        <input
                                            type="text"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-700 mb-2">
                                            Phường/Xã:
                                        </span>
                                        <input
                                            type="text"
                                            name="ward"
                                            value={formData.ward}
                                            onChange={handleInputChange}
                                            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Nhập phường/xã"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-700 mb-2">
                                            Quận/Huyện:
                                        </span>
                                        <input
                                            type="text"
                                            name="district"
                                            value={formData.district}
                                            onChange={handleInputChange}
                                            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Nhập quận/huyện"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-700 mb-2">
                                            Thành phố:
                                        </span>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Nhập thành phố"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-700 mb-2">
                                            Quốc gia:
                                        </span>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Nhập quốc gia"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-700 mb-2">
                                            Địa chỉ:
                                        </span>
                                        <input
                                            type="text"
                                            name="streetAddress"
                                            value={formData.streetAddress}
                                            onChange={handleInputChange}
                                            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Nhập địa chỉ"
                                        />
                                    </div>
                                    <div className="md:col-span-2 mt-6 flex justify-end space-x-4">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate('/view-profile')
                                            }
                                            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-200 shadow-md"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
                                        >
                                            Lưu thay đổi
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default EditUserProfile
