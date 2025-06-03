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

const signup = async (
    email,
    username,
    password,
    confirmPassword,
    signupRequestId
) => {
    return await authorizedAxios.post('/authentication/signup', {
        email,
        username,
        password,
        confirmPassword,
        signupRequestId
    })
}

const verifyOtp = async (enteredOtp, userSignupData) => {
    return await authorizedAxios.post(
        `/authentication/verifyOtp/${enteredOtp}`,
        userSignupData
    )
}

export default {
    login,
    googleLogin,
    signup,
    verifyOtp
}
