import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RegisterPage from '@/pages/RegisterPage/index2.jsx'
import OtpVerification from '@/pages/RegisterPage/OtpVerification'
import SignInPage from '@/pages/SignInPage/index3.jsx'
import HomePage from '@/pages/HomePage/HomePage'
import ItineraryPage from '@/pages/ItineraryPage'
import CreateItineraryPage from '@/pages/CreateItineraryPage/index4.jsx'
import BlogList from '@/pages/BlogsPage'
import BlogDetail from '@/pages/BlogsPage/id'
import AdminBlogList from '@/pages/Admin/Blogs'
import AdminBlogDetail from '@/pages/Admin/Blogs/id'
import ItineraryDisplayHistory from '@/pages/ItineraryDisplayHistory/History'
import ItineraryDisplayHistoryDetail from '@/pages/ItineraryDisplayHistory/HistoryDetail'import MyTourPage from '@/pages/MyTourPage/index1.jsx'
import TourDetail from '@/pages/MyTourPage/TourDetail'
import PlanList from '@/pages/PlanPage'
import VNPayCallback from '@/components/callbacks/VNPayCallback'
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
                    <Route
                        path="/CreateItinerary"
                        element={<CreateItineraryPage />}
                    />
                    <Route path="/itinerary" element={<ItineraryPage />} />
                    <Route
                        path="/HistoryItinerary"
                        element={<ItineraryDisplayHistory />}
                    />
                    <Route
                        path="/HistoryItineraryDetail/:id"
                        element={<ItineraryDisplayHistoryDetail />}
                    />
                    <Route path="/myTour" element={<MyTourPage />} />
                    <Route path="/TourDetail/:id" element={<TourDetail />} />
                    <Route path="/blogs" element={<BlogList />} />
                    <Route path="/blogs/:id" element={<BlogDetail />} />
                    <Route path="/admin/blogs" element={<AdminBlogList />} />
                    <Route
                        path="/admin/blogs/:id"
                        element={<AdminBlogDetail />}
                    />
                    <Route path="/plans" element={<PlanList />} />
                    <Route path="/vnpay-callback" element={<VNPayCallback />} />
                </Routes>
            </AuthProvider>
        </Router>
    )
}

export default Index
