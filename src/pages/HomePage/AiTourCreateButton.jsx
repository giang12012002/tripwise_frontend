import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/AuthContext'
import { toast } from 'react-toastify'
import HomeImage from '@/assets/images/Home1.jpeg'

function AiTourCreateButton() {
    const { isLoggedIn } = useAuth()
    const navigate = useNavigate()

    // Handle create tour button click
    const handleCreateTour = () => {
        if (!isLoggedIn) {
            toast.error('Vui lòng đăng nhập để tạo tour!')
            return
        }
        navigate('/CreateItinerary')
    }

    return (
        <div className="min-h-screen flex flex-col items-center">
            <section
                className="relative bg-cover max-w-7xl bg-center h-96 w-full"
                style={{ backgroundImage: `url(${HomeImage})` }}
            >
                <div className="absolute inset-0  opacity-50"></div>
            </section>
            <div className="p-7xl md:px-10 w-full py-10 bg-white bg-opacity-90 rounded-lg mx-6 my-10 md:max-w-3xl text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-blue-800 mb-4">
                    Tạo tour cá nhân hóa bằng AI!
                </h1>
                <p className="text-gray-700 mb-6">
                    Khám phá di sản Việt theo cách của bạn.
                </p>
                <div className="flex justify-center">
                    <button
                        onClick={handleCreateTour}
                        className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors"
                    >
                        Tạo tour ngay
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AiTourCreateButton
