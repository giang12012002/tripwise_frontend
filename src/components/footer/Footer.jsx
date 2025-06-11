import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-blue-700 text-white py-6">
            <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-start text-sm">
                {/* Về TripWise Section */}
                <div className="mb-6 md:mb-0">
                    <h3 className="font-bold text-2xl ml-6">Về TripWise</h3>
                    <p className="ml-6 text-xs">
                        Tripwise là nền tảng trực tuyến <br />
                        tiên phong trong việc sử dụng trí tuệ <br />
                        nhân tạo (AI) để tạo ra lịch trình du lịch cá nhân hóa.
                    </p>
                </div>

                {/* Liên hệ Section */}
                <div className="mb-6 md:mb-0 text-left">
                    <h3 className="font-bold text-2xl ml-6">Liên Hệ</h3>
                    <p className="ml-6 text-xs">
                        <i className="fas fa-map-marker-alt"></i> Hòa Lạc, Hà
                        Nội
                    </p>
                    <p className="ml-6 text-xs">
                        <i className="fas fa-phone"></i> +84 0339.805.402
                    </p>
                    <p className="ml-6 text-xs">
                        <i className="fas fa-envelope"></i>{' '}
                        <a
                            href="mailto:Tripwise.tour@gmail.com"
                            className="underline"
                        >
                            Tripwise.tour@gmail.com
                        </a>
                    </p>
                </div>

                {/* Mạng xã hội Section */}
                <div className="mb-6 md:mb-0 text-left">
                    <h3 className="font-bold text-2xl ml-6">Mạng Xã Hội</h3>
                    <div className="ml-6 flex flex-col space-y-2">
                        <p>
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                            >
                                <i className="fab fa-facebook-f text-lg"></i>
                            </a>
                        </p>
                        <p>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Twitter"
                            >
                                <i className="fab fa-twitter text-lg"></i>
                            </a>
                        </p>
                        <p>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                            >
                                <i className="fab fa-instagram text-lg"></i>
                            </a>
                        </p>
                    </div>
                </div>

                {/* Email Subscription Section */}
                <div className="text-left">
                    <h3 className="font-bold text-2xl ml-6">Email</h3>
                    <div className="ml-6 flex space-x-4">
                        <input
                            type="email"
                            placeholder="Email"
                            className="p-2 rounded-lg border border-gray-300 text-black text-sm w-3/5"
                        />
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm w-2/5">
                            Đăng Ký
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
