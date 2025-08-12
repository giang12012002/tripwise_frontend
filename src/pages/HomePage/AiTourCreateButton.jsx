import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/AuthContext'
import { toast } from 'react-toastify'
import { Sparkles } from 'lucide-react'
import HomeImage from '@/assets/images/1.png'

function AiTourCreateButton() {
    const { isLoggedIn } = useAuth()
    const navigate = useNavigate()

    // Handle create tour button click
    const handleCreateTour = () => {
        if (!isLoggedIn) {
            toast.error('Vui lòng đăng nhập để tạo tour!')
            return
        }
        navigate('/user/CreateItinerary')
    }

    return (
        <div className="relative flex flex-col items-center w-full">
            <section
                className="relative bg-cover bg-center h-150 w-full max-w"
                style={{ backgroundImage: `url(${HomeImage})` }}
            >
                <div className="absolute inset-0  opacity-30"></div>{' '}
                {/* Lớp phủ tối để tăng độ tương phản */}
                <div className="absolute top-11/10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center p-6 md:p-10 w-full max-w-3xl bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl">
                    <div className="flex justify-center mb-4 animate-fade-in">
                        <Sparkles className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-4 tracking-tight animate-fade-in-up">
                        Tạo Hành Trình Cá Nhân Hóa Với AI
                    </h1>
                    <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
                        Khám phá vẻ đẹp di sản Việt Nam theo phong cách riêng
                        của bạn với sự hỗ trợ thông minh từ TripWise AI.
                    </p>
                    <div className="flex justify-center">
                        <button
                            onClick={handleCreateTour}
                            className="group relative bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-3 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-blue-900 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg animate-fade-in-up animation-delay-400"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Tạo Tour Ngay
                            </span>
                            <span className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-20 rounded-full transition-opacity duration-300"></span>
                        </button>
                    </div>
                </div>
            </section>
            {/* Tailwind CSS animation keyframes */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fadeIn 0.8s ease-out forwards;
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.8s ease-out forwards;
                }
                .animation-delay-200 {
                    animation-delay: 0.2s;
                }
                .animation-delay-400 {
                    animation-delay: 0.4s;
                }
            `}</style>
        </div>
    )
}

export default AiTourCreateButton
