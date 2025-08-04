import React, { useState } from 'react'

const TourFilter = ({
    priceFilter,
    setPriceFilter,
    cityFilter,
    setCityFilter,
    themeFilter,
    setThemeFilter
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
    const allThemes = [
        'Biển',
        'Núi',
        'Thành phố',
        'Văn hóa',
        'Sinh thái',
        'Mạo hiểm',
        'Lịch sử',
        'Tự nhiên',
        'Ẩm thực',
        'Giải trí'
    ]
    const [showAllCities, setShowAllCities] = useState(false)
    const [showAllThemes, setShowAllThemes] = useState(false)
    const [selectedCity, setSelectedCity] = useState(cityFilter || '')
    const [selectedTheme, setSelectedTheme] = useState(themeFilter || '')

    const visibleCities = showAllCities ? allCities : allCities.slice(0, 6)
    const visibleThemes = showAllThemes ? allThemes : allThemes.slice(0, 6)

    const handleCityClick = (city) => {
        const newSelectedCity = selectedCity === city ? '' : city
        setSelectedCity(newSelectedCity)
        setCityFilter(newSelectedCity)
    }

    const handleThemeClick = (theme) => {
        const newSelectedTheme = selectedTheme === theme ? '' : theme
        setSelectedTheme(newSelectedTheme)
        setThemeFilter(newSelectedTheme)
    }

    return (
        <aside className="w-full text-left">
            {' '}
            {/* Đảm bảo căn trái toàn bộ aside */}
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Lọc Tour
            </h3>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá
                </label>
                <select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="w-full p-2 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">Tất cả</option>
                    <option value="low">Dưới 5 triệu</option>
                    <option value="medium">5 triệu - 10 triệu</option>
                    <option value="high">Trên 10 triệu</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thành phố
                </label>
                <div className="space-y-1">
                    <div
                        className={`cursor-pointer hover:bg-gray-100 ${selectedCity === '' ? 'bg-blue-100' : ''}`}
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
                            className={`cursor-pointer hover:bg-gray-100 ${selectedCity === city ? 'bg-blue-100' : ''}`}
                            onClick={() => handleCityClick(city)}
                        >
                            <span className="text-sm text-gray-800 px-2 py-1 block">
                                {city}
                            </span>
                        </div>
                    ))}
                    {!showAllCities && (
                        <div className="text-left pl-2">
                            {' '}
                            {/* Căn trái và thêm padding */}
                            <button
                                onClick={() => setShowAllCities(true)}
                                className="text-blue-500 text-sm font-normal underline hover:text-blue-700 focus:outline-none flex items-center justify-start"
                            >
                                Xem thêm
                                <svg
                                    className="w-4 h-4 ml-1"
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
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chủ đề
                </label>
                <div className="space-y-1">
                    <div
                        className={`cursor-pointer hover:bg-gray-100 ${selectedTheme === '' ? 'bg-blue-100' : ''}`}
                        onClick={() => {
                            setSelectedTheme('')
                            setThemeFilter('')
                        }}
                    >
                        <span className="text-sm text-gray-800 px-2 py-1 block">
                            Tất cả
                        </span>
                    </div>
                    {visibleThemes.map((theme) => (
                        <div
                            key={theme}
                            className={`cursor-pointer hover:bg-gray-100 ${selectedTheme === theme ? 'bg-blue-100' : ''}`}
                            onClick={() => handleThemeClick(theme)}
                        >
                            <span className="text-sm text-gray-800 px-2 py-1 block">
                                {theme}
                            </span>
                        </div>
                    ))}
                    {!showAllThemes && (
                        <div className="text-left pl-2">
                            {' '}
                            {/* Căn trái và thêm padding */}
                            <button
                                onClick={() => setShowAllThemes(true)}
                                className="text-blue-500 text-sm font-normal underline hover:text-blue-700 focus:outline-none flex items-center justify-start"
                            >
                                Xem thêm
                                <svg
                                    className="w-4 h-4 ml-1"
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
        </aside>
    )
}

export default TourFilter
