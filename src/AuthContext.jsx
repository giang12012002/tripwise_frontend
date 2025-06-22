import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [username, setUsername] = useState('')
    const [userId, setUserId] = useState(null)

    useEffect(() => {
        // Kiểm tra dữ liệu auth trong localStorage khi component mount
        const initializeAuth = () => {
            const accessToken = localStorage.getItem('accessToken')
            const refreshToken = localStorage.getItem('refreshToken')
            const storedUserId = localStorage.getItem('userId')
            const storedAuth = localStorage.getItem('auth')

            if (accessToken && refreshToken && storedUserId && storedAuth) {
                try {
                    const parsedAuth = JSON.parse(storedAuth)
                    if (parsedAuth.isLoggedIn && parsedAuth.username) {
                        setIsLoggedIn(true)
                        setUsername(parsedAuth.username)
                        setUserId(storedUserId) // Khởi tạo userId từ localStorage
                    } else {
                        setIsLoggedIn(false)
                        setUsername('')
                        setUserId(null)
                    }
                } catch (error) {
                    console.error('Lỗi phân tích dữ liệu auth:', error)
                    setIsLoggedIn(false)
                    setUsername('')
                    setUserId(null)
                }
            } else {
                setIsLoggedIn(false)
                setUsername('')
                setUserId(null)
            }
        }

        initializeAuth()
    }, [])

    useEffect(() => {
        // Lưu trạng thái auth vào localStorage khi isLoggedIn hoặc username thay đổi
        if (isLoggedIn && username) {
            try {
                localStorage.setItem(
                    'auth',
                    JSON.stringify({ isLoggedIn, username })
                )
            } catch (error) {
                console.error('Lỗi lưu dữ liệu auth:', error)
            }
        }
    }, [isLoggedIn, username])

    const login = (username, id) => {
        setIsLoggedIn(true)
        setUsername(username)
        setUserId(id) // Thiết lập userId khi đăng nhập
    }

    const logout = () => {
        setIsLoggedIn(false)
        setUsername('')
        setUserId(null)
        clearAuthData()
    }

    const clearAuthData = () => {
        localStorage.removeItem('auth')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('userId')
        // Giữ deviceId để duy trì danh tính thiết bị
    }

    return (
        <AuthContext.Provider
            value={{ isLoggedIn, username, userId, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
