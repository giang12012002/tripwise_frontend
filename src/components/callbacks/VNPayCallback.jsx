import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import LoadingSpinner from '../states/LoadingSpinner'
import LoadingScreen from '../ui/LoadingScreen'

function VNPayCallback() {
    const navigate = useNavigate()

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const success = params.get('success')
        const message = params.get('message')

        toast[success ? 'success' : 'error'](message)

        setTimeout(() => {
            const navigateTo = localStorage.getItem('vnpay-redirect')
            navigate(navigateTo || '/')
        }, 1200)
    }, [navigate])
    return <LoadingScreen />
}

export default VNPayCallback
