import { Routes, Route } from 'react-router-dom'
import BlogList from '@/pages/BlogsPage'
import BlogDetail from '@/pages/BlogsPage/id'
import { AuthProvider } from '@/AuthContext'

const blogRoutes = (
    <AuthProvider>
        <Routes>
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
        </Routes>
    </AuthProvider>
)

export default blogRoutes
