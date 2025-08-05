import { Navigate, Outlet } from 'react-router-dom'
import { usePermission } from '@/hooks/usePermission'
import { roles } from '@/utils/authConfig'
import { jwtDecode } from 'jwt-decode'

import { getRoleFromJwtCode } from '@/utils/user'

function AuthRoute({ requiredPermission, redirectTo = '/404' }) {
    // const token = localStorage.getItem('accessToken')
    // const user = jwtDecode(token)
    // const userRole =
    //     user['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']

    const userRole = getRoleFromJwtCode()
    const { hasPermission } = usePermission(userRole)

    if (!hasPermission(requiredPermission))
        return <Navigate to={redirectTo} replace={true} />

    return <Outlet />
}

export default AuthRoute
