import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid' // Add uuid import
import beachSunset from '@/assets/images/background.png'
import { authAPI } from '@/apis'
import { toast } from 'react-toastify'
import { useAuth } from '@/AuthContext'

function SignIn() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const { login, isLoggedIn } = useAuth()

    // Generate or retrieve deviceId
    useEffect(() => {
        if (!localStorage.getItem('deviceId')) {
            localStorage.setItem('deviceId', uuidv4())
        }
    }, [])

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/')
        }
    }, [isLoggedIn, navigate])

    const togglePasswordVisibility = () => setShowPassword(!showPassword)

    const handleLogin = async () => {
        if (!email || !password) {
            toast.error('Vui lòng điền email và mật khẩu!')
            return
        }
        try {
            const deviceId = localStorage.getItem('deviceId')
            const response = await authAPI.login(email, password, deviceId)
            if (response.status === 200) {
                toast.success('Đăng nhập thành công!')
                const { AccessToken, RefreshToken, userId, username } =
                    response.data
                localStorage.setItem('accessToken', AccessToken)
                localStorage.setItem('refreshToken', RefreshToken)
                localStorage.setItem('deviceId', deviceId)
                if (userId) {
                    localStorage.setItem('userId', userId)
                }
                const user = username || email.split('@')[0]
                login(user)
                navigate('/')
            } else {
                toast.error(response.data.message || 'Đăng nhập thất bại.')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Đăng nhập thất bại.')
        }
    }

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const idToken = credentialResponse.credential
            const deviceId = localStorage.getItem('deviceId')
            const response = await authAPI.googleLogin(idToken, deviceId)
            if (response.status === 200) {
                toast.success('Đăng nhập bằng Google thành công!')
                const { AccessToken, RefreshToken, username } = response.data
                localStorage.setItem('accessToken', AccessToken)
                localStorage.setItem('refreshToken', RefreshToken)
                localStorage.setItem('deviceId', deviceId)
                const user = username || 'GoogleUser'
                login(user)
                navigate('/')
            } else {
                toast.error(response.data.message || 'Đăng nhập thất bại.')
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    'Đăng nhập bằng Google thất bại.'
            )
        }
    }

    useEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://accounts.google.com/gsi/client'
        script.async = true
        document.body.appendChild(script)

        script.onload = () => {
            window.google.accounts.id.initialize({
                client_id:
                    '792733748370-7t8rn2o35daj38von5v1ri0g1fcgpa3m.apps.googleusercontent.com',
                callback: handleGoogleLogin
            })

            window.google.accounts.id.renderButton(
                document.getElementById('googleSignInButton'),
                {
                    theme: 'outline',
                    size: 'large',
                    text: 'signin_with',
                    shape: 'rectangular'
                }
            )
        }

        return () => {
            document.body.removeChild(script)
        }
    }, [])

    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-white-50">
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-8 bg-white">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-blue-600 mb-2">
                            TRIPWISE
                        </h1>
                        <p className="text-lg mb-4">
                            ĐI KHẮP VIỆT NAM – MỖI CHUYẾN ĐI, MỘT PHẦN CỦA BẠN.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
                            />
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Mật Khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                                {showPassword ? (
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.977 9.977 0 011.663-3.854m3.854-3.854A10.05 10.05 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.977 9.977 0 01-1.663 3.854m-3.854 3.854L21 21m-6-6L9 9"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <button
                            type="submit"
                            onClick={handleLogin}
                            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-base hover:shadow-md cursor-pointer"
                        >
                            Đăng Nhập
                        </button>
                    </div>
                    <div id="googleSignInButton" className="w-full text-center">
                        <div
                            className="inline-block"
                            style={{ minWidth: '200px' }}
                        />
                    </div>
                    <p className="text-center text-gray-600 mt-4 text-sm">
                        Bạn Chưa Có Tài Khoản? Đăng Ký{' '}
                        <Link
                            to="/register"
                            className="text-blue-600 hover:underline"
                        >
                            Tại Đây
                        </Link>
                    </p>
                </div>
            </div>
            <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-8 bg-white-50">
                <div
                    className="relative w-full max-w-md md:max-w-2xl h-64 md:h-[500px] rounded-lg overflow-hidden shadow-lg bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${beachSunset})` }}
                />
            </div>
        </div>
    )
}

export default SignIn
