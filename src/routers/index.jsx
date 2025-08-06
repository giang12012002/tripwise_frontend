import React from 'react'
import PublicRoutes from './PublicRoutes'
import UserRoutes from './UserRoutes'
import AdminRoutes from './AdminRoutes'
import PartnerRoutes from './PartnerRoutes'
import AuthRoute from './AuthRoute'

import NotFoundPage from '@/pages/ExceptionPage/NotFoundPage'

import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { permissions } from '@/utils/authConfig'

import { getRoleFromJwtCode } from '@/utils/user'

function Index() {
    const ProtectedRoute = () => {
        const role = getRoleFromJwtCode()
        if (!role) return <Navigate to="/" replace={true} />
        return <Outlet />
    }
    return (
        <Routes>
            {/* Route công khai */}
            <Route path="/*" element={<PublicRoutes />} />

            <Route element={<ProtectedRoute />}>
                {/* Route admin */}
                <Route
                    element={
                        <AuthRoute requiredPermission={permissions.admin} />
                    }
                >
                    <Route path="/admin/*" element={<AdminRoutes />} />
                </Route>

                {/* Route partner */}
                <Route
                    element={
                        <AuthRoute requiredPermission={permissions.partner} />
                    }
                >
                    <Route path="/partner/*" element={<PartnerRoutes />} />
                </Route>

                {/* Route user */}
                <Route
                    element={
                        <AuthRoute requiredPermission={permissions.user} />
                    }
                >
                    <Route path="/user/*" element={<UserRoutes />} />
                </Route>
            </Route>
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}

export default Index
