import { useState } from 'react'

function TourCard({ tour }) {
    const [isLiked, setIsLiked] = useState(false)

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
                src={tour.image}
                alt={tour.name}
                className="w-full h-40 object-cover"
            />
            <div className="p-4">
                <p className="text-lg font-semibold text-orange-500">
                    {tour.price}
                </p>
                <div className="flex items-center my-2">
                    <span className="text-yellow-500">★★★★★</span>
                    <span className="ml-2 text-gray-600">4.6</span>
                </div>
                <h3 className="text-lg font-bold">{tour.name}</h3>
                <p className="text-gray-600">{tour.address}</p>
                <div className="flex justify-between mt-4">
                    <button
                        className={`flex items-center ${isLiked ? 'text-red-500' : 'text-grey'}`}
                        onClick={() => setIsLiked(!isLiked)}
                    >
                        <svg
                            className="w-4 h-4 mr-1"
                            fill={isLiked ? 'currentColor' : 'none'}
                            stroke={isLiked ? 'none' : 'currentColor'}
                            strokeWidth="2"
                            viewBox="0 0 20 20"
                        >
                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                        </svg>
                        Yêu thích
                    </button>
                    <a href="#" className="text-blue-600 font-semibold">
                        Xem chi tiết
                    </a>
                </div>
            </div>
        </div>
    )
}

export default TourCard
