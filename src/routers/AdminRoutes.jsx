import { Route, Routes, Navigate } from 'react-router-dom'

import AdminDashboard from '@/pages/Admin/AdminDashboard/AdminDashboard.jsx'
import AdminBlogList from '@/pages/Admin/Blogs'
import AdminBlogDetail from '@/pages/Admin/Blogs/id'
import PreviewBlog from '@/pages/Admin/Blogs/AddBlog/PreviewBlog'
import ReportDashboard from '@/pages/Admin/Report/ReportDashboard.jsx'
import AdminManagerUser from '@/pages/Admin/CustomersManager/UserManager.jsx'
import AdminManagerPartner from '@/pages/Admin/PartnersManager/PartnerManager.jsx'
import AdminTourList from '@/pages/Admin/ManagerTour/AdminTourList.jsx'
import AdminTourDetail from '@/pages/Admin/ManagerTour/AdminTourDetail.jsx'
import PlanAdminList from '@/pages/Admin/Plans'
import LogPage from '@/pages/Admin/LogsPage'
import ReviewPage from '@/pages/Admin/Reviews'
import ReviewDetail from '@/pages/Admin/Reviews/ReviewDetail'
import SystemStatsPage from '@/pages/Admin/LandingReportPage/SystemStatsPage'

import AdminLayout from '@/pages/Admin/AdminLayout'

function AdminRoutes() {
    return (
        // <Routes>
        //     <Route path="/" element={<AdminDashboard />}>
        //         <Route index element={<Navigate to="system-stats" replace />} />
        //         <Route path="blog/preview" element={<PreviewBlog />} />

        //         <Route path="blogs" element={<AdminBlogList />} />
        //         <Route path="blogs/:id" element={<AdminBlogDetail />} />
        //         <Route path="tours/pending" element={<AdminTourList />} />
        //         <Route
        //             path="tourDetail/:tourId"
        //             element={<AdminTourDetail />}
        //         />

        //         <Route path="partners" element={<AdminManagerPartner />} />
        //         <Route path="users" element={<AdminManagerUser />} />
        //         <Route path="system-stats" element={<SystemStatsPage />} />
        //         <Route path="reports" element={<ReportDashboard />}>
        //             <Route
        //                 index
        //                 element={
        //                     <Navigate to="/admin/reports/revenue" replace />
        //                 }
        //             />
        //             <Route
        //                 path="revenue"
        //                 element={<ReportDashboard activeTab="revenue" />}
        //             />
        //             <Route
        //                 path="partnerPerformance"
        //                 element={<ReportDashboard activeTab="partner" />}
        //             />
        //             <Route
        //                 path="tourBookingStats"
        //                 element={<ReportDashboard activeTab="tour" />}
        //             />
        //         </Route>
        //         <Route path="plans" element={<PlanAdminList />} />
        //         <Route path="logs" element={<LogPage />} />
        //         <Route path="reviews" element={<ReviewPage />} />
        //         <Route path="review-detail" element={<ReviewDetail />} />
        //     </Route>
        //     <Route path="*" element={<Navigate to="/404" replace />} />
        // </Routes>

        <Routes>
            <Route element={<AdminLayout />}>
                <Route index path="/" element={<SystemStatsPage />} />
                <Route path="blogs" element={<AdminBlogList />} />
                <Route path="blog/preview" element={<PreviewBlog />} />
                <Route path="blogs" element={<AdminBlogList />} />
                <Route path="blogs/:id" element={<AdminBlogDetail />} />
                <Route path="tours/pending" element={<AdminTourList />} />
                <Route
                    path="tourDetail/:tourId"
                    element={<AdminTourDetail />}
                />

                <Route path="partners" element={<AdminManagerPartner />} />
                <Route path="users" element={<AdminManagerUser />} />
                {/* <Route path="system-stats" element={<SystemStatsPage />} /> */}
                <Route path="reports" element={<ReportDashboard />}>
                    <Route
                        index
                        element={
                            <Navigate to="/admin/reports/revenue" replace />
                        }
                    />
                    <Route
                        path="revenue"
                        element={<ReportDashboard activeTab="revenue" />}
                    />
                    <Route
                        path="partnerPerformance"
                        element={<ReportDashboard activeTab="partner" />}
                    />
                    <Route
                        path="tourBookingStats"
                        element={<ReportDashboard activeTab="tour" />}
                    />
                </Route>
                <Route path="plans" element={<PlanAdminList />} />
                <Route path="logs" element={<LogPage />} />
                <Route path="reviews" element={<ReviewPage />} />
                <Route path="review-detail" element={<ReviewDetail />} />
            </Route>
            <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
    )
}

export default AdminRoutes
