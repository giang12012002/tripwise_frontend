import { Link, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { v4 as uuidv4 } from 'uuid'
import beachSunset from '@/assets/images/background.png'
import { authAPI } from '@/apis'
import { useAuth } from '@/AuthContext'
import { jwtDecode } from 'jwt-decode'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import logoImage from '@/assets/images/logo2.png'

function Register() {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [showRePassword, setShowRePassword] = useState(false)
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { login, isLoggedIn } = useAuth()

    // Generate or retrieve deviceId
    useEffect(() => {
        if (!localStorage.getItem('deviceId')) {
            localStorage.setItem('deviceId', uuidv4())
        }
    }, [])

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/')
        }
    }, [isLoggedIn, navigate])

    const togglePasswordVisibility = () => setShowPassword(!showPassword)
    const toggleRePasswordVisibility = () => setShowRePassword(!showRePassword)

    const validateForm = () => {
        if (!email || !username || !password || !confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Vui lòng điền đầy đủ tất cả các trường!',
                showConfirmButton: false,
                timer: 500
            })
            return false
        }
        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Mật khẩu không khớp!',
                showConfirmButton: false,
                timer: 500
            })
            return false
        }
        return true
    }

    const handleSignup = async () => {
        if (!validateForm()) return
        setIsLoading(true)
        try {
            const newSignupRequestId = uuidv4()
            const response = await authAPI.signup(
                email,
                username,
                password,
                confirmPassword,
                newSignupRequestId
            )
            if (response.status === 200) {
                if (response.data.invalidFields?.length > 0) {
                    const fields = response.data.invalidFields.join(', ')
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: `Lỗi: ${fields} đã tồn tại!`,
                        showConfirmButton: false,
                        timer: 500
                    })
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công',
                        text: 'Vui lòng kiểm tra email để lấy mã OTP!',
                        showConfirmButton: false,
                        timer: 500
                    })
                    navigate('/otp-verification', {
                        state: {
                            email,
                            username,
                            password,
                            confirmPassword,
                            signupRequestId: newSignupRequestId
                        }
                    })
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: response.data.message || 'Đăng ký thất bại.',
                    showConfirmButton: false,
                    timer: 500
                })
            }
        } catch (error) {
            // Phân tích lỗi chi tiết
            if (error.response) {
                // Server trả về lỗi với status code
                const { status, data } = error.response
                if (status === 400) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: data.message || 'Dữ liệu không hợp lệ.',
                        showConfirmButton: false,
                        timer: 500
                    })
                } else if (status === 500) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: 'Lỗi server. Vui lòng thử lại sau.',
                        showConfirmButton: false,
                        timer: 500
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: data.message || 'Đăng ký thất bại.',
                        showConfirmButton: false,
                        timer: 500
                    })
                }
            } else if (error.request) {
                // Không nhận được phản hồi từ server
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Không thể kết nối đến server.',
                    showConfirmButton: false,
                    timer: 500
                })
            } else {
                // Lỗi khác
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Đã xảy ra lỗi. Vui lòng thử lại.',
                    showConfirmButton: false,
                    timer: 500
                })
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow min-h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-white-50">
                <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 md:p-6 bg-white">
                    <div className="w-full max-w-md md:max-w-lg">
                        <div className="flex items-center ">
                            <img
                                src={logoImage}
                                alt="Tripwise Logo"
                                className="h-10 w-auto mr-3" // Adjusted height, auto width to maintain aspect ratio
                            />
                            <h1 className="text-4xl font-bold text-blue-600">
                                TRIPWISE
                            </h1>
                        </div>
                        <p className="text-lg md:text-xl mb-6">
                            ĐI KHẮP VIỆT NAM – MỖI CHUYẾN ĐI, MỘT PHẦN CỦA BẠN.
                        </p>
                        <div>
                            <div className="mb-4">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="mb-4 relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    disabled={isLoading}
                                >
                                    {showPassword ? (
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
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.977 9.977 0 011.663-3.854m3.854-3.854A10.05 10.05 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.977 9.977 0 01-1.663 3.854m-3.854 3.854L21 21m-6-6L9 9"
                                            />
                                        </svg>
                                    ) : (
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
                                    )}
                                </button>
                            </div>
                            <div className="mb-4 relative">
                                <input
                                    type={showRePassword ? 'text' : 'password'}
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={toggleRePasswordVisibility}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    disabled={isLoading}
                                >
                                    {showRePassword ? (
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
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.977 9.977 0 011.663-3.854m3.854-3.854A10.05 10.05 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.977 9.977 0 01-1.663 3.854m-3.854 3.854L21 21m-6-6L9 9"
                                            />
                                        </svg>
                                    ) : (
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
                                    )}
                                </button>
                            </div>
                            <button
                                type="submit"
                                onClick={handleSignup}
                                className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm md:text-base"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
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
                <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-6 bg-white-50">
                    <div
                        className="relative w-full max-w-md md:max-w-2xl h-64 md:h-[500px] rounded-lg overflow-hidden shadow-lg bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${beachSunset})` }}
                    />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Register
