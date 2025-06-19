import { Link, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import beachSunset from '@/assets/images/background.png'
import { authAPI } from '@/apis'
import { useAuth } from '@/AuthContext'

function Register() {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [showRePassword, setShowRePassword] = useState(false)
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [otp, setOtp] = useState('')
    const [signupRequestId, setSignupRequestId] = useState(null)
    const [showOtpField, setShowOtpField] = useState(false)
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
            toast.error('Vui lòng điền đầy đủ tất cả các trường!')
            return false
        }
        if (password !== confirmPassword) {
            toast.error('Mật khẩu không khớp!')
            return false
        }
        return true
    }

    const handleSignup = async () => {
        if (!validateForm()) return
        setIsLoading(true)
        try {
            const newSignupRequestId = uuidv4()
            setSignupRequestId(newSignupRequestId)
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
                    toast.error(`Lỗi: ${fields} đã tồn tại!`)
                } else {
                    setShowOtpField(true)
                    toast.success('Vui lòng kiểm tra email để lấy mã OTP!')
                }
            } else {
                toast.error('Đăng ký thất bại. Vui lòng thử lại.')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Đăng ký thất bại.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendOtp = async () => {
        if (!signupRequestId) {
            toast.error('Không thể gửi lại OTP. Vui lòng thử đăng ký lại.')
            return
        }
        setIsLoading(true)
        try {
            const response = await authAPI.signup(
                email,
                username,
                password,
                confirmPassword,
                signupRequestId
            )
            if (response.status === 200) {
                if (response.data.invalidFields?.length > 0) {
                    toast.error(
                        'Không thể gửi lại OTP do email hoặc username đã tồn tại.'
                    )
                    setShowOtpField(false)
                } else {
                    toast.success('Mã OTP mới đã được gửi đến email của bạn!')
                }
            } else {
                toast.error('Gửi lại OTP thất bại. Vui lòng thử lại.')
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || 'Gửi lại OTP thất bại.'
            )
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerifyOtp = async () => {
        if (!otp) {
            toast.error('Vui lòng nhập mã OTP!')
            return
        }
        setIsLoading(true)
        try {
            const userSignupData = {
                email,
                username,
                password,
                confirmPassword,
                signupRequestId
            }
            const response = await authAPI.verifyOtp(otp, userSignupData)
            if (response.status === 200 || response.status === 201) {
                toast.success('Đăng ký thành công!')
                const { accessToken, refreshToken, userId } = response.data
                if (accessToken && refreshToken) {
                    localStorage.setItem('accessToken', accessToken)
                    localStorage.setItem('refreshToken', refreshToken)
                    localStorage.setItem(
                        'deviceId',
                        localStorage.getItem('deviceId')
                    )
                    if (userId) {
                        localStorage.setItem('userId', userId)
                    }
                }
                login(username)
                navigate('/')
            } else {
                toast.error(response.data.message || 'Xác minh OTP thất bại.')
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || 'Xác minh OTP thất bại.'
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-white-50">
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                                disabled={isLoading || showOtpField}
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                                disabled={isLoading || showOtpField}
                            />
                        </div>
                        <div className="mb-4 relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                                disabled={isLoading || showOtpField}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                disabled={isLoading || showOtpField}
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
                                disabled={isLoading || showOtpField}
                            />
                            <button
                                type="button"
                                onClick={toggleRePasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                disabled={isLoading || showOtpField}
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
                        {showOtpField && (
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Nhập mã OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    className="text-blue-600 hover:underline mt-2 text-sm"
                                    disabled={isLoading}
                                >
                                    Gửi lại OTP
                                </button>
                            </div>
                        )}
                        <button
                            type="submit"
                            onClick={
                                showOtpField ? handleVerifyOtp : handleSignup
                            }
                            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm md:text-base"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? 'Đang xử lý...'
                                : showOtpField
                                  ? 'Xác Minh OTP'
                                  : 'Register'}
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
    )
}

export default Register
