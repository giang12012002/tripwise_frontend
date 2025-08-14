import React, { useState } from 'react'

const TourFilter = ({
    priceFilter,
    setPriceFilter,
    cityFilter,
    setCityFilter
}) => {
    const allCities = [
        'Phú Quốc',
        'Đà Nẵng',
        'Nha Trang',
        'Miền Tây',
        'Hạ Long',
        'Sapa',
        'Hà Nội',
        'TP. Hồ Chí Minh',
        'Hội An',
        'Huế',
        'Đà Lạt'
    ]
    const [showAllCities, setShowAllCities] = useState(false)
    const [selectedCity, setSelectedCity] = useState(cityFilter || '')

    const visibleCities = showAllCities ? allCities : allCities.slice(0, 6)

    const handleCityClick = (city) => {
        const newSelectedCity = selectedCity === city ? '' : city
        setSelectedCity(newSelectedCity)
        setCityFilter(newSelectedCity)
    }

    return (
        <aside className="w-full max-h-fit text-left bg-gray-50 shadow-md rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Lọc Tour
            </h3>
            <div className="divide-y divide-gray-200">
                <div className="pb-3">
                    <label className="block text-md font-medium text-gray-700 mb-1">
                        Giá
                    </label>
                    <select
                        value={priceFilter}
                        onChange={(e) => setPriceFilter(e.target.value)}
                        className="w-full p-2 text-sm rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition-all"
                    >
                        <option value="">Tất cả</option>
                        <option value="low">Dưới 5 triệu</option>
                        <option value="medium">5 triệu - 10 triệu</option>
                        <option value="high">Trên 10 triệu</option>
                    </select>
                </div>
                <div className="pt-3">
                    <label className="block text-md font-medium text-gray-700 mb-1">
                        Thành phố
                    </label>
                    <div className="space-y-1">
                        <div
                            className={`cursor-pointer hover:bg-blue-100 rounded-md transition-all ${selectedCity === '' ? 'bg-blue-100' : ''}`}
                            onClick={() => {
                                setSelectedCity('')
                                setCityFilter('')
                            }}
                        >
                            <span className="text-sm text-gray-800 px-2 py-1 block">
                                Tất cả
                            </span>
                        </div>
                        {visibleCities.map((city) => (
                            <div
                                key={city}
                                className={`cursor-pointer hover:bg-blue-100 rounded-md transition-all ${selectedCity === city ? 'bg-blue-100' : ''}`}
                                onClick={() => handleCityClick(city)}
                            >
                                <span className="text-sm text-gray-800 px-2 py-1 block">
                                    {city}
                                </span>
                            </div>
                        ))}
                        {!showAllCities && (
                            <div className="text-left pl-2 mt-2">
                                <button
                                    onClick={() => setShowAllCities(true)}
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium py-1 px-3 rounded-full hover:shadow-md transition-all flex items-center justify-start"
                                >
                                    Xem thêm
                                    <svg
                                        className="w-4 h-4 ml-1 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default TourFilter
