import authorizedAxios from './authorizedAxios'

const login = async (email, password, deviceId) => {
    return await authorizedAxios.post('/authentication/login', {
        email,
        password,
        deviceId
    })
}

export default {
    login
}
