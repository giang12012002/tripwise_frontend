import React, { useEffect, useState } from 'react'
import ReviewDialog from './ReviewDialog'
import { jwtDecode } from 'jwt-decode'
import { reviewAPI } from '@/apis'
import { toast } from 'react-toastify'

function Index({ tourId }) {
    const [showReviewTour, setShowReviewTour] = useState(false)
    const [isReviewed, setIsReviewed] = useState(false)
    const [reviews, setReviews] = useState([])

    const isPressed = async () => {
        try {
            const response = await reviewAPI.fetchTourAIReview(tourId)
            console.log('Reviews:', response.data)
            if (response.status === 200 && response.data?.length > 0) {
                setIsReviewed(true)
                setReviews(response.data)
            } else {
                setIsReviewed(false)
            }
        } catch (error) {
            console.error('Error fetching review:', error)
        }
    }

    useEffect(() => {
        isPressed()
    }, [tourId])

    const handleConfirm = async ({ rating, comment }) => {
        setShowReviewTour(false)
        try {
            const token = localStorage.getItem('accessToken')
            const user = jwtDecode(token)
            const response = await reviewAPI.createTourAIReview({
                tourId,
                rating,
                comment
            })
            if (response.status === 200) {
                toast.success(
                    response.data.message || 'Gửi đánh giá thành công'
                )
                isPressed()
            }
        } catch (error) {
            toast.error(error.message || 'Không thể gửi đánh giá')
        }
    }

    if (isReviewed) return null

    return (
        <>
            <div className="relative inline-block">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded hover:cursor-pointer"
                    onClick={() => setShowReviewTour(true)}
                >
                    Đánh giá
                </button>
                <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white" />
            </div>
            <ReviewDialog
                isOpen={showReviewTour}
                onClose={() => setShowReviewTour(false)}
                onConfirm={handleConfirm}
            />
        </>
    )
}

export default Index
