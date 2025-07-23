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

const refreshToken = async (refreshToken, deviceId) => {
    return await authorizedAxios.post('/authentication/refresh-token', {
        refreshToken,
        deviceId
    })
}

const logout = async (deviceId) => {
    return await authorizedAxios.post(`/authentication/logout/${deviceId}`)
}

const forgotPassword = async ({ email }) => {
    return await authorizedAxios.post('/authentication/forgot-password', {
        email
    })
}

const verifyForgotOtp = async ({ email, enteredOtp }) => {
    return await authorizedAxios.post(
        `authentication/verify-forgot-otp?enteredOtp=${enteredOtp}`,
        { email }
    )
}

const resetPassword = async ({ email, newPassword }) => {
    return await authorizedAxios.post('/authentication/reset-password', {
        email,
        newPassword
    })
}

export default {
    login,
    googleLogin,
    signup,
    refreshToken,
    verifyOtp,
    logout,
    forgotPassword,
    verifyForgotOtp,
    resetPassword
}
