import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { appSettingAPI } from '@/apis'
import { FaQuestionCircle, FaCog, FaClock } from 'react-icons/fa'

const getValueByKey = (dataArray, targetKey) => {
    const setting = dataArray.find((item) => item.key === targetKey)
    return setting?.value ?? null
}

function SettingDialog({ plans = [], isOpen, onClose }) {
    const [isVisible, setIsVisible] = useState(false)
    const [animationClass, setAnimationClass] = useState('fade-in')
    const [activeTab, setActiveTab] = useState('plans') // 'plans' hoặc 'timeout'

    // Plans settings
    const [freePlan, setFreePlan] = useState('')
    const [trialPlan, setTrialPlan] = useState('')
    const [duration, setDuration] = useState(null)

    const [initialFreePlan, setInitialFreePlan] = useState('')
    const [initialTrialPlan, setInitialTrialPlan] = useState('')
    const [initialDuration, setInitialDuration] = useState(null)

    // Timeout settings (có thể thêm các setting timeout khác)
    const [sessionTimeout, setSessionTimeout] = useState(30)
    const [apiTimeout, setApiTimeout] = useState(10)
    const [initialSessionTimeout, setInitialSessionTimeout] = useState(30)
    const [initialApiTimeout, setInitialApiTimeout] = useState(10)

    const [error, setError] = useState({
        freePlan: false,
        trialPlan: false,
        duration: false,
        sessionTimeout: false,
        apiTimeout: false
    })

    const fetchKeys = async () => {
        try {
            const response = await appSettingAPI.fetchKeys()
            if (response.status === 200) {
                const data = response.data || []

                // Plans data - thêm safe check
                const freePlanValue = getValueByKey(data, 'FreePlan') || ''
                const trialPlanValue =
                    getValueByKey(data, 'DefaultTrialPlanName') || ''
                const durationValue =
                    Number(getValueByKey(data, 'TrialDurationInDays')) || 0

                setFreePlan(freePlanValue)
                setTrialPlan(trialPlanValue)
                setDuration(durationValue)

                setInitialFreePlan(freePlanValue)
                setInitialTrialPlan(trialPlanValue)
                setInitialDuration(durationValue)

                // Timeout data (giả sử có trong API)
                const sessionTimeoutValue =
                    Number(getValueByKey(data, 'SessionTimeout')) || 30
                const apiTimeoutValue =
                    Number(getValueByKey(data, 'ApiTimeout')) || 10

                setSessionTimeout(sessionTimeoutValue)
                setApiTimeout(apiTimeoutValue)
                setInitialSessionTimeout(sessionTimeoutValue)
                setInitialApiTimeout(apiTimeoutValue)
            }
        } catch (err) {
            console.error('Error fetching keys:', err)
            toast.error(
                'Không thể tải cài đặt: ' +
                    (err.message || 'Lỗi không xác định')
            )
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

    const resetData = () => {
        setFreePlan('')
        setTrialPlan('')
        setDuration(0)
        setSessionTimeout(30)
        setApiTimeout(10)
        setError({
            freePlan: false,
            trialPlan: false,
            duration: false,
            sessionTimeout: false,
            apiTimeout: false
        })
        setInitialFreePlan('')
        setInitialTrialPlan('')
        setInitialDuration(0)
        setInitialSessionTimeout(30)
        setInitialApiTimeout(10)
    }

    const handlePlansSetting = async () => {
        try {
            const isDurationZero = duration === 0

            // Reset errors trước khi validate
            setError({
                ...error,
                freePlan: false,
                trialPlan: false,
                duration: false
            })

            if (freePlan === trialPlan) {
                setError({ ...error, freePlan: true, trialPlan: true })
                toast.error(
                    'Gói miễn phí và gói dùng thử không được trùng nhau.'
                )
                return
            }

            if (isDurationZero) {
                setError({ ...error, duration: true })
                toast.error('Thời hạn dùng thử không đúng.')
                return
            }

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
            console.error('Error saving plans:', err)
            toast.error(
                'Không thể cài đặt gói: ' +
                    (err.message || 'Lỗi không xác định')
            )
        }
    }

    const handleTimeoutSetting = async () => {
        try {
            // Reset errors trước khi validate
            setError({ ...error, sessionTimeout: false, apiTimeout: false })

            if (sessionTimeout <= 0 || apiTimeout <= 0) {
                setError({
                    ...error,
                    sessionTimeout: sessionTimeout <= 0,
                    apiTimeout: apiTimeout <= 0
                })
                toast.error('Thời gian timeout phải lớn hơn 0.')
                return
            }

            // Giả sử có API để set timeout
            if (sessionTimeout !== initialSessionTimeout) {
                await appSettingAPI.setSessionTimeout(sessionTimeout)
            }

            if (apiTimeout !== initialApiTimeout) {
                await appSettingAPI.setApiTimeout(apiTimeout)
            }

            toast.success('Cài đặt timeout thành công')
        } catch (err) {
            console.error('Error saving timeout:', err)
            toast.error(
                'Không thể cài đặt timeout: ' +
                    (err.message || 'Lỗi không xác định')
            )
        }
    }

    const handleSave = async () => {
        if (activeTab === 'plans') {
            await handlePlansSetting()
        } else if (activeTab === 'timeout') {
            await handleTimeoutSetting()
        }
    }

    const handleClose = () => {
        onClose()
        resetData()
    }

    if (!isVisible) return null

    return (
        <div
            className={`fixed inset-0 z-50 bg-black/30 flex justify-center items-center ${animationClass}`}
        >
            <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-6 md:p-8 transition-transform duration-300">
                <h2 className="text-xl font-bold mb-6">Cài đặt hệ thống</h2>

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        onClick={() => setActiveTab('plans')}
                        className={`flex items-center gap-2 px-4 py-2 font-medium text-sm border-b-2 transition-colors duration-200 ${
                            activeTab === 'plans'
                                ? 'border-green-500 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <FaCog size={16} />
                        Thiết lập Plans
                    </button>
                    <button
                        onClick={() => setActiveTab('timeout')}
                        className={`flex items-center gap-2 px-4 py-2 font-medium text-sm border-b-2 transition-colors duration-200 ml-4 ${
                            activeTab === 'timeout'
                                ? 'border-green-500 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <FaClock size={16} />
                        Thiết lập Timeout
                    </button>
                </div>

                {/* Tab Content */}
                <div className="h-[400px] overflow-y-auto">
                    {activeTab === 'plans' && (
                        <div className="space-y-4">
                            {/* Free Plan */}
                            <div>
                                <label className="block font-medium mb-1">
                                    Gói miễn phí:
                                    <span className="ml-1 group relative inline-block">
                                        <FaQuestionCircle
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
                                    value={freePlan || ''}
                                    onChange={(e) =>
                                        setFreePlan(e.target.value)
                                    }
                                >
                                    <option value="">
                                        -- Chọn gói miễn phí --
                                    </option>
                                    {plans &&
                                        plans.map((plan) => (
                                            <option
                                                key={plan.planName}
                                                value={plan.planName}
                                            >
                                                {plan.planName}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            {/* Trial Plan */}
                            <div>
                                <label className="block font-medium mb-1">
                                    Gói dùng thử:
                                    <span className="ml-1 group relative inline-block">
                                        <FaQuestionCircle
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
                                    value={trialPlan || ''}
                                    onChange={(e) =>
                                        setTrialPlan(e.target.value)
                                    }
                                >
                                    <option value="">
                                        -- Chọn gói dùng thử --
                                    </option>
                                    {plans &&
                                        plans.map((plan) => (
                                            <option
                                                key={plan.planName}
                                                value={plan.planName}
                                            >
                                                {plan.planName}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            {/* Trial Duration */}
                            <div>
                                <label className="block font-medium mb-1">
                                    Thời gian dùng thử (ngày):
                                    <span className="ml-1 group relative inline-block">
                                        <FaQuestionCircle
                                            size={16}
                                            className="inline text-gray-500"
                                        />
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50 max-w-xs">
                                            Đặt thời hạn sử dụng cho gói trial,
                                            nếu đặt là 0 thì gói trial sẽ bị vô
                                            hiệu hóa.
                                        </span>
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    className={`w-full border rounded px-4 py-2 ${error.duration ? 'border-red-500' : ''}`}
                                    value={duration || 0}
                                    onChange={(e) =>
                                        setDuration(Number(e.target.value))
                                    }
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'timeout' && (
                        <div className="space-y-4">
                            {/* Session Timeout */}
                            <div>
                                <label className="block font-medium mb-1">
                                    Timeout phiên đăng nhập (phút):
                                    <span className="ml-1 group relative inline-block">
                                        <FaQuestionCircle
                                            size={16}
                                            className="inline text-gray-500"
                                        />
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50 max-w-xs">
                                            Thời gian tự động đăng xuất khi
                                            không hoạt động
                                        </span>
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    className={`w-full border rounded px-4 py-2 ${error.sessionTimeout ? 'border-red-500' : ''}`}
                                    value={sessionTimeout}
                                    onChange={(e) =>
                                        setSessionTimeout(
                                            Number(e.target.value)
                                        )
                                    }
                                    placeholder="Nhập số phút"
                                />
                            </div>

                            {/* API Timeout */}
                            <div>
                                <label className="block font-medium mb-1">
                                    Timeout API (giây):
                                    <span className="ml-1 group relative inline-block">
                                        <FaQuestionCircle
                                            size={16}
                                            className="inline text-gray-500"
                                        />
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50 max-w-xs">
                                            Thời gian chờ tối đa cho các API
                                            request
                                        </span>
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="300"
                                    className={`w-full border rounded px-4 py-2 ${error.apiTimeout ? 'border-red-500' : ''}`}
                                    value={apiTimeout}
                                    onChange={(e) =>
                                        setApiTimeout(Number(e.target.value))
                                    }
                                    placeholder="Nhập số giây (1-300)"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-200">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 hover:cursor-pointer transition duration-200"
                    >
                        Thoát
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded border border-gray-300 text-white hover:cursor-pointer bg-green-400 hover:bg-green-500 active:bg-green-600 transition duration-300 ease-in-out"
                    >
                        Lưu {activeTab === 'plans' ? 'Plans' : 'Timeout'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SettingDialog
