import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authAPI } from '@/apis'
import { useAuth } from '@/AuthContext'
import { jwtDecode } from 'jwt-decode'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import beachSunset from '@/assets/images/background.png'

function OtpVerification() {
    const navigate = useNavigate()
    const location = useLocation()
    const { login } = useAuth()
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '', ''])
    const [isLoading, setIsLoading] = useState(false)
    const inputRefs = useRef([])
    const { email, username, password, confirmPassword, signupRequestId } =
        location.state || {}

    useEffect(() => {
        if (
            !email ||
            !username ||
            !password ||
            !confirmPassword ||
            !signupRequestId
        ) {
            toast.error('Dữ liệu đăng ký không hợp lệ. Vui lòng thử lại.')
            navigate('/register')
        }
        // Focus the first input on mount
        inputRefs.current[0]?.focus()
    }, [email, username, password, confirmPassword, signupRequestId, navigate])

    const handleOtpChange = (index, value) => {
        if (isLoading) return
        // Allow only single digits
        if (value.length > 1 || !/^\d*$/.test(value)) return
        const newOtpDigits = [...otpDigits]
        newOtpDigits[index] = value
        setOtpDigits(newOtpDigits)

        // Move to next input if digit is entered
        if (value && index < 5) {
            inputRefs.current[index + 1].focus()
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            inputRefs.current[index - 1].focus()
        }
    }

    const handlePaste = (e) => {
        if (isLoading) return
        const pastedData = e.clipboardData.getData('text').trim()
        if (/^\d{6}$/.test(pastedData)) {
            const newOtpDigits = pastedData.split('')
            setOtpDigits(newOtpDigits)
            inputRefs.current[5].focus()
        }
    }

    const handleVerifyOtp = async () => {
        const otp = otpDigits.join('')
        if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
            toast.error('Vui lòng nhập mã OTP 6 số!')
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

                    const decodedToken = jwtDecode(accessToken)
                    const extractedUserId = decodedToken.sub
                    const extractedUsername = decodedToken.name
                    login(extractedUsername, extractedUserId)
                    navigate('/')
                }
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
            if (response.status === 200 || response.status === 201) {
                if (response.data.invalidFields?.length > 0) {
                    toast.error(
                        'Không thể gửi lại OTP do email hoặc username đã tồn tại.'
                    )
                    navigate('/register')
                } else {
                    toast.success('Mã OTP mới đã được gửi đến email của bạn!')
                    setOtpDigits(['', '', '', '', '', '']) // Reset OTP inputs
                }
            } else {
                toast.error(response.data.message || 'Gửi lại OTP thất bại.')
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || 'Gửi lại OTP thất bại.'
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow min-h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-white-50">
                <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 md:p-6 bg-white">
                    <div className="w-full max-w-md md:max-w-lg border border-gray-300 rounded-lg p-6 shadow-md">
                        <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                            TRIPWISE
                        </h1>
                        <p className="text-lg md:text-xl mb-6">
                            XÁC MINH MÃ OTP
                        </p>
                        <p className="text-gray-600 mb-4 text-sm md:text-base">
                            Vui lòng nhập mã OTP 6 số được gửi đến email {email}
                            .
                        </p>
                        <div className="flex justify-between mb-4">
                            {otpDigits.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    value={digit}
                                    onChange={(e) =>
                                        handleOtpChange(index, e.target.value)
                                    }
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={index === 0 ? handlePaste : null}
                                    maxLength={1}
                                    className="w-12 h-12 text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium"
                                    disabled={isLoading}
                                    ref={(el) =>
                                        (inputRefs.current[index] = el)
                                    }
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={handleResendOtp}
                            className="text-blue-600 hover:underline mb-4 text-sm"
                            disabled={isLoading}
                        >
                            Gửi lại OTP
                        </button>
                        <button
                            type="submit"
                            onClick={handleVerifyOtp}
                            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm md:text-base"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang xử lý...' : 'Xác Minh OTP'}
                        </button>
                        <p className="text-center text-gray-600 mt-4 text-sm md:text-base">
                            Quay lại{' '}
                            <Link
                                to="/register"
                                className="text-blue-600 hover:underline"
                            >
                                Đăng Ký
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

export default OtpVerification
