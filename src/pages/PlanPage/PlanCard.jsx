import React from 'react'
import { Check } from 'lucide-react'

function PlanCard({ plan, onSelect }) {
    return (
        <div className="bg-white rounded-lg border shadow p-6 flex flex-col items-center text-center h-full">
            <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
            <div className="flex items-end justify-center text-3xl font-bold mb-1">
                <span>{plan.price.toLocaleString('vi-VN')}₫</span>
            </div>

            <div className="flex items-end justify-center text-xl font-bold mb-1">
                <span>{plan.planName}</span>
            </div>

            <ul className="mb-6 space-y-2 text-sm w-full flex-1">
                {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center space-x-2">
                        <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center">
                            <Check size={12} />
                        </div>
                        <span className="flex-1 text-left">{f}</span>
                    </li>
                ))}
            </ul>

            <div className="mt-auto w-full">
                <button
                    onClick={() => onSelect(plan)}
                    className="bg-black text-white w-full py-2 rounded hover:bg-gray-800 hover:cursor-pointer active:bg-gray-900 transition duration-300 ease-in-out"
                >
                    Chọn
                </button>
            </div>
        </div>
    )
}

export default PlanCard
