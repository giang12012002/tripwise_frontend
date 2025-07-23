import React from 'react'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'

function Index() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />
            <main className="flex-1">
                <div className="max-w-5xl mx-auto p-6 space-y-12">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-800">
                            Hợp tác cùng chúng tôi
                        </h1>
                        <p className="mt-4 text-gray-600 text-lg">
                            Kết nối tour của bạn đến hàng nghìn khách du lịch
                            mỗi ngày.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white shadow-lg rounded-xl p-6 border">
                            <h3 className="text-xl font-semibold text-indigo-600">
                                Tăng doanh thu
                            </h3>
                            <p className="mt-2 text-gray-600">
                                Nền tảng AI của chúng tôi giúp đưa tour của bạn
                                đến đúng đối tượng khách hàng.
                            </p>
                        </div>
                        <div className="bg-white shadow-lg rounded-xl p-6 border">
                            <h3 className="text-xl font-semibold text-indigo-600">
                                Tự động hóa quy trình
                            </h3>
                            <p className="mt-2 text-gray-600">
                                Quản lý đặt tour, thanh toán và lịch trình một
                                cách thông minh, tiện lợi.
                            </p>
                        </div>
                        <div className="bg-white shadow-lg rounded-xl p-6 border">
                            <h3 className="text-xl font-semibold text-indigo-600">
                                Hỗ trợ 24/7
                            </h3>
                            <p className="mt-2 text-gray-600">
                                Đội ngũ hỗ trợ sẵn sàng đồng hành cùng bạn trong
                                mọi giai đoạn hợp tác.
                            </p>
                        </div>
                    </div>

                    <div className="text-center">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                            Sẵn sàng trở thành đối tác?
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Đăng ký ngay để bắt đầu kết nối với cộng đồng du
                            lịch của chúng tôi.
                        </p>
                        <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition">
                            Đăng ký làm đối tác
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default Index
