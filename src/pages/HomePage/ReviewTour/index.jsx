import React, { useEffect, useState } from 'react'
import ReviewDialog from './ReviewDialog'
import { jwtDecode } from 'jwt-decode'
import { reviewAPI, paymentAPI } from '@/apis'
import { toast } from 'react-toastify'

function Index({ tourId, travelDate, days }) {
    const [showReviewTour, setShowReviewTour] = useState(false)
    const [isReviewed, setIsReviewed] = useState(false)
    const [canReview, setCanReview] = useState(false)

    const isPressed = async () => {
        try {
            const token = localStorage.getItem('accessToken')
            const user = jwtDecode(token)

            // 1. Check if user already reviewed
            const response = await reviewAPI.fetchTourReview(tourId)
            if (response.status === 200 && Array.isArray(response.data)) {
                const alreadyReviewed = response.data.some(
                    (review) => review.userName === user.Username
                )
                setIsReviewed(alreadyReviewed)
            } else {
                setIsReviewed(false)
            }

            // 2. Check if user purchased this tour
            const paymentResponse = await paymentAPI.fetchPaymentHistory({
                status: 'success'
            })

            let hasPurchased = false

            if (
                paymentResponse.status === 200 &&
                Array.isArray(paymentResponse.data)
            ) {
                // Replace this logic with exact condition if tourId is part of orderCode or linked
                hasPurchased = paymentResponse.data.some((p) =>
                    p.orderCode.includes(`user_${user.UserId}`)
                )
            }

            // 3. Check if tour has ended
            const tourEndDate = new Date(travelDate)
            const numericDays = parseInt(days) || 0
            tourEndDate.setDate(tourEndDate.getDate() + numericDays)
            const isTourEnded = new Date() > tourEndDate

            // 4. Final condition
            setCanReview(hasPurchased && isTourEnded)
        } catch (error) {
            console.error('Error checking review permission:', error)
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
            const response = await reviewAPI.createTourReview({
                tourId,
                userId: user.UserId,
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

    if (isReviewed || !canReview) return null

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
