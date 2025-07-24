import React from 'react'
import { Check } from 'lucide-react'
import { splitTextByType } from '@/utils/text'

function PlanCard({
    plan,
    onDelete,
    onUpdate,
    isPreview,
    isFreePlan,
    isTrialPlan
}) {
    const features = splitTextByType(plan.description, 'dot_space')

    const badgeText = isFreePlan ? 'Free' : isTrialPlan ? 'Trial' : null

    return (
        <div className="relative bg-white rounded-lg border shadow p-6 flex flex-col items-center text-center h-full">
            {/* 🎁 Góc ribbon */}
            {badgeText && (
                <div className="absolute top-0 right-0">
                    <div className="bg-yellow-400 text-white text-xs font-bold px-2 py-1 rotate-45 transform translate-x-4 -translate-y-2 shadow-md">
                        {badgeText}
                    </div>
                </div>
            )}

            <h2 className="text-xl font-semibold mb-2">{plan.planName}</h2>
            <div className="flex items-end justify-center text-3xl font-bold mb-1">
                <span>{plan.price.toLocaleString('vi-VN')}₫</span>
            </div>

            <div className="flex items-end justify-center text-xl font-bold mb-1">
                <span>{plan.planName}</span>
            </div>

            <ul className="mb-6 space-y-2 text-sm w-full flex-1">
                {features.map((f, i) => (
                    <li key={i} className="flex items-center space-x-2">
                        <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center">
                            <Check size={12} />
                        </div>
                        <span className="flex-1 text-left">{f}</span>
                    </li>
                ))}
            </ul>

            {isPreview && (
                <div className="mt-auto w-full flex flex-row gap-2">
                    {!isFreePlan && (
                        <button
                            onClick={() => onDelete(plan)}
                            className="bg-red-600 text-white w-1/2 py-2 rounded hover:bg-red-700 hover:cursor-pointer active:bg-red-800 transition duration-300 ease-in-out"
                        >
                            Xóa
                        </button>
                    )}

                    <button
                        onClick={() => onUpdate(plan)}
                        className={`bg-blue-600 text-white py-2 rounded hover:bg-blue-700 hover:cursor-pointer active:bg-blue-800 transition duration-300 ease-in-out ${
                            !isFreePlan ? 'w-1/2' : 'w-full'
                        }`}
                    >
                        Sửa
                    </button>
                </div>
            )}
        </div>
    )
}

export default PlanCard
