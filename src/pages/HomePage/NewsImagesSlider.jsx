import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import tourUserAPI from '@/apis/TourUserAPI.js'

function NewsImagesSlider() {
    const navigate = useNavigate()
    const [hotNews, setHotNews] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)

    // Fetch hot news from API
    useEffect(() => {
        const fetchHotNews = async () => {
            try {
                const response = await tourUserAPI.getAllHotNews()
                setHotNews(response.data)
                setLoading(false)
            } catch (error) {
                toast.error('Lỗi khi tải tin tức nổi bật')
                console.error(error)
                setLoading(false)
            }
        }
        fetchHotNews()
    }, [])

    // Handle automatic sliding every 6 seconds
    useEffect(() => {
        if (hotNews.length === 0) return

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex + 1 >= hotNews.length ? 0 : prevIndex + 1
            )
        }, 6000)

        return () => clearInterval(interval) // Cleanup interval on component unmount
    }, [hotNews])

    // Handle image click for navigation
    const handleImageClick = (news) => {
        if (news.redirectUrl) {
            // If redirectUrl is an absolute URL, navigate directly
            if (
                news.redirectUrl.startsWith('http://') ||
                news.redirectUrl.startsWith('https://')
            ) {
                window.location.href = news.redirectUrl
            } else {
                // Otherwise, use navigate for internal routes
                navigate(news.redirectUrl)
            }
        } else {
            // Fallback navigation if no redirectUrl
            navigate('/alltour')
        }
    }

    // Ensure infinite loop by duplicating the news list
    const displayNews = hotNews.length > 0 ? [...hotNews, ...hotNews] : []
    const translateX =
        hotNews.length > 0 ? -(currentIndex % hotNews.length) * (100 / 3) : 0

    return (
        <section className="py-4 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-100">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-blue-900 tracking-tight">
                    Tin Tức Nổi Bật
                </h2>
            </div>
            {loading ? (
                <div className="text-center">Đang tải tin tức...</div>
            ) : hotNews.length === 0 ? (
                <div className="text-center">Không có tin tức nổi bật</div>
            ) : (
                <div className="relative overflow-hidden">
                    <div
                        className="flex transition-transform duration-700 ease-in-out"
                        style={{ transform: `translateX(${translateX}%)` }}
                    >
                        {displayNews.map((news, index) => (
                            <div
                                key={index}
                                className="flex-none w-1/3 px-2"
                                onClick={() => handleImageClick(news)}
                            >
                                <img
                                    src={
                                        news.imageUrl ||
                                        '/path/to/placeholder.png'
                                    }
                                    alt={`Tin tức ${index + 1}`}
                                    className="w-full h-96 object-cover rounded-lg shadow-md cursor-pointer"
                                />
                            </div>
                        ))}
                    </div>
                    {/* Pagination dots */}
                    <div className="flex justify-center mt-4 space-x-2">
                        {hotNews.map((_, index) => (
                            <button
                                key={index}
                                className={`w-3 h-3 rounded-full ${
                                    currentIndex % hotNews.length === index
                                        ? 'bg-blue-900'
                                        : 'bg-gray-400'
                                }`}
                                onClick={() => setCurrentIndex(index)}
                            ></button>
                        ))}
                    </div>
                </div>
            )}
            <style jsx>{`
                .transition-transform {
                    transition-property: transform;
                    transition-timing-function: ease-in-out;
                }
            `}</style>
        </section>
    )
}

export default NewsImagesSlider
