import { BrowserRouter as Router } from 'react-router-dom'
import authRoutes from './authRoutes.jsx'

function index() {
    return <Router>{authRoutes}</Router>
}

export default index
