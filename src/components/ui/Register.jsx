import { Link } from 'react-router-dom'
import React, { useState } from 'react'
import beachSunset from '@/assets/images/background.png'

function Register() {
    const [showPassword, setShowPassword] = useState(false)
    const [showRePassword, setShowRePassword] = useState(false)

    const togglePasswordVisibility = () => setShowPassword(!showPassword)
    const toggleRePasswordVisibility = () => setShowRePassword(!showRePassword)

    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-white-50">
            {/* Left Section: Form */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 md:p-6 bg-white">
                <div className="w-full max-w-md md:max-w-lg">
                    <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                        TRIPWISE
                    </h1>
                    <p className="text-lg md:text-xl mb-6">
                        ĐI KHẮP VIỆT NAM – MỖI CHUYẾN ĐI, MỘT PHẦN CỦA BẠN.
                    </p>
                    <div>
                        <div className="mb-4">
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="tel"
                                placeholder="Phone"
                                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="FirstName"
                                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="LastName"
                                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                            />
                        </div>
                        <div className="mb-4 relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="PassWord"
                                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                                {showPassword ? (
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
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.977 9.977 0 011.663-3.854m3.854-3.854A10.05 10.05 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.977 9.977 0 01-1.663 3.854m-3.854 3.854L21 21m-6-6L9 9"
                                        />
                                    </svg>
                                ) : (
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
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <div className="mb-4 relative">
                            <input
                                type={showRePassword ? 'text' : 'password'}
                                placeholder="Re-PassWord"
                                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                            />
                            <button
                                type="button"
                                onClick={toggleRePasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                                {showRePassword ? (
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
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.977 9.977 0 011.663-3.854m3.854-3.854A10.05 10.05 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.977 9.977 0 01-1.663 3.854m-3.854 3.854L21 21m-6-6L9 9"
                                        />
                                    </svg>
                                ) : (
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
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm md:text-base"
                        >
                            Register
                        </button>
                    </div>
                    <p className="text-center text-gray-600 mt-4 text-sm md:text-base">
                        Bạn Đã Có Tài Khoản? Đăng Nhập{' '}
                        <Link
                            to="/signin"
                            className="text-blue-600 hover:underline"
                        >
                            Tại Đây
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Section - Background Image */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-6 bg-white-50">
                <div
                    className="relative w-full max-w-md md:max-w-2xl h-64 md:h-[500px] rounded-lg overflow-hidden shadow-lg bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url(${beachSunset})`
                    }}
                />
            </div>
        </div>
    )
}

export default Register
