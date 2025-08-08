import React from 'react'
import { Link } from 'react-router-dom'

function Index() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-indigo-600">404</h1>
                <h2 className="mt-4 text-2xl font-semibold text-gray-800">
                    Trang không tồn tại
                </h2>
                <p className="mt-2 text-gray-600">
                    Có thể bạn đã nhập sai địa chỉ hoặc trang này đã bị xóa.
                </p>
                <Link
                    to="/"
                    className="mt-6 inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-700 transition"
                >
                    Quay lại Trang chủ
                </Link>
            </div>
        </div>
    )
}

export default Index
