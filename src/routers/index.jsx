import { BrowserRouter as Router } from 'react-router-dom'
import authRoutes from './authRoutes.jsx'
import blogRoutes from './blogRoutes.jsx'

function index() {
    return (
        <Router>
            {authRoutes}
            {blogRoutes}
        </Router>
    )
}

export default index
