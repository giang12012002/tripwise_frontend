import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from 'react-router-dom'
import RegisterPage from '@/pages/RegisterPage/index.jsx'
import OtpVerification from '@/pages/RegisterPage/OtpVerification'
import SignInPage from '@/pages/SignInPage/index.jsx'
import HomePage from '@/pages/HomePage/HomePage'
import CustomerTourDetail from '@/pages/HomePage/CustomerTourDetail.jsx'
import AboutPage from '@/pages/AboutPage/index.jsx'
import ItineraryPage from '@/pages/ItineraryPage/index.jsx'
import ChatbotUpdate from '@/pages/ItineraryPage/ChatbotUpdate'
import CreateItineraryPage from '@/pages/CreateItineraryPage/index4.jsx'
import ViewProfilePage from '@/pages/UserProfilePage/ViewUserProfile.jsx'
import EditProfilePage from '@/pages/UserProfilePage/EditUserProfile.jsx'
import BlogList from '@/pages/BlogsPage'
import BlogDetail from '@/pages/BlogsPage/id'
import ItineraryDisplayHistory from '@/pages/ItineraryDisplayHistory/History'
import ItineraryDisplayHistoryDetail from '@/pages/ItineraryDisplayHistory/HistoryDetail'
import MyTourPage from '@/pages/MyTourPage/index1.jsx'
import TourDetail from '@/pages/MyTourPage/TourDetail'
import PlanList from '@/pages/PlanPage'
import VNPayCallback from '@/components/callbacks/VNPayCallback'
import PartnerDashboard from '@/pages/Partner/PartnerDashboard/PartnerDashboard.jsx'
import PartnerCreateTour from '@/pages/Partner/CreateTourPage/CreateTour.jsx'
import ListAllTour from '@/pages/Partner/ListAllTour/TourList.jsx'
import DetailTour from '@/pages/Partner/ListAllTour/DetailTour.jsx'
import EditTour from '@/pages/Partner/EditTour/EditTour.jsx'
import AdminDashboard from '@/pages/Admin/AdminDashboard/AdminDashboard.jsx'
import AdminBlogList from '@/pages/Admin/Blogs'
import AdminBlogDetail from '@/pages/Admin/Blogs/id'
import ReportDashboard from '@/pages/Admin/Report/ReportDashboard.jsx'
import AdminManagerUser from '@/pages/Admin/Users/UserManager.jsx'
import AdminTourList from '@/pages/Admin/ManagerTour/AdminTourList.jsx'
import AdminTourDetail from '@/pages/Admin/ManagerTour/AdminTourDetail.jsx'
import PlanAdminList from '@/pages/Admin/Plans'
import PartnershipPage from '@/pages/PartnershipPage'
import ForgotPassword from '@/pages/ForgotPasswordPage'
import PaymentHistory from '@/pages/PaymentHistory'
import { AuthProvider } from '@/AuthContext'

function Index() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/signin" element={<SignInPage />} />
                    <Route
                        path="/otp-verification"
                        element={<OtpVerification />}
                    />
                    <Route path="/view-Profile" element={<ViewProfilePage />} />
                    <Route path="/edit-Profile" element={<EditProfilePage />} />
                    <Route path="/about" element={<AboutPage />} />
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
                    <Route path="/blogs" element={<BlogList />} />
                    <Route path="/blogs/:id" element={<BlogDetail />} />
                    <Route path="/plans" element={<PlanList />} />
                    <Route path="/vnpay-callback" element={<VNPayCallback />} />
                    <Route
                        path="/tour-detail/:tourId"
                        element={<CustomerTourDetail />}
                    />
                    {/* Khu vực quản lý đối tác */}
                    <Route path="/partner" element={<PartnerDashboard />}>
                        <Route index element={<ListAllTour />} />
                        <Route path="listTour" element={<ListAllTour />} />
                        <Route
                            path="createTour"
                            element={<PartnerCreateTour />}
                        />
                        <Route
                            path="detailTour/:tourId"
                            element={<DetailTour />}
                        />
                        <Route path="edit/:tourId" element={<EditTour />} />
                    </Route>

                    {/* Khu vực quản lý admin */}
                    <Route path="/admin" element={<AdminDashboard />}>
                        <Route
                            index
                            element={<Navigate to="/admin/blogs" replace />}
                        />
                        <Route path="blogs" element={<AdminBlogList />} />
                        <Route path="blogs/:id" element={<AdminBlogDetail />} />
                        <Route
                            path="tours/pending"
                            element={<AdminTourList />}
                        />
                        <Route
                            path="tourDetail/:tourId"
                            element={<AdminTourDetail />}
                        />
                        <Route path="users" element={<AdminManagerUser />} />
                        <Route path="reports" element={<ReportDashboard />}>
                            <Route
                                index
                                element={
                                    <Navigate
                                        to="/admin/reports/revenue"
                                        replace
                                    />
                                }
                            />
                            <Route
                                path="revenue"
                                element={
                                    <ReportDashboard activeTab="revenue" />
                                }
                            />
                            <Route
                                path="partnerPerformance"
                                element={
                                    <ReportDashboard activeTab="partner" />
                                }
                            />
                            <Route
                                path="tourBookingStats"
                                element={<ReportDashboard activeTab="tour" />}
                            />
                        </Route>
                    </Route>
                    <Route path="/admin/plans" element={<PlanAdminList />} />
                    <Route path="/connect" element={<PartnershipPage />} />
                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />
                    <Route
                        path="/payment-history"
                        element={<PaymentHistory />}
                    />
                </Routes>
            </AuthProvider>
        </Router>
    )
}

export default Index
