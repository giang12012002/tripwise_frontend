import { jwtDecode } from 'jwt-decode'
import { roles } from '@/utils/authConfig'
import { Route, Routes, Navigate } from 'react-router-dom'
import RegisterPage from '@/pages/RegisterPage/index.jsx'
import OtpVerification from '@/pages/RegisterPage/OtpVerification'
import SignInPage from '@/pages/SignInPage/index.jsx'
import HomePage from '@/pages/HomePage/HomePage'
import CustomerTourDetail from '@/pages/ToursPage/TourDetail'
import CustomerTourList from '@/pages/ToursPage'
import AboutPage from '@/pages/AboutPage/index.jsx'
import BlogList from '@/pages/BlogsPage'
import BlogDetail from '@/pages/BlogsPage/id'
import PartnershipPage from '@/pages/PartnershipPage'
import ForgotPassword from '@/pages/ForgotPasswordPage'

import { getRoleFromJwtCode } from '@/utils/user'

function PublicRoutes() {
    const userRole = getRoleFromJwtCode()

    if (userRole === roles.admin) {
        return <Navigate to="/admin" replace />
    }

    if (userRole === roles.partner) {
        return <Navigate to="/partner" replace />
    }

    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/otp-verification" element={<OtpVerification />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
            <Route
                path="/tour-detail/:tourId"
                element={<CustomerTourDetail />}
            />
            <Route path="/tours" element={<CustomerTourList />} />
            <Route path="/connect" element={<PartnershipPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
    )
}

export default PublicRoutes
