import React, { useState } from 'react'
import ReviewDialog from './ReviewDialog'
import { jwtDecode } from 'jwt-decode'
import { reviewAPI } from '@/apis'
import { toast } from 'react-toastify'

function Index({ tourId = 1 }) {
    const [showReviewTour, setShowReviewTour] = useState(false)
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
            }
        } catch (error) {
            toast.error(error.message || 'Không thể gửi đánh giá')
        }
    }
    return (
        <>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded hover:cursor-pointer"
                onClick={() => setShowReviewTour(true)}
            >
                Nhấn
            </button>
            <ReviewDialog
                isOpen={showReviewTour}
                onClose={() => setShowReviewTour(false)}
                onConfirm={handleConfirm}
            />
        </>
    )
}

export default Index
