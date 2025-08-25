import React, { useEffect, useRef } from 'react'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import hanoiImage from '@/assets/images/Home1.jpeg'
import hoianImage from '@/assets/images/hoi_an.jpg'
import phuyenImage from '@/assets/images/phuyen.jpg'
import story1Image from '@/assets/images/story1.jpg'
import story2Image from '@/assets/images/story2.jpg'
import story3Image from '@/assets/images/story3.jpg'
import story4Image from '@/assets/images/story4.jpg'
import story5Image from '@/assets/images/story5.jpg'
import story6Image from '@/assets/images/story6.jpg'
import member1Image from '@/assets/images/GIANG.png'
import member2Image from '@/assets/images/Cuong.jpg'
import member3Image from '@/assets/images/TUNG.png'
import member4Image from '@/assets/images/VA.png'
import member5Image from '@/assets/images/BINH.png'
import commitmentImage from '@/assets/images/thap.png'
import AboutImage from '@/assets/images/AboutImage.jpg'

// Mock data for the page content
const mockData = {
    Header: {
        Text: 'TripWise – Website du lịch thông minh ứng dụng AI để giúp bạn có những hành trình du lịch cá nhân hóa, tiện lợi và phù hợp nhất.',
        ImageUrl1: hanoiImage,
        ImageUrl2: hoianImage,
        ImageUrl3: phuyenImage
    },
    Vision: 'Hướng tới trở thành nền tảng du lịch hàng đầu Việt Nam, mang lại trải nghiệm cá nhân hóa cho hàng triệu du khách, giúp họ khám phá đất nước theo cách riêng biệt và ý nghĩa. TripWise tập trung xây dựng cộng đồng du lịch thông minh, nơi mọi người tìm thấy nguồn cảm hứng, kết nối với những khoảnh khắc tuyệt vời và lan tỏa niềm đam mê văn hóa, con người cùng thiên nhiên Việt Nam.',
    Mission:
        'Nhiệm vụ của TripWise là khai thác trí tuệ nhân tạo để thiết kế  trình du lịch cá nhân hóa, hỗ trợ mọi người khám phá Việt Nam theo phong cách riêng. Chúng tôi cam kết cung cấp giải pháp du lịch tiện ích, chính xác và phù hợp, đồng thời thúc đẩy sự gắn kết và phát hiện giá trị văn hóa, thiên nhiên nổi bật của đất nước.',
    CoreValues: {
        Individual:
            'Mỗi cá nhân có sở thích du lịch riêng, và chúng tôi tôn vinh sự đa dạng đó. TripWise cam kết tạo ra trải nghiệm du lịch tùy chỉnh dành riêng cho từng người dùng.',
        Creative:
            'Sáng tạo thể hiện qua việc áp dụng AI và liên tục khám phá, giới thiệu địa điểm mới cùng trải nghiệm độc đáo cho người dùng.',
        Quality:
            'Chúng tôi luôn nỗ lực mang đến dịch vụ chất lượng cao, đảm bảo sự hài lòng từ lập kế hoạch đến kết thúc hành trình.',
        Integrity:
            'Minh bạch, trung thực và đạo đức là nền tảng để TripWise hoạt động. Chúng tôi ưu tiên lợi ích khách hàng, cung cấp thông tin chính xác và dịch vụ đáng tin cậy.'
    },
    BrandStories: [
        {
            Milestone: 'Khởi nguồn',
            Describe:
                'Hành trình của TripWise khởi nguồn từ niềm đam mê khám phá những cung đường mới lạ và văn hóa thiên nhiên phong phú Việt Nam. Đội ngũ sáng lập là những bạn trẻ yêu du lịch, nhưng thường gặp khó khăn trong việc lập kế hoạch chuyến đi phù hợp với sở thích cá nhân mà không tốn nhiều công sức.',
            ImageUrl: story1Image
        },
        {
            Milestone: 'Ý tưởng',
            Describe:
                'Những trải nghiệm lạc lối, bỏ lỡ địa điểm thú vị hay khó tìm thông tin đáng tin đã khơi dậy ý tưởng tạo giải pháp mới. Họ nhận ra AI có thể giải quyết vấn đề này, biến giấc mơ du lịch lý tưởng thành hiện thực.',
            ImageUrl: story2Image
        },
        {
            Milestone: 'Ra đời',
            Describe:
                'TripWise ra đời từ ý tưởng ấy - nền tảng sử dụng AI tiên tiến giúp tạo hành trình du lịch cá nhân hóa, khám phá Việt Nam theo cách riêng. Không còn kế hoạch cố định, TripWise mang đến trải nghiệm mới mẻ, nơi mỗi người là nhà thám hiểm của chính mình.',
            ImageUrl: story3Image
        },
        {
            Milestone: 'Phát triển',
            Describe:
                'Từ giai đoạn khởi đầu đầy thử thách, TripWise liên tục phát triển, tinh chỉnh công nghệ và dịch vụ để mang lại giá trị tốt nhất. Chúng tôi học hỏi từ phản hồi khách hàng, thử nghiệm chuyến đi và khắc phục sai sót để cải tiến sản phẩm.',
            ImageUrl: story4Image
        },
        {
            Milestone: 'Giá trị',
            Describe:
                'Câu chuyện TripWise là hành trình kiên trì, sáng tạo và đam mê. Từ ý tưởng nhỏ đến nền tảng du lịch hiện đại, mang giá trị thực cho cộng đồng. Chúng tôi tự hào là bạn đồng hành, giúp khách hàng trân trọng từng khoảnh khắc đáng nhớ.',
            ImageUrl: story5Image
        },
        {
            Milestone: 'Ý Nghĩa',
            Describe:
                'TripWise không chỉ thiết kế hành trình mà còn kể chuyện - về vùng đất mới, con người ấn tượng và quan trọng nhất, câu chuyện của bạn trong hành trình khám phá Việt Nam.',
            ImageUrl: story6Image
        }
    ],
    InfoTeamDTOs: [
        { FullName: 'Giang', ImageUrl: member1Image },
        { FullName: 'Cương', ImageUrl: member2Image },
        { FullName: 'Tùng', ImageUrl: member3Image },
        { FullName: 'Việt Anh', ImageUrl: member4Image },
        { FullName: 'Bình', ImageUrl: member5Image }
    ],
    OurCommitment: {
        Describe: [
            'Cá Nhân Hóa Tối Ưu: hành trình du lịch được tùy chỉnh theo sở thích, mang đến chuyến đi hoàn hảo và cá tính riêng.',
            'An Toàn Đáng Tin: Chọn đối tác uy tín, kiểm chứng thông tin điểm đến, di chuyển và lưu trú để khách hàng đảm bảo và an tâm.',
            'Giá Minh Bạch: Không phí ẩn, TripWise cung cấp giải pháp giá hợp lý, rõ ràng và công khai.',
            'Hỗ Trợ Liên Tục: Đội ngũ sẵn sàng hỗ trợ 24/7, giải đáp mọi vấn đề trong quá trình sử dụng.',
            'Chất Lượng Xuất Sắc: Cải tiến dịch vụ liên tục với công nghệ mới và phản hồi khách hàng để mang trải nghiệm tốt nhất.',
            'Bảo Mật Tuyệt Đối: Thông tin cá nhân được bảo vệ theo chuẩn quốc tế, không chia sẻ mà chưa có sự cho phép.'
        ],
        ImagesUrl: commitmentImage
    }
}

// Cuộn lên đầu trang khi component được mount

const AboutUs = () => {
    const headerRef = useRef(null)

    useEffect(() => {
        if (headerRef.current) {
            headerRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }
    }, [])
    return (
        <div className="flex flex-col min-h-screen scroll-smooth">
            <div ref={headerRef}>
                <Header />
            </div>
            <div className="container px-6 mx-auto grow">
                <section
                    className="relative mx-4 md:mx-12 flex flex-col justify-center py-28 text-white bg-center bg-cover min-h-[60vh] overflow-hidden transition-all duration-500"
                    style={{ backgroundImage: `url(${AboutImage})` }}
                >
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="relative z-10 max-w-7xl mx-auto px-6">
                        <h1 className="mb-6 text-5xl md:text-7xl font-extrabold text-center tracking-tight drop-shadow-xl">
                            VỀ CHÚNG TÔI
                        </h1>

                        <p className="max-w-2xl mx-auto text-lg md:text-xl leading-relaxed text-center">
                            {mockData.Header.Text}
                        </p>
                        <div className="mt-10 flex flex-col md:flex-row justify-center gap-6">
                            <div className="flex flex-wrap justify-center gap-6">
                                {[
                                    {
                                        img: mockData.Header.ImageUrl1,
                                        name: 'Hà Nội'
                                    },
                                    {
                                        img: mockData.Header.ImageUrl2,
                                        name: 'Hội An'
                                    },
                                    {
                                        img: mockData.Header.ImageUrl3,
                                        name: 'Phú Yên'
                                    }
                                ].map((city, index) => (
                                    <div
                                        key={index}
                                        className="text-center group"
                                    >
                                        <img
                                            src={city.img}
                                            alt={city.name}
                                            className="object-cover w-32 h-24 md:w-48 md:h-32 rounded-lg shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <p className="mt-2 text-sm font-medium text-white/90">
                                            {city.name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-4 md:mx-12 py-16 px-6 bg-gradient-to-b from-white to-gray-50 rounded-2xl">
                    <div className="flex flex-col md:flex-row justify-around gap-8">
                        <div className="w-full md:w-[48%] text-left bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-teal-100 text-teal-600">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    className="w-10 h-10"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                </svg>
                            </div>
                            <h2 className="mb-4 text-3xl font-bold text-teal-600 text-center">
                                TẦM NHÌN
                            </h2>
                            <p className="text-base leading-relaxed text-gray-700">
                                {mockData.Vision}
                            </p>
                        </div>
                        <div className="w-full md:w-[48%] text-left bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-teal-100 text-teal-600">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    className="w-10 h-10"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                    <path d="M8 13A5 5 0 1 1 8 3a5 5 0 0 1 0 10m0 1A6 6 0 1 0 8 2a6 6 0 0 0 0 12" />
                                    <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8" />
                                    <path d="M9.5 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                                </svg>
                            </div>
                            <h2 className="mb-4 text-3xl font-bold text-teal-600 text-center">
                                SỨ MỆNH
                            </h2>
                            <p className="text-base leading-relaxed text-gray-700">
                                {mockData.Mission}
                            </p>
                        </div>
                    </div>
                </section>

                <hr className="w-3/4 mx-auto my-8 border-t-2 border-teal-100" />

                <section className="mx-4 md:mx-12 py-12">
                    <div className="container mx-auto flex flex-col items-center">
                        <h2 className="inline-block px-6 py-3 mb-10 text-3xl font-bold text-teal-600 uppercase rounded-full bg-teal-50 text-center">
                            GIÁ TRỊ CỐT LÕI
                        </h2>
                        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                            {Object.entries(mockData.CoreValues).map(
                                ([key, value], index) => (
                                    <div
                                        key={index}
                                        className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                                    >
                                        <h4 className="inline-block px-4 py-2 mb-4 text-lg font-semibold text-teal-600 rounded-full bg-teal-100 text-center w-full">
                                            {key === 'Individual'
                                                ? 'Cá nhân hóa'
                                                : key === 'Creative'
                                                  ? 'Sáng tạo'
                                                  : key === 'Quality'
                                                    ? 'Chất lượng'
                                                    : 'Chính trực'}
                                        </h4>
                                        <p className="text-base text-gray-600">
                                            {value.trim()}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </section>

                <hr className="w-3/4 mx-auto my-8 border-t-2 border-teal-100" />

                {/*<section className="mx-4 md:mx-12 py-16 px-6 text-center bg-gradient-to-b from-white to-gray-50 rounded-2xl">*/}
                {/*    <h2 className="inline-block px-6 py-3 mb-12 text-3xl font-bold text-center text-teal-600 rounded-full bg-teal-50 mx-auto">*/}
                {/*        CÂU CHUYỆN THƯƠNG HIỆU*/}
                {/*    </h2>*/}
                {/*    <div className="relative max-w-6xl mx-auto">*/}
                {/*        {mockData.BrandStories.map((item, index) => (*/}
                {/*            <div*/}
                {/*                key={index}*/}
                {/*                className={`flex flex-col md:flex-row items-center gap-8 mb-12 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}*/}
                {/*            >*/}
                {/*                <div className="w-full md:w-1/6 text-center">*/}
                {/*                    <div className="w-12 h-12 mx-auto bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">*/}
                {/*                        {index + 1}*/}
                {/*                    </div>*/}
                {/*                    <p className="mt-2 text-lg font-semibold text-gray-700">*/}
                {/*                        {item.Milestone}*/}
                {/*                    </p>*/}
                {/*                </div>*/}
                {/*                <div className="w-full md:w-1/3">*/}
                {/*                    <img*/}
                {/*                        src={item.ImageUrl}*/}
                {/*                        alt=""*/}
                {/*                        className="w-full h-64 object-cover rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"*/}
                {/*                    />*/}
                {/*                </div>*/}
                {/*                <div className="w-full md:w-1/2 p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">*/}
                {/*                    <p className="text-base text-gray-700 text-left">*/}
                {/*                        {item.Describe}*/}
                {/*                    </p>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        ))}*/}
                {/*    </div>*/}
                {/*</section>*/}

                {/*<hr className="w-3/4 mx-auto my-8 border-t-2 border-teal-100" />*/}

                <section className="mx-4 md:mx-12 py-16 px-6 text-center bg-white rounded-2xl">
                    <h2 className="inline-block px-6 py-3 mb-12 text-3xl font-bold text-teal-600 rounded-full bg-teal-50">
                        ĐỘI NGŨ CỦA CHÚNG TÔI
                    </h2>
                    <div className="flex flex-wrap justify-center gap-8">
                        {mockData.InfoTeamDTOs.map((item, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center group"
                            >
                                <img
                                    src={item.ImageUrl}
                                    alt={item.FullName}
                                    className="mb-4 rounded-full w-24 h-24 md:w-32 md:h-32 object-cover shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300"
                                />
                                <p className="text-base font-semibold text-gray-800 group-hover:text-teal-600 transition-colors duration-300">
                                    {item.FullName}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <hr className="w-3/4 mx-auto my-8 border-t-2 border-teal-100" />

                <section className="mx-4 md:mx-12 py-16 px-6">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-2/3">
                            <h2 className="mb-6 text-3xl font-bold text-teal-600">
                                CAM KẾT CỦA CHÚNG TÔI
                            </h2>
                            <p className="mb-8 text-lg italic text-gray-600">
                                Tại TripWise, chúng tôi cam kết:
                            </p>
                            <div className="space-y-6">
                                {mockData.OurCommitment.Describe.map(
                                    (desc, i) => (
                                        <div
                                            key={i}
                                            className="flex items-start group"
                                        >
                                            <div className="flex items-center justify-center w-10 h-10 font-bold bg-teal-100 text-teal-600 rounded-full mr-4 flex-shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                                                {i + 1}
                                            </div>
                                            <p className="text-base text-gray-700">
                                                {desc}
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                        <div className="md:w-1/3 flex items-center">
                            <img
                                src={mockData.OurCommitment.ImagesUrl}
                                alt="Cam kết của chúng tôi"
                                className="w-full h-auto object-cover rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                            />
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    )
}

export default AboutUs
