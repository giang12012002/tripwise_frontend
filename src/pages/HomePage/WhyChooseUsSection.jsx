import React from 'react'

function WhyChooseUsSection() {
    return (
        <section className="bg-gray-50 py-12 max-w-7xl w-full mx-auto">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-center mb-8">
                    TẠI SAO BẠN NÊN CHỌN TRIPWISE?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full text-white mx-auto mb-3">
                            <span className="text-2xl">👥</span>
                        </div>
                        <h3 className="text-lg font-semibold">
                            Cá nhân hóa 100%
                        </h3>
                        <p>Tùy chỉnh tour theo sở thích của bạn</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full text-white mx-auto mb-3">
                            <span className="text-2xl">⏰</span>
                        </div>
                        <h3 className="text-lg font-semibold">
                            Tối ưu thời gian thiết kế
                        </h3>
                        <p>AI giúp bạn tạo tour nhanh chóng</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full text-white mx-auto mb-3">
                            <span className="text-2xl">⭐</span>
                        </div>
                        <h3 className="text-lg font-semibold">
                            An toàn, uy tín, chuyên nghiệp
                        </h3>
                        <p>Đảm bảo chất lượng dịch vụ tốt nhất</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default WhyChooseUsSection
