import React from 'react'
import { Users, Clock, Star } from 'lucide-react'

const WhyChooseUsSection = () => {
    return (
        <section className="bg-gray-50 py-9 max-w-7xl w-full mx-auto">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
                    TẠI SAO BẠN NÊN CHỌN TRIPWISE?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            Icon: Users,
                            title: 'Cá Nhân Hóa 100%',
                            description:
                                'Tùy chỉnh hành trình theo sở thích của bạn'
                        },
                        {
                            Icon: Clock,
                            title: 'Tối Ưu Thời Gian',
                            description:
                                'AI giúp bạn tạo hành trình nhanh chóng'
                        },
                        {
                            Icon: Star,
                            title: 'An Toàn & Uy Tín',
                            description: 'Đảm bảo chất lượng dịch vụ tốt nhất'
                        }
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="text-center bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                        >
                            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full text-white mx-auto mb-3">
                                <item.Icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                {item.title}
                            </h3>
                            <p className="text-gray-600 text-base">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default WhyChooseUsSection
