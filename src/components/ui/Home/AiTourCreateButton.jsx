import React, { useState } from 'react'
import { useAuth } from '@/AuthContext' // Adjust path if needed
import TravelForm from '../TravelForm/TravelForm' // Adjust path if needed
import ItineraryDisplay from '../TravelForm/ItineraryDisplay' // Adjust path if needed
import { toast } from 'react-toastify'

function AiTourCreateButton() {
    const { isLoggedIn } = useAuth()
    const [showForm, setShowForm] = useState(false)
    const [itineraryData, setItineraryData] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // Handle create tour button click
    const handleCreateTour = () => {
        if (!isLoggedIn) {
            toast.error('Vui lòng đăng nhập để tạo tour!')
            return
        }
        setShowForm(true)
        setItineraryData(null)
        setError('')
    }

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
            <div className="p-7xl md:px-10 w-full py-10 bg-white bg-opacity-90 rounded-lg mx-6 my-10 md:max-w-3xl text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-blue-800 mb-4">
                    Tạo tour cá nhân hóa bằng AI!
                </h1>
                <p className="text-gray-700 mb-6">
                    Khám phá di sản Việt Nam theo cách của bạn.
                </p>
                <div className="flex justify-center">
                    <button
                        onClick={handleCreateTour}
                        className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors"
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
                <div className="max-w-7xl w-full p-4 mt-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg">
                    <p>Lỗi: {error}</p>
                </div>
            )}

            {itineraryData && (
                <ItineraryDisplay itineraryData={itineraryData} />
            )}

            {showForm && isLoggedIn && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="relative bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
                        <TravelForm
                            setItineraryData={setItineraryData}
                            setError={setError}
                            setLoading={setLoading}
                            setShowForm={setShowForm}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default AiTourCreateButton
