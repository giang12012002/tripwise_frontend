import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/AuthContext'

const Footer = () => {
    const navigate = useNavigate()
    const { isLoggedIn } = useAuth()

    const handleSubscribe = () => {
        console.log('Guest user navigating to /register') // Log để debug
        navigate('/register', { replace: false })
    }

    return (
        <footer className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Phần Thương hiệu */}
                    <div className="space-y-4 px-6">
                        <h2 className="text-3xl font-bold">TripWise</h2>
                        <p className="text-sm">
                            Khám phá Việt Nam cùng TripWise, đối tác đáng tin
                            cậy của bạn cho những trải nghiệm du lịch khó quên.
                            hành trình được TripWise AI thiết kế riêng và các
                            tour du lịch trọn gói trực tuyến.
                        </p>
                    </div>

                    {/* Liên kết Điều hướng */}
                    <div className="px-30">
                        <h3 className="text-lg font-semibold mb-4">
                            Liên Kết Nhanh
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="/about"
                                    className="hover:text-blue-200 transition-colors"
                                >
                                    Giới Thiệu
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/alltour"
                                    className="hover:text-blue-200 transition-colors"
                                >
                                    Khám Phá Tour
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/connect"
                                    className="hover:text-blue-200 transition-colors"
                                >
                                    Liên Hệ
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Thông tin Liên hệ */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Liên Hệ</h3>
                        <ul className="space-y-2">
                            <li>
                                Email:{' '}
                                <a
                                    href="mailto:giangldhe160270@fpt.edu.vn"
                                    className="hover:text-blue-200 transition-colors"
                                >
                                    hotro@tripwise.com
                                </a>
                            </li>
                            <li>
                                Điện thoại:{' '}
                                <a
                                    href="tel:+1234567890"
                                    className="hover:text-blue-200 transition-colors"
                                >
                                    +84 339 805 402
                                </a>
                            </li>
                            <li>Địa chỉ: Hòa Lạc, VN</li>
                        </ul>
                    </div>

                    {/* Đăng ký Bản tin */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">
                            Kết Nối Với Chúng Tôi
                        </h3>
                        <p className="text-sm mb-4">
                            Đăng ký nhận bản tin để nhận ưu đãi độc quyền và mẹo
                            du lịch!
                        </p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Nhập email của bạn"
                                className="p-2 rounded-l-md bg-blue-800 text-white placeholder-gray-300 border-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                                disabled={isLoggedIn}
                            />
                            <button
                                type="button"
                                onClick={handleSubscribe}
                                className={`p-2 rounded-r-md text-white transition-colors ${
                                    isLoggedIn
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-400 hover:bg-blue-300'
                                }`}
                                disabled={isLoggedIn}
                            >
                                {isLoggedIn ? 'Đã Đăng Nhập' : 'Đăng Ký'}
                            </button>
                        </div>
                        {/* Biểu tượng Mạng Xã Hội */}
                        <div className="flex space-x-4 mt-4">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-200 transition-colors"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                </svg>
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-200 transition-colors"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.379 4.482 13.944 13.944 0 01-10.141-5.135 4.916 4.916 0 001.523 6.557 4.902 4.902 0 01-2.229-.616v.062a4.917 4.917 0 003.946 4.827 4.902 4.902 0 01-2.224.084 4.918 4.918 0 004.586 3.414A9.867 9.867 0 010 21.543a13.978 13.978 0 007.548 2.212c9.057 0 14.01-7.507 14.01-14.01 0-.213-.005-.425-.014-.636A10.012 10.012 0 0024 4.557z" />
                                </svg>
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-200 transition-colors"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.326 3.608 1.301.975.975 1.24 2.242 1.301 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.326 2.633-1.301 3.608-.975.975-2.242 1.24-3.608 1.301-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.326-3.608-1.301-.975-.975-1.24-2.242-1.301-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.326-2.633 1.301-3.608.975-.975 2.242-1.24 3.608-1.301 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.627.073-3.043.447-4.184 1.588C1.727 2.8 1.353 4.216 1.28 5.843c-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.073 1.627.447 3.043 1.588 4.184 1.141 1.141 2.557 1.515 4.184 1.588 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.627-.073 3.043-.447 4.184-1.588 1.141-1.141 1.515-2.557 1.588-4.184.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.073-1.627-.447-3.043-1.588-4.184-1.141-1.141-2.557-1.515-4.184-1.588-1.28-.058-1.688-.072-4.947-.072zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Thanh Dưới */}
                <div className="mt-8 pt-8 border-t border-blue-400 text-center">
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} TripWise. Mọi quyền
                        được bảo lưu.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
