import { Route, Routes, Navigate } from 'react-router-dom'

import ItineraryPage from '@/pages/ItineraryPage/index.jsx'
import ChatbotUpdate from '@/pages/ItineraryPage/ChatbotUpdate'
import CreateItineraryPage from '@/pages/CreateItineraryPage/index4.jsx'
import ViewProfilePage from '@/pages/UserProfilePage/ViewUserProfile.jsx'
import EditProfilePage from '@/pages/UserProfilePage/EditUserProfile.jsx'
import ItineraryDisplayHistory from '@/pages/ItineraryDisplayHistory/History'
import ItineraryDisplayHistoryDetail from '@/pages/ItineraryDisplayHistory/HistoryDetail'
import MyTourPage from '@/pages/MyTourPage/index1.jsx'
import TourDetail from '@/pages/MyTourPage/TourDetail'
import PlanList from '@/pages/PlanPage'
import VNPayCallback from '@/components/callbacks/VNPayCallback'
import PaymentHistory from '@/pages/PaymentHistory'

function CustomerRoutes() {
    return (
        <Routes>
            <Route>
                <Route path="/view-Profile" element={<ViewProfilePage />} />
                <Route path="/edit-Profile" element={<EditProfilePage />} />
                <Route
                    path="/CreateItinerary"
                    element={<CreateItineraryPage />}
                />
                <Route path="/itinerary" element={<ItineraryPage />} />
                <Route path="/chatbot-update" element={<ChatbotUpdate />} />
                <Route
                    path="/HistoryItinerary"
                    element={<ItineraryDisplayHistory />}
                />
                <Route
                    path="/HistoryItineraryDetail/:id"
                    element={<ItineraryDisplayHistoryDetail />}
                />
                <Route path="/myTour" element={<MyTourPage />} />
                <Route path="/tourDetail/:id" element={<TourDetail />} />
                <Route path="/plans" element={<PlanList />} />
                <Route path="/vnpay-callback" element={<VNPayCallback />} />
                <Route path="/payment-history" element={<PaymentHistory />} />
            </Route>
            <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
    )
}

export default CustomerRoutes
