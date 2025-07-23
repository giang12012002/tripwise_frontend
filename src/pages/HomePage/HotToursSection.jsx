import TourCard from './TourCard'
import story1Image from '@/assets/images/story1.jpg'
import story2Image from '@/assets/images/story2.jpg'
import story3Image from '@/assets/images/story3.jpg'
// Tours
const tours = [
    {
        id: 1,
        name: 'Hà Nội City Tour 3N2Đ',
        price: '2,500,000 VND',
        image: story1Image,
        address: 'Hà Nội, Việt Nam'
    },
    {
        id: 2,
        name: 'Hạ Long Bay 2N1Đ',
        price: '3,000,000 VND',
        image: story2Image,
        address: 'Quảng Ninh, Việt Nam'
    },
    {
        id: 3,
        name: 'Phú Quốc Island 4N3Đ',
        price: '4,500,000 VND',
        image: story3Image,
        address: 'Kiên Giang, Việt Nam'
    }
]

function HotToursSection() {
    return (
        <section className="py-12 max-w-7xl w-full mx-auto">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-center mb-8">
                    TOUR HOT ƯU ĐÃI
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {tours.map((tour) => (
                        <TourCard key={tour.id} tour={tour} />
                    ))}
                </div>
                <div className="text-center mt-6">
                    <a href="#" className="text-blue-600 font-semibold">
                        Xem tất cả
                    </a>
                </div>
            </div>
        </section>
    )
}

export default HotToursSection
