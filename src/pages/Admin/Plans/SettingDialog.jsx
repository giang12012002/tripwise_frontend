import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { appSettingAPI } from '@/apis'
import { HelpCircle } from 'lucide-react'

const getValueByKey = (dataArray, targetKey) => {
    const setting = dataArray.find((item) => item.key === targetKey)
    return setting?.value ?? null
}

function SettingDialog({ plans = [], isOpen, onClose }) {
    const [isVisible, setIsVisible] = useState(false)
    const [animationClass, setAnimationClass] = useState('fade-in')

    const [freePlan, setFreePlan] = useState('')
    const [trialPlan, setTrialPlan] = useState('')
    const [duration, setDuration] = useState(null)

    const [initialFreePlan, setInitialFreePlan] = useState('')
    const [initialTrialPlan, setInitialTrialPlan] = useState('')
    const [initialDuration, setInitialDuration] = useState(null)

    const [error, setError] = useState({
        freePlan: false,
        trialPlan: false,
        duration: false
    })

    const fetchKeys = async () => {
        try {
            const response = await appSettingAPI.fetchKeys()
            if (response.status === 200) {
                const data = response.data
                setFreePlan(getValueByKey(data, 'FreePlan'))
                setTrialPlan(getValueByKey(data, 'DefaultTrialPlanName'))
                setDuration(Number(getValueByKey(data, 'TrialDurationInDays')))

                setInitialFreePlan(getValueByKey(data, 'FreePlan'))
                setInitialTrialPlan(getValueByKey(data, 'DefaultTrialPlanName'))
                setInitialDuration(
                    Number(getValueByKey(data, 'TrialDurationInDays'))
                )
            }
        } catch (err) {
            toast.error('Không thể tải cài đặt: ' + err.message)
        }
    }

    useEffect(() => {
        if (isOpen) {
            fetchKeys()
            setIsVisible(true)
            setAnimationClass('fade-in')
        } else {
            setAnimationClass('fade-out')
            setTimeout(() => setIsVisible(false), 300)
        }
    }, [isOpen])

    const handleSetting = async () => {
        const isDurationZero = duration === 0

        if (freePlan === trialPlan) {
            setError({ freePlan: true, trialPlan: true })
            toast.error('Gói miễn phí và gói dùng thử không được trùng nhau.')
            return
        }

        if (isDurationZero) {
            setError({ duration: true })
            toast.error('Thời hạn dùng thử không đúng.')
            return
        }

        // if (isDurationZero) {
        //     const confirmDisable = window.confirm('Bạn đã đặt thời hạn dùng thử là 0. Gói trial sẽ bị vô hiệu hóa. Bạn có chắc không?')
        //     if (!confirmDisable) return
        // }

        try {
            // setError({ freePlan: false, trialPlan: false })

            if (freePlan !== initialFreePlan) {
                await appSettingAPI.setFreePlan(freePlan)
            }

            if (trialPlan !== initialTrialPlan) {
                await appSettingAPI.setTrialPlan(trialPlan)
            }

            if (duration !== initialDuration) {
                await appSettingAPI.setTrialDuration(duration)
            }

            toast.success('Cài đặt gói thành công')
        } catch (err) {
            toast.error('Không thể cài đặt gói: ' + err.message)
        } finally {
            onClose()
            setFreePlan('')
            setTrialPlan('')
            setDuration(0)
            setError({ freePlan: false, trialPlan: false })
            setInitialFreePlan('')
            setInitialTrialPlan('')
            setInitialDuration(0)
        }
    }

    if (!isVisible) return null

    return (
        <div
            className={`fixed inset-0 z-50 bg-black/30 flex justify-center items-center ${animationClass}`}
        >
            <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-6 md:p-8 transition-transform duration-300">
                <h2 className="text-xl font-bold mb-6">Cài đặt gói</h2>

                {/* Free Plan */}
                <div className="mb-4">
                    <label className="block font-medium mb-1">
                        Gói miễn phí:
                        <span className="ml-1 group relative inline-block">
                            <HelpCircle
                                size={16}
                                className="inline text-gray-500"
                            />
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
                                Đặt gói miễn phí
                            </span>
                        </span>
                    </label>
                    <select
                        className={`w-full border rounded px-4 py-2 ${error.freePlan ? 'border-red-500' : ''}`}
                        value={freePlan}
                        onChange={(e) => setFreePlan(e.target.value)}
                    >
                        {plans.map((plan) => (
                            <option key={plan.planName} value={plan.planName}>
                                {plan.planName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Trial Plan */}
                <div className="mb-4">
                    <label className="block font-medium mb-1">
                        Gói dùng thử:
                        <span className="ml-1 group relative inline-block">
                            <HelpCircle
                                size={16}
                                className="inline text-gray-500"
                            />
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
                                Đặt gói dùng thử
                            </span>
                        </span>
                    </label>
                    <select
                        className={`w-full border rounded px-4 py-2 ${error.trialPlan ? 'border-red-500' : ''}`}
                        value={trialPlan}
                        onChange={(e) => setTrialPlan(e.target.value)}
                    >
                        {plans.map((plan) => (
                            <option key={plan.planName} value={plan.planName}>
                                {plan.planName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Trial Duration */}
                <div className="mb-6">
                    <label className="block font-medium mb-1">
                        Thời gian dùng thử (ngày):
                        <span className="ml-1 group relative inline-block">
                            <HelpCircle
                                size={16}
                                className="inline text-gray-500"
                            />
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50 max-w-xs">
                                Đặt thời hạn sử dụng cho gói trial, nếu đặt là 0
                                thì gói trial sẽ bị vô hiệu hóa.
                            </span>
                        </span>
                    </label>
                    <input
                        type="number"
                        min="0"
                        className="w-full border rounded px-4 py-2"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 hover:cursor-pointer"
                    >
                        Thoát
                    </button>
                    <button
                        onClick={handleSetting}
                        className="px-4 py-2 rounded border border-gray-300 text-white hover:cursor-pointer bg-green-400 hover:bg-green-500 active:bg-green-600 transition duration-300 ease-in-out"
                    >
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SettingDialog
