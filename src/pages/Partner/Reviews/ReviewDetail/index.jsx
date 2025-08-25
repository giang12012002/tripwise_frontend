import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ReviewDetail from './ReviewDetail'

function Index() {
    const location = useLocation()
    const navigate = useNavigate()
    const { review } = location.state || {}

    useEffect(() => {
        if (!review) {
            navigate('/reviews') // fallback nếu không có dữ liệu
        }
    }, [review, navigate])

    const sendMail = () => {
        const to = review?.email || ''
        const subject = encodeURIComponent(
            'Về đánh giá bạn đã gửi cho chúng tôi'
        )
        const body = encodeURIComponent('')
        return `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${to}&subject=${subject}&body=${body}`
    }

    const handleSend = () => {
        // console.log('Đã gui mail')
        // window.open(sendMail(), '_blank', 'noopener,noreferrer')
        navigate('/partner/reviews')
    }

    return review ? <ReviewDetail review={review} onSend={handleSend} /> : null
}

export default Index
