import { rolePermissions } from '@/utils/authConfig'

export const usePermission = (role) => {
    const hasPermission = (permission) => {
        const allowedPermissions = rolePermissions[role] || []
        return allowedPermissions.includes(permission)
    }

    return { hasPermission }
}

// // Cách sử dụng

// import { usePermission }
// import {permissions}

// const {hasPermission} = usePermission(role)
