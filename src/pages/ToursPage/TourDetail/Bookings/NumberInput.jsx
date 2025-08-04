import React from 'react'
import { FaPlus, FaMinus } from 'react-icons/fa6'

function NumberInput({ label = '', value = 0, onChange = () => {}, min = 0 }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-medium">{label}</label>
            <div className="flex items-center gap-2">
                <input
                    type="number"
                    value={value}
                    onChange={(e) =>
                        onChange(Math.max(min, parseInt(e.target.value) || 0))
                    }
                    min={min}
                    className="border border-gray-300 rounded px-4 py-1 w-full appearance-none"
                />
                <div className="flex gap-1 h-full">
                    <button
                        className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-2 rounded h-full flex items-center"
                        onClick={() => onChange(Math.max(min, value - 1))}
                    >
                        <FaMinus />
                    </button>
                    <button
                        className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-2 rounded h-full flex items-center"
                        onClick={() => onChange(value + 1)}
                    >
                        <FaPlus />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NumberInput
