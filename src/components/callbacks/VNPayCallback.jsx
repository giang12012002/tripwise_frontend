import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import LoadingSpinner from '../states/LoadingSpinner'

function VNPayCallback() {
    const navigate = useNavigate()

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const success = params.get('success')
        const message = params.get('message')

        // if (success === 'true') {
        //     toast.success(message)
        //     setTimeout(() => {
        //         const navigateTo = localStorage.getItem('vnpay-redirect')
        //         if (navigateTo) navigate(navigateTo)
        //         else navigate('/')
        //         // navigate('/plans')
        //     }, 1200)
        // } else {
        //     toast.error(message)
        //     setTimeout(() => {
        //         const navigateTo = localStorage.getItem('vnpay-redirect')
        //         if (navigateTo) navigate(navigateTo)
        //         else navigate('/')
        //     }, 1200)
        // }

        toast[success ? 'success' : 'error'](message)

        setTimeout(() => {
            const navigateTo = localStorage.getItem('vnpay-redirect')
            navigate(navigateTo || '/')
        }, 1200)
    }, [navigate])
    return (
        <div className="flex justify-center items-center h-screen">
            <LoadingSpinner />
        </div>
    )
}

export default VNPayCallback
