import React, { useState } from 'react'

function OtpVerification({ onConfirm, onResendOtp }) {
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])

    const handleOtpChange = (index, value) => {
        const newOtpDigits = [...otpDigits]
        newOtpDigits[index] = value
        setOtpDigits(newOtpDigits)

        if (value && index < 5) {
            const nextInput = document.getElementsByTagName('input')[index + 1]
            if (nextInput) nextInput.focus()
        }
    }

    const handleKeyDown = (index, e) => {
        // Xử lý Backspace
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            const prevInput = document.getElementsByTagName('input')[index - 1]
            if (prevInput) {
                prevInput.focus()
                const newOtpDigits = [...otpDigits]
                newOtpDigits[index - 1] = ''
                setOtpDigits(newOtpDigits)
            }
        }
    }

    const handleVerifyOtp = () => {
        const otpString = otpDigits.join('')

        if (otpString.length === 6) {
            onConfirm(otpString)
        } else {
            alert('Vui lòng nhập đủ 6 chữ số OTP!')
        }
    }

    return (
        <div>
            <p className="text-xl text-gray-700 mb-6 text-center">
                XÁC MINH MÃ OTP
            </p>
            <p className="text-gray-500 mb-6 text-center text-sm md:text-base">
                Vui lòng nhập mã OTP 6 số được gửi đến email .
            </p>
            <div className="flex justify-center gap-3 mb-6">
                {otpDigits.map((digit, index) => (
                    <input
                        key={index}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        maxLength={1}
                        className="w-14 h-14 text-center border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-2xl font-semibold text-gray-700 bg-gray-50 placeholder-gray-400"
                    />
                ))}
            </div>
            <span className="text-gray-600 mb-4 text-sm md:text-base">
                Bạn chưa nhận được OTP ?{' '}
                <button
                    type="button"
                    onClick={onResendOtp}
                    className="text-blue-600 hover:underline mb-4"
                >
                    Gửi lại OTP
                </button>
            </span>
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-lg font-medium shadow-md"
                onClick={handleVerifyOtp}
            >
                Xác Minh OTP
            </button>
        </div>
    )
}

export default OtpVerification
