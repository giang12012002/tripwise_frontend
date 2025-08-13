import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import HomeImage1 from '@/assets/images/NEWS1.png'
import HomeImage2 from '@/assets/images/NEWS2.png'
import HomeImage3 from '@/assets/images/NEWS3.png'
import HomeImage4 from '@/assets/images/NEWS4.png'
import HomeImage5 from '@/assets/images/NEWS5.png'

function NewsImagesSlider() {
    // List of news images
    const images = [HomeImage1, HomeImage5, HomeImage2, HomeImage3, HomeImage4]
    const navigate = useNavigate()
    const [currentIndex, setCurrentIndex] = useState(0)

    // Handle automatic sliding every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex + 1 >= images.length ? 0 : prevIndex + 1
            )
        }, 6000)

        return () => clearInterval(interval) // Cleanup interval on component unmount
    }, [])

    // Handle image click for navigation
    const handleImageClick = (index) => {
        if (index % images.length === 1) {
            // HomeImage5 navigates to /user/plans
            navigate('/user/plans')
        } else {
            // HomeImage1, HomeImage2, HomeImage3, HomeImage4 navigate to /alltour
            navigate('/alltour')
        }
    }

    // Ensure infinite loop by duplicating the image list
    const displayImages = [...images, ...images]
    const translateX = -(currentIndex % images.length) * (100 / 3) // Calculate transform (each image takes 1/3 width)

    return (
        <section className="py-4 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-100">
            <div className="text-center mb-6">
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
                        <div
                            key={index}
                            className="flex-none w-1/3 px-2"
                            onClick={() => handleImageClick(index)}
                        >
                            <img
                                src={image}
                                alt={`Tin tức ${index + 1}`}
                                className="w-full h-96 object-cover rounded-lg shadow-md cursor-pointer"
                            />
                        </div>
                    ))}
                </div>
            </div>
            {/* Pagination dots */}
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
