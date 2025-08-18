import React from 'react'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'

function sendMail() {
    const to = 'hello.tripwise.vn@gmail.com'
    const subject = encodeURIComponent('Chào bạn')
    const body = encodeURIComponent('Tôi muốn liên hệ với bạn qua email.')
    return `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${to}&subject=${subject}&body=${body}`
}

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

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-gradient-to-br from-indigo-100 to-white shadow-xl rounded-2xl p-6 w-full max-w-sm mx-auto text-center border border-indigo-200">
                                <div className="flex flex-col items-center">
                                    <div className="w-24 h-24 mb-4">
                                        <img
                                            src="/gmail-logo.svg"
                                            alt="Gmail"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <h3 className="text-2xl font-bold text-indigo-700 mb-1">
                                        Liên hệ qua Gmail
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        hello.tripwise.vn@gmail.com
                                    </p>
                                    <a
                                        href={sendMail()}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-full text-sm hover:bg-indigo-700 transition"
                                    >
                                        Gửi Email
                                    </a>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-blue-100 to-white shadow-xl rounded-2xl p-6 w-full max-w-sm mx-auto text-center border border-blue-200">
                                <div className="flex flex-col items-center">
                                    <div className="w-24 h-24 mb-4">
                                        <img
                                            src="/zalo-logo.svg"
                                            alt="Zalo"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <h3 className="text-2xl font-bold text-blue-700 mb-1">
                                        Liên hệ qua Zalo
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        0965619777
                                    </p>
                                    <a
                                        href="https://zalo.me/0965619777"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition"
                                    >
                                        Liên hệ Zalo
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default Index
