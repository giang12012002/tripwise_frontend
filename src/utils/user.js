import { jwtDecode } from 'jwt-decode'

const getRoleFromJwtCode = () => {
    const token = localStorage.getItem('accessToken')
    let userRole = null
    if (token) {
        const user = jwtDecode(token)
        userRole =
            user['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
    }

    return userRole
}

export { getRoleFromJwtCode }
