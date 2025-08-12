import { Route, Routes, Navigate } from 'react-router-dom'

import PartnerDashboard from '@/pages/Partner/PartnerDashboard/PartnerDashboard.jsx'
import PartnerCreateTour from '@/pages/Partner/CreateTourPage/CreateTour.jsx'
import ListAllTour from '@/pages/Partner/ListAllTour/TourList.jsx'
import DetailTour from '@/pages/Partner/ListAllTour/DetailTour.jsx'
import EditTour from '@/pages/Partner/EditTour/EditTour.jsx'
import PartnerStatsPage from '@/pages/Partner/PartnerStatsPage/PartnerStatsPage.jsx'

function PartnerRoutes() {
    return (
        <Routes>
            <Route path="/" element={<PartnerDashboard />}>
                <Route index element={<ListAllTour />} />
                <Route path="listTour" element={<ListAllTour />} />
                <Route path="createTour" element={<PartnerCreateTour />} />
                <Route path="detailTour/:tourId" element={<DetailTour />} />
                <Route path="edit/:tourId" element={<EditTour />} />
                <Route path="stats" element={<PartnerStatsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
    )
}

export default PartnerRoutes
