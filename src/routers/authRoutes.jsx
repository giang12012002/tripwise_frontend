import { Routes, Route } from 'react-router-dom'
import RegisterPage from '@/pages/RegisterPage/RegisterPage'
import SignInPage from '@/pages/SignInPage/SignInPage'
import HomePage from '@/pages/HomePage/HomePage'
import { AuthProvider } from '@/AuthContext'
const authRoutes = (
    <AuthProvider>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/signin" element={<SignInPage />} />
        </Routes>
    </AuthProvider>
)

export default authRoutes
