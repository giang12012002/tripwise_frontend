import React, { useState } from 'react'
import { Link } from 'react-router-dom'
function ResetPassword({ onConfirm }) {
    const [newPassword, setNewPassword] = useState('')
    return (
        <div>
            <div>
                <div className="mb-4">
                    <input
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm md:text-base"
                    onClick={() => onConfirm(newPassword)}
                >
                    Gửi yêu cầu
                </button>
            </div>
            <p className="text-center text-gray-600 mt-4 text-sm md:text-base">
                Bạn Đã Có Tài Khoản? Đăng Nhập{' '}
                <Link to="/signin" className="text-blue-600 hover:underline">
                    Tại Đây
                </Link>
            </p>
        </div>
    )
}

export default ResetPassword
