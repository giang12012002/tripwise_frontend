import React, { useState, useEffect } from 'react'
import HomeImage1 from '@/assets/images/NEWS1.png'
import HomeImage2 from '@/assets/images/NEWS2.png'
import HomeImage3 from '@/assets/images/NEWS3.png'
import HomeImage4 from '@/assets/images/NEWS4.png'

function NewsImagesSlider() {
    const images = [HomeImage1, HomeImage2, HomeImage3, HomeImage4]
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex + 1 >= images.length ? 0 : prevIndex + 1
            )
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    const displayImages = [...images, ...images]
    const translateX = -(currentIndex % images.length) * (100 / 3)

    return (
        <section className="py-4 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-100">
            {' '}
            {/* Thay py-8 bằng py-2 */}
            <div className="text-center mb-2">
                {' '}
                {/* Thay mb-6 bằng mb-2 */}
                <h2 className="text-3xl font-bold text-blue-900 tracking-tight">
                    Tin Tức Nổi Bật
                </h2>
            </div>
            <div className="relative overflow-hidden">
                <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(${translateX}%)` }}
                >
                    {displayImages.map((image, index) => (
                        <div key={index} className="flex-none w-1/3 px-2">
                            <img
                                src={image}
                                alt={`Tin tức ${index + 1}`}
                                className="w-full h-64 object-cover rounded-lg shadow-md"
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-center mt-4 space-x-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={`w-3 h-3 rounded-full ${
                            currentIndex % images.length === index
                                ? 'bg-blue-900'
                                : 'bg-gray-400'
                        }`}
                        onClick={() => setCurrentIndex(index)}
                    ></button>
                ))}
            </div>
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
