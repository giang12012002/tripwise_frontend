import React from 'react'
import { Link } from 'react-router-dom' // Import Link for navigation
import hanoiImage from '@/assets/images/Home1.jpeg'
import hoianImage from '@/assets/images/hoi_an.jpg'
import phuyenImage from '@/assets/images/phuyen.jpg'
import AboutImage from '@/assets/images/AboutImage.jpg'

function AboutUsSection() {
    return (
        <section
            className="max-w-7xl mx-auto flex flex-col justify-center py-24 text-white bg-center bg-cover min-h-[50vh]"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${AboutImage})`
            }}
        >
            <div className="max-w-6xl mx-auto">
                <h1 className="mb-6 text-5xl md:text-7xl font-extrabold tracking-tight drop-shadow-xl">
                    VỀ CHÚNG TÔI
                </h1>

                <p className="max-w-xl mb-8 text-base md:text-lg">
                    TripWise – Website du lịch thông minh ứng dụng AI để giúp
                    bạn có những hành trình du lịch cá nhân hóa, tiện lợi và phù
                    hợp nhất...
                </p>
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <Link
                        to="/about"
                        className="px-5 py-2 font-bold text-gray-800 no-underline bg-white rounded-md mb-4 md:mb-0"
                    >
                        Xem thêm
                    </Link>
                    <div className="flex flex-wrap justify-center gap-5 ml-0 md:ml-8">
                        <div className="text-center">
                            <img
                                src={hanoiImage}
                                alt="Hà Nội"
                                className="object-cover w-[100px] h-[67px] md:w-[150px] md:h-[100px] rounded-xl"
                            />
                            <p>Hà Nội</p>
                        </div>
                        <div className="text-center">
                            <img
                                src={hoianImage}
                                alt="Hội An"
                                className="object-cover w-[100px] h-[67px] md:w-[150px] md:h-[100px] rounded-xl"
                            />
                            <p>Hội An</p>
                        </div>
                        <div className="text-center">
                            <img
                                src={phuyenImage}
                                alt="Phú Yên"
                                className="object-cover w-[100px] h-[67px] md:w-[150px] md:h-[100px] rounded-xl"
                            />
                            <p>Phú Yên</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutUsSection
