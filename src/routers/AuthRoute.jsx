import { Navigate, Outlet } from 'react-router-dom'
import { usePermission } from '@/hooks/usePermission'
import { roles } from '@/utils/authConfig'
import { jwtDecode } from 'jwt-decode'

import { getRoleFromJwtCode } from '@/utils/user'

function AuthRoute({ requiredPermission, redirectTo = '/404' }) {
    const userRole = getRoleFromJwtCode()
    const { hasPermission } = usePermission(userRole)

    console.log('AuthRoute: userRole:', userRole)
    console.log('AuthRoute: requiredPermission:', requiredPermission)
    console.log('AuthRoute: hasPermission:', hasPermission(requiredPermission))

    if (!hasPermission(requiredPermission))
        return <Navigate to={redirectTo} replace={true} />

    return <Outlet />
}

export default AuthRoute
