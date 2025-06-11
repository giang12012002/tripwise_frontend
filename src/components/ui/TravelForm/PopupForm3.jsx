import React, { useState } from 'react'

const PopupForm = () => {
    const [isOpen, setIsOpen] = useState(false)

    const togglePopup = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <button
                onClick={togglePopup}
                className="bg-red-600 text-white px-6 py-2 rounded"
            >
                Tiep Tuc
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <div className="flex justify-between items-center border-b pb-2">
                            <div className="flex items-center">
                                <img
                                    src="https://via.placeholder.com/20"
                                    alt="Logo"
                                    className="mr-2"
                                />
                                <h2 className="text-lg font-semibold">
                                    VIET DU KY
                                </h2>
                            </div>
                            <button
                                onClick={togglePopup}
                                className="text-gray-500"
                            >
                                ×
                            </button>
                        </div>
                        <h3 className="text-md font-medium mt-4">
                            Ngân sách chuyến đi
                        </h3>
                        <div className="mt-4 space-y-2">
                            <label className="block">
                                <input
                                    type="radio"
                                    name="budget"
                                    className="mr-2"
                                />{' '}
                                1.000.000 VND
                            </label>
                            <label className="block">
                                <input
                                    type="radio"
                                    name="budget"
                                    className="mr-2"
                                />{' '}
                                2.000.000 VND - 3.000.000 VND
                            </label>
                            <label className="block">
                                <input
                                    type="radio"
                                    name="budget"
                                    className="mr-2"
                                />{' '}
                                3.000.000 VND - 4.000.000 VND
                            </label>
                            <label className="block">
                                <input
                                    type="radio"
                                    name="budget"
                                    className="mr-2"
                                />{' '}
                                4.000.000 VND - 5.000.000 VND
                            </label>
                            <label className="block">
                                <input
                                    type="radio"
                                    name="budget"
                                    className="mr-2"
                                />{' '}
                                > 5.000.000 VND
                            </label>
                            <label className="block mt-2">
                                <input
                                    type="number"
                                    name="customBudget"
                                    placeholder="Nhập giá tiền (VND)"
                                    className="w-full p-2 border rounded"
                                />
                            </label>
                        </div>
                        <button
                            onClick={togglePopup}
                            className="mt-4 w-full bg-red-600 text-white py-2 rounded"
                        >
                            Tiep Tuc
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PopupForm
