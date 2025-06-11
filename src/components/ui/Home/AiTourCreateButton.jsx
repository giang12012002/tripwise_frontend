import React, { useState } from 'react'
import TravelForm from '.././TravelForm/TravelForm'
import ItineraryDisplay from '.././TravelForm/ItineraryDisplay'

function AiTourCreateButton() {
    const [showForm, setShowForm] = useState(false)
    const [itineraryData, setItineraryData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleCreateTour = () => {
        setShowForm(true)
        setItineraryData(null)
        setError(null)
    }

    // Nếu showForm là true, chỉ hiển thị TravelForm
    if (showForm) {
        return (
            <div className="min-h-screen flex flex-col items-center bg-gray-100">
                <TravelForm
                    setItineraryData={setItineraryData}
                    setError={setError}
                    setLoading={setLoading}
                    setShowForm={setShowForm}
                />
            </div>
        )
    }

    // Màn hình chính khi showForm là false
    return (
        <div className="min-h-screen flex flex-col items-center">
            <section
                className="relative bg-cover max-w-7xl bg-center h-96 w-full"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`
                }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
            </section>
            <div className="p-6 md:p-10 bg-white bg-opacity-90 rounded-lg m-6 md:m-10 max-w-6xl text-center w-full">
                <h1 className="text-2xl md:text-3xl font-bold text-blue-800 mb-4">
                    Tạo tour cá nhân hóa bằng AI!
                </h1>
                <p className="text-gray-700 mb-6">
                    Khám phá di sản Việt theo cách của bạn.
                </p>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={handleCreateTour}
                        className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-red-900 transition-colors"
                    >
                        Tạo tour ngay
                    </button>
                </div>
            </div>

            {loading && (
                <div className="text-center mt-4">
                    <p className="text-blue-600">Đang tạo lịch trình...</p>
                </div>
            )}

            {error && (
                <div className="max-w-6xl w-full p-4 mt-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    <p>Lỗi: {error}</p>
                </div>
            )}

            {itineraryData && (
                <ItineraryDisplay itineraryData={itineraryData} />
            )}
        </div>
    )
}

export default AiTourCreateButton
