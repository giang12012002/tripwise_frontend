import { Navigate, Outlet } from 'react-router-dom'
import { usePermission } from '@/hooks/usePermission'

import { getRoleFromJwtCode } from '@/utils/user'

function AuthRoute({ requiredPermission, redirectTo = '/404' }) {
    const userRole = getRoleFromJwtCode()
    const { hasPermission } = usePermission(userRole)

    if (!hasPermission(requiredPermission))
        return <Navigate to={redirectTo} replace={true} />

    return <Outlet />
}

export default AuthRoute
