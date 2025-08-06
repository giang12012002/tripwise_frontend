export const roles = {
    admin: 'ADMIN',
    partner: 'PARTNER',
    user: 'USER'
}

export const permissions = {
    // user
    user: 'USER',

    // admin
    admin: 'ADMIN',

    // censor
    partner: 'PARTNER'
}

export const rolePermissions = {
    [roles.admin]: [permissions.admin],
    [roles.partner]: [permissions.partner],
    [roles.user]: [permissions.user]
}
