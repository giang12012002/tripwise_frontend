export const roles = {
    admin: 'ADMIN',
    partner: 'PARTNER',
    customer: 'CUSTOMER'
}

export const permissions = {
    // customer
    customer: 'CUSTOMER',

    // admin
    admin: 'ADMIN',

    // censor
    partner: 'PARTNER'
}

export const rolePermissions = {
    [roles.admin]: [permissions.admin],
    [roles.partner]: [permissions.partner],
    [roles.customer]: [permissions.customer]
}
