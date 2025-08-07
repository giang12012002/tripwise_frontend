import React, { useState } from 'react'
import Swal from 'sweetalert2'

const CreatePartnerForm = ({
    createForm,
    setCreateForm,
    onSubmit,
    onClose
}) => {
    const [showPassword, setShowPassword] = useState(false)

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const validatePhoneNumber = (phoneNumber) => {
        if (!phoneNumber) return true // Phone number is optional
        const phoneRegex = /^\+?[0-9]{7,15}$/
        return phoneRegex.test(phoneNumber)
    }

    const handleCancel = () => {
        setCreateForm({
            userName: '',
            email: '',
            password: '',
            companyName: '',
            phoneNumber: '',
            address: '',
            website: ''
        })
        onClose()
    }

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!validateEmail(createForm.email)) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Vui lòng nhập một địa chỉ email hợp lệ.',
                showConfirmButton: false,
                timer: 1800
            })
            return
        }
        if (!validatePhoneNumber(createForm.phoneNumber)) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Số điện thoại phải chứa 7-15 chữ số và có thể bắt đầu bằng "+".',
                showConfirmButton: false,
                timer: 1800
            })
            return
        }
        onSubmit(e)
    }

    return (
        <div
            className="fixed inset-0 flex justify-center items-center z-50 transition-opacity duration-300"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-partner-modal-title"
        >
            <div
                className="bg-white p-8 rounded-lg shadow-2xl border border-gray-200 max-w-3xl w-full m-4 max-h-[80vh] overflow-y-auto transform transition-all duration-300 scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2
                        id="create-partner-modal-title"
                        className="text-2xl font-bold text-gray-800"
                    >
                        Tạo đối tác mới
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                        aria-label="Đóng"
                    >
                        ×
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Tên người dùng
                            </label>
                            <input
                                type="text"
                                value={createForm.userName}
                                onChange={(e) =>
                                    setCreateForm({
                                        ...createForm,
                                        userName: e.target.value
                                    })
                                }
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                value={createForm.email}
                                onChange={(e) =>
                                    setCreateForm({
                                        ...createForm,
                                        email: e.target.value
                                    })
                                }
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="relative">
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Mật khẩu
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={createForm.password}
                                onChange={(e) =>
                                    setCreateForm({
                                        ...createForm,
                                        password: e.target.value
                                    })
                                }
                                className="w-full border border-gray-300 rounded-md p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6"
                                aria-label={
                                    showPassword
                                        ? 'Ẩn mật khẩu'
                                        : 'Hiện mật khẩu'
                                }
                            >
                                <svg
                                    className="h-5 w-5 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    {showPassword ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.487-3.342M6.262 6.262a9.97 9.97 0 013.342-1.487m4.266 12.85A10.05 10.05 0 0012 19c4.478 0 8.268-2.943 9.542-7a9.97 9.97 0 00-1.487-3.342m-4.266 12.85A10.05 10.05 0 0012 19m0 0a3 3 0 01-3-3m3 3a3 3 0 003-3m-9.75-6a10.05 10.05 0 011.487-3.342m4.266 12.85A10.05 10.05 0 0012 19m0 0a3 3 0 01-3-3m3 3a3 3 0 003-3"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    )}
                                </svg>
                            </button>
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Tên công ty
                            </label>
                            <input
                                type="text"
                                value={createForm.companyName}
                                onChange={(e) =>
                                    setCreateForm({
                                        ...createForm,
                                        companyName: e.target.value
                                    })
                                }
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Số điện thoại
                            </label>
                            <input
                                type="text"
                                value={createForm.phoneNumber}
                                onChange={(e) =>
                                    setCreateForm({
                                        ...createForm,
                                        phoneNumber: e.target.value
                                    })
                                }
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Địa chỉ
                            </label>
                            <input
                                type="text"
                                value={createForm.address}
                                onChange={(e) =>
                                    setCreateForm({
                                        ...createForm,
                                        address: e.target.value
                                    })
                                }
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Website
                            </label>
                            <input
                                type="text"
                                value={createForm.website}
                                onChange={(e) =>
                                    setCreateForm({
                                        ...createForm,
                                        website: e.target.value
                                    })
                                }
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition duration-200"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                        >
                            Tạo đối tác
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreatePartnerForm
