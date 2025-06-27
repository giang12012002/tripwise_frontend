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
        const transactionId = params.get('transactionId')

        console.log('VNPayCallback', success, message, transactionId)

        if (success === 'true') {
            toast.success(message + '\n' + transactionId)
            setTimeout(() => {
                navigate('/plans')
            }, 1200)
        } else {
            toast.error(message)
            setTimeout(() => {
                navigate('/plans')
            }, 1200)
        }
    }, [navigate])
    return (
        <div className="flex justify-center items-center h-screen">
            <LoadingSpinner />
        </div>
    )
}

export default VNPayCallback
