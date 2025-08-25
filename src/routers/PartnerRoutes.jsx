import { Route, Routes, Navigate } from 'react-router-dom'

import PartnerCreateTour from '@/pages/Partner/CreateTourPage/CreateTour.jsx'
import ListAllTour from '@/pages/Partner/ListAllTour/TourList.jsx'
import DetailTour from '@/pages/Partner/ListAllTour/DetailTour.jsx'
import EditTour from '@/pages/Partner/EditTour'
import EditTour2 from '@/pages/Partner/EditTour/index2'
import PartnerBookings from '@/pages/Partner/Bookings'
import PartnerBookingDetail from '@/pages/Partner/Bookings/BookingDetail'

import PartnerLayout from '@/pages/Partner/PartnerLayout'
import PartnerStatsPage from '@/pages/Partner/PartnerStatsPage/PartnerStatsPage.jsx'

import ReviewPage from '@/pages/Partner/Reviews'
import ReviewDetail from '@/pages/Partner/Reviews/ReviewDetail'

function PartnerRoutes() {
    return (
        <Routes>
            <Route element={<PartnerLayout />}>
                <Route index path="/" element={<ListAllTour />} />
                <Route path="createTour" element={<PartnerCreateTour />} />
                <Route path="detailTour/:tourId" element={<DetailTour />} />
                <Route path="edit/:tourId" element={<EditTour />} />
                <Route path="edit2/:tourId" element={<EditTour2 />} />
                <Route path="bookings" element={<PartnerBookings />} />
                <Route
                    path="bookings/:bookingId"
                    element={<PartnerBookingDetail />}
                />
                <Route path="stats" element={<PartnerStatsPage />} />
                <Route path="reviews" element={<ReviewPage />} />
                <Route path="review-detail" element={<ReviewDetail />} />
            </Route>
            <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
    )
}

export default PartnerRoutes
