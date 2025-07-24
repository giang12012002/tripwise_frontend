import { Link, useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import beachSunset from '@/assets/images/background.png'
import { authAPI } from '@/apis'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'

import EmailVerification from './EmailVerification'
import OtpVerification from './OtpVerification'
import ResetPassword from './ResetPassword'

import { toast } from 'react-toastify'

function ForgotPassword() {
    const navigate = useNavigate()
    const [page, setPage] = useState('email')
    const [email, setEmail] = useState('')

    const handleVerifyEmail = async (email) => {
        try {
            const res = await authAPI.forgotPassword({ email })
            if (res.status === 200) {
                setPage('otp')
                setEmail(email)
                toast.success(res.data.message || 'Gửi OTP thành công')
            } else {
                toast.error(res.data.message || 'Không thể gửi OTP')
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleVerifyOtp = async (otpString) => {
        try {
            const res = await authAPI.verifyForgotOtp({
                email,
                enteredOtp: otpString
            })
            if (res.status === 200) {
                setPage('reset')
                toast.success(res.data.message || 'Otp hợp lệ')
            } else {
                toast.error(res.data.message || 'Otp không hợp lệ')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleResetPassword = async (newPassword) => {
        try {
            const res = await authAPI.resetPassword({
                email,
                newPassword
            })
            if (res.status === 200) {
                setPage('email')
                setEmail('')
                navigate('/signin')
                toast.success(res.data.message || 'Otp hợp lệ')
            } else {
                toast.error(res.data.message || 'Otp không hợp lệ')
                console.log('res', res)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow min-h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-white-50">
                <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 md:p-6 bg-white">
                    <div className="w-full max-w-md md:max-w-lg">
                        <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                            TRIPWISE
                        </h1>
                        <p className="text-lg md:text-xl mb-6">
                            ĐI KHẮP VIỆT NAM – MỖI CHUYẾN ĐI, MỘT PHẦN CỦA BẠN.
                        </p>
                        {page === 'email' && (
                            <EmailVerification onConfirm={handleVerifyEmail} />
                        )}
                        {page === 'otp' && (
                            <OtpVerification onConfirm={handleVerifyOtp} />
                        )}
                        {page === 'reset' && (
                            <ResetPassword onConfirm={handleResetPassword} />
                        )}
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

export default ForgotPassword
