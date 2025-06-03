import authorizedAxios from './authorizedAxios'

const login = async (email, password, deviceId) => {
    return await authorizedAxios.post('/authentication/login', {
        email,
        password,
        deviceId
    })
}

const googleLogin = async (idToken, deviceId) => {
    return await authorizedAxios.post('/authentication/google-login', {
        idToken,
        deviceId
    })
}

export default {
    login,
    googleLogin
}
