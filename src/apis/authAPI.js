import authorizedAxios from './authorizedAxios'

const login = async (username, password, deviceId) => {
    return await authorizedAxios.post('/api/Authentication/login', {
        username,
        password,
        deviceId
    })
}

export default {
    login
}
