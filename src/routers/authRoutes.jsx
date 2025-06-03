import { Routes, Route } from 'react-router-dom'
import RegisterPage from '@/pages/RegisterPage/RegisterPage'
import SignInPage from '@/pages/SignInPage/SignInPage'

const authRoutes = (
    <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/" element={<SignInPage />} />
    </Routes>
)

export default authRoutes
