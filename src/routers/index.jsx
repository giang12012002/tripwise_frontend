import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RegisterPage from '@/pages/RegisterPage/RegisterPage'
import SignInPage from '@/pages/SignInPage/SignInPage'
import HomePage from '@/pages/HomePage/HomePage'
import ItineraryPage from '@/pages/ItineraryPage/ItineraryPage'
import TravelFormPage from '@/pages/TravelFormPage/TravelFormPage'
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
                </Routes>
            </AuthProvider>
        </Router>
    )
}

export default Index
