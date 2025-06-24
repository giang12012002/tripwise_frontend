import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RegisterPage from '@/pages/RegisterPage/RegisterPage'
import SignInPage from '@/pages/SignInPage/SignInPage'
import HomePage from '@/pages/HomePage/HomePage'
import ItineraryPage from '@/pages/ItineraryPage/ItineraryPage'
import TravelFormPage from '@/pages/TravelFormPage/TravelFormPage'
import BlogList from '@/pages/BlogsPage'
import BlogDetail from '@/pages/BlogsPage/id'
import AdminBlogList from '@/pages/Admin/Blogs'
import AdminBlogDetail from '@/pages/Admin/Blogs/id'
import MyTourPage from '@/pages/MyTourPage/MyTourPage'
import PlanList from '@/pages/PlanPage'
import { AuthProvider } from '@/AuthContext'

function Index() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/signin" element={<SignInPage />} />
                    <Route path="/TravelForm" element={<TravelFormPage />} />
                    <Route path="/itinerary" element={<ItineraryPage />} />
                    <Route path="/myTour" element={<MyTourPage />} />
                    <Route path="/blogs" element={<BlogList />} />
                    <Route path="/blogs/:id" element={<BlogDetail />} />
                    <Route path="/admin/blogs" element={<AdminBlogList />} />
                    <Route
                        path="/admin/blogs/:id"
                        element={<AdminBlogDetail />}
                    />
                    <Route path="/plans" element={<PlanList />} />
                </Routes>
            </AuthProvider>
        </Router>
    )
}

export default Index
