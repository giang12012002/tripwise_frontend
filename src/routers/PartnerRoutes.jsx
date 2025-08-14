import { Route, Routes, Navigate } from 'react-router-dom'

import PartnerCreateTour from '@/pages/Partner/CreateTourPage/CreateTour.jsx'
import ListAllTour from '@/pages/Partner/ListAllTour/TourList.jsx'
import DetailTour from '@/pages/Partner/ListAllTour/DetailTour.jsx'
import EditTour from '@/pages/Partner/EditTour'
import PartnerBookings from '@/pages/Partner/Bookings'
import PartnerBookingDetail from '@/pages/Partner/Bookings/BookingDetail'

import PartnerLayout from '@/pages/Partner/PartnerLayout'

function PartnerRoutes() {
    return (
        <Routes>
            <Route element={<PartnerLayout />}>
                <Route index path="/" element={<ListAllTour />} />
                <Route path="createTour" element={<PartnerCreateTour />} />
                <Route path="detailTour/:tourId" element={<DetailTour />} />
                <Route path="edit/:tourId" element={<EditTour />} />
                <Route path="bookings" element={<PartnerBookings />} />
                <Route
                    path="bookings/:bookingId"
                    element={<PartnerBookingDetail />}
                />
            </Route>
            <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
    )
}

export default PartnerRoutes
