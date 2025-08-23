import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { authAPI } from '@/apis'
import { useAuth } from '@/AuthContext'
import { jwtDecode } from 'jwt-decode'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import beachSunset from '@/assets/images/background.png'
import logoImage from '@/assets/images/NEWS5.png'
import { IoFastFood } from 'react-icons/io5'

function OtpVerification() {
    const navigate = useNavigate()
    const location = useLocation()
    const { login } = useAuth()
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
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
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Dữ liệu đăng ký không hợp lệ. Vui lòng thử lại.',
                showConfirmButton: false,
                timer: 500
            })
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

        // Move to next input if digit is entered, with slight delay
        if (value && index < 5) {
            setTimeout(() => {
                inputRefs.current[index + 1].focus()
            }, 0)
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            inputRefs.current[index - 1].focus()
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1].focus()
        } else if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1].focus()
        } else if (e.key === 'Delete') {
            const newOtpDigits = [...otpDigits]
            newOtpDigits[index] = ''
            setOtpDigits(newOtpDigits)
        }
    }

    const handlePaste = (e) => {
        if (isLoading) return
        const pastedData = e.clipboardData.getData('text').trim()
        if (/^\d{6}$/.test(pastedData)) {
            const newOtpDigits = pastedData.split('')
            setOtpDigits(newOtpDigits)
            setTimeout(() => {
                inputRefs.current[5].focus()
            }, 0)
        }
    }

    const handleFocus = (index) => {
        inputRefs.current[index].select()
    }

    const handleVerifyOtp = async () => {
        const otp = otpDigits.join('')
        if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Vui lòng nhập mã OTP 6 số!',
                confirmButtonColor: '#2563eb'
            })
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
            // if (response.status === 200 || response.status === 201) {
            if (response.data.statusCode === 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: response.data.message || 'Đăng ký thành công!',
                    showConfirmButton: false,
                    timer: 500
                })
                const { accessToken, refreshToken, userId } = response.data
                navigate('/signin')
                // if (accessToken && refreshToken) {
                //     localStorage.setItem('accessToken', accessToken)
                //     localStorage.setItem('refreshToken', refreshToken)
                //     localStorage.setItem(
                //         'deviceId',
                //         localStorage.getItem('deviceId')
                //     )
                //     if (userId) {
                //         localStorage.setItem('userId', userId)
                //     }

                //     const decodedToken = jwtDecode(accessToken)
                //     const extractedUserId = decodedToken.sub
                //     const extractedUsername = decodedToken.name
                //     login(extractedUsername, extractedUserId)

                // }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: response.data.message || 'Xác minh OTP thất bại.',
                    showConfirmButton: false,
                    timer: 500
                })
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: error.response?.data?.message || 'Xác minh OTP thất bại.',
                showConfirmButton: false,
                timer: 500
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendOtp = async () => {
        if (!signupRequestId) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể gửi lại OTP. Vui lòng thử đăng ký lại.',
                showConfirmButton: false,
                timer: 500
            })
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
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: 'Không thể gửi lại OTP do email hoặc username đã tồn tại.',
                        showConfirmButton: false,
                        timer: 500
                    })
                    navigate('/register')
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công',
                        text: 'Mã OTP mới đã được gửi đến email của bạn!',
                        showConfirmButton: false,
                        timer: 500
                    })
                    setOtpDigits(['', '', '', '', '', '']) // Reset OTP inputs
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: response.data.message || 'Gửi lại OTP thất bại.',
                    showConfirmButton: false,
                    timer: 500
                })
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: error.response?.data?.message || 'Gửi lại OTP thất bại.',
                showConfirmButton: false,
                timer: 500
            })
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
                                    onFocus={() => handleFocus(index)}
                                    maxLength={1}
                                    className="w-12 h-12 text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium"
                                    disabled={isLoading}
                                    ref={(el) =>
                                        (inputRefs.current[index] = el)
                                    }
                                />
                            ))}
                        </div>
                        {/*<button*/}
                        {/*    type="button"*/}
                        {/*    onClick={handleResendOtp}*/}
                        {/*    className="text-blue-600 hover:underline mb-4 text-sm"*/}
                        {/*    disabled={isLoading}*/}
                        {/*>*/}
                        {/*    Gửi lại OTP*/}
                        {/*</button>*/}
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
