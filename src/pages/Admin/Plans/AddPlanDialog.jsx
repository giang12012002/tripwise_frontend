import React, { useEffect, useState } from 'react'
import LoadingSpinner from '@/components/states/LoadingSpinner'
import { Check } from 'lucide-react'
import { toast } from 'react-toastify'
import PlanCard from './PlanCard'

function AddPlanDialog({ isOpen, onClose, onConfirm, plan }) {
    const [page, setPage] = useState('form')
    const [isVisible, setIsVisible] = useState(false)
    const [animationClass, setAnimationClass] = useState('fade-in')
    const [loading, setLoading] = useState(false)

    const [planName, setPlanName] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [maxRequests, setMaxRequests] = useState('')

    const [submitted, setSubmitted] = useState(false)
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true)
            setAnimationClass('fade-in')
        } else {
            setAnimationClass('fade-out')
            setTimeout(() => setIsVisible(false), 300)
        }
    }, [isOpen])

    useEffect(() => {
        if (plan) {
            console.log('plan choose: ', plan)
            setPlanName(plan.planName || '')
            setPrice(plan.price !== undefined ? String(plan.price) : '')
            setDescription(plan.description || '')
            setMaxRequests(
                plan.maxRequests !== undefined ? String(plan.maxRequests) : ''
            )
        }
    }, [plan])
    const isValid = {
        planName: planName.trim() !== '',
        price: !isNaN(price) && price !== '' && Number(price) % 1000 === 0,
        description: description.trim() !== '',
        maxRequests:
            !isNaN(maxRequests) &&
            maxRequests !== '' &&
            Number(maxRequests) < 1000
    }

    const getInputClasses = (valid) => {
        if (!submitted) return 'border-gray-300'
        return valid ? 'border-green-500' : 'border-red-500'
    }

    const getPreviewPlan = () => {
        const newPlan = {
            planName,
            price: Number(price),
            description,
            maxRequests: Number(maxRequests)
        }
        return newPlan
    }

    const toPreview = async () => {
        setSubmitted(true)

        const allValid = Object.values(isValid).every(Boolean)
        if (!allValid) {
            toast.error(
                'Vui lòng điền đúng và đầy đủ thông tin trước khi xem trước'
            )
            return
        }
        await new Promise((resolve) => setTimeout(resolve, 500))
        setPage('preview')
    }

    const handleSubmit = async () => {
        setSubmitted(true)

        const allValid = Object.values(isValid).every(Boolean)
        if (!allValid) {
            toast.error('Vui lòng điền đúng và đầy đủ thông tin')
            return
        }

        setLoading(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            onConfirm(getPreviewPlan(), plan?.planId || null)
        } catch (err) {
            toast.error('Có lỗi xảy ra khi tạo gói')
        } finally {
            setLoading(false)
            handleClose()
        }
    }
    const resetFields = () => {
        setPlanName('')
        setPrice('')
        setDescription('')
        setMaxRequests('')
        setSubmitted(false)
        setPage('form')
    }

    const handleClose = () => {
        onClose()
        resetFields()
    }

    if (!isVisible) return null

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center z-50 bg-white/10 backdrop-blur-sm ${animationClass}`}
        >
            <div className="relative bg-white rounded-lg p-6 shadow-lg max-w-2xl w-[90%] transition-transform">
                {/* Overlay loading */}
                {loading && (
                    <div className="absolute inset-0 z-20 bg-white/20 backdrop-blur-[0.5px] flex items-center justify-center rounded-lg">
                        <LoadingSpinner />
                    </div>
                )}

                <div
                    className={`${loading ? 'opacity-50 pointer-events-none select-none' : ''}`}
                >
                    {page === 'form' && (
                        <>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                                {plan !== null ? 'Cập nhật gói' : 'Tạo gói mới'}
                            </h2>
                            <div className="space-y-4">
                                {/* Tên gói */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Tên gói"
                                        value={planName}
                                        onChange={(e) =>
                                            setPlanName(e.target.value)
                                        }
                                        className={`w-full border px-4 py-2 rounded pr-10 ${getInputClasses(isValid.planName)}`}
                                    />
                                    {submitted && isValid.planName && (
                                        <Check
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                                            size={18}
                                        />
                                    )}
                                </div>

                                {/* Giá */}
                                <div className="relative">
                                    <input
                                        type="number"
                                        placeholder="Giá"
                                        title="Giá phải là bội số của 1000 (VD: 1000, 5000, 100000) v.v"
                                        value={price}
                                        onChange={(e) =>
                                            setPrice(e.target.value)
                                        }
                                        className={`w-full border px-4 py-2 rounded pr-10 ${getInputClasses(isValid.price)}`}
                                    />
                                    {submitted && isValid.price && (
                                        <Check
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                                            size={18}
                                        />
                                    )}
                                </div>

                                {/* Lượt tối đa */}
                                <div className="relative">
                                    <input
                                        type="number"
                                        placeholder="Lượt/ngày"
                                        title="Số lượt sử dụng mỗi ngày phải nhỏ hơn 1000"
                                        value={maxRequests}
                                        onChange={(e) =>
                                            setMaxRequests(e.target.value)
                                        }
                                        className={`w-full border px-4 py-2 rounded pr-10 ${getInputClasses(isValid.maxRequests)}`}
                                    />
                                    {submitted && isValid.maxRequests && (
                                        <Check
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                                            size={18}
                                        />
                                    )}
                                </div>

                                {/* Mô tả */}
                                <div className="relative">
                                    <textarea
                                        placeholder="Mô tả gói dịch vụ"
                                        title="Hệ thống sẽ tách theo từng câu trong mô tả thành danh sách dịch vụ"
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                        className={`w-full border px-4 py-2 rounded resize-none pr-10 ${getInputClasses(isValid.description)}`}
                                        rows={4}
                                    />
                                    {submitted && isValid.description && (
                                        <Check
                                            className="absolute right-3 top-3 text-green-500"
                                            size={18}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end mt-6 gap-4">
                                <button
                                    onClick={handleClose}
                                    className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 hover: cursor-pointer"
                                >
                                    Thoát
                                </button>
                                <button
                                    onClick={toPreview}
                                    className="px-5 py-2 rounded bg-black text-white hover:bg-gray-800 active:bg-gray-900 hover:cursor-pointer"
                                >
                                    Xem trước →
                                </button>
                            </div>
                        </>
                    )}

                    {page === 'preview' && (
                        <>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                                Xem trước plan
                            </h2>

                            <div className="relative bg-white rounded-lg p-6 flex justify-center items-center h-full">
                                <PlanCard
                                    plan={getPreviewPlan()}
                                    isPreview={false}
                                />
                            </div>

                            <div className="flex justify-end mt-6 gap-4">
                                <button
                                    onClick={() => setPage('form')}
                                    className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 hover: cursor-pointer"
                                >
                                    Quay lại
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-5 py-2 rounded bg-black text-white hover:bg-gray-800 active:bg-gray-900 hover:cursor-pointer"
                                >
                                    Tạo
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AddPlanDialog
