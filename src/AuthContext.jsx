import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [username, setUsername] = useState('')

    useEffect(() => {
        try {
            const storedAuth = localStorage.getItem('auth')
            if (storedAuth) {
                const parsedAuth = JSON.parse(storedAuth)
                if (parsedAuth.isLoggedIn && parsedAuth.username) {
                    setIsLoggedIn(true)
                    setUsername(parsedAuth.username)
                } else {
                    clearAuthData()
                }
            }
        } catch (error) {
            console.error('Lỗi phân tích dữ liệu auth:', error)
            clearAuthData()
        }
    }, [])

    useEffect(() => {
        try {
            if (isLoggedIn && username) {
                localStorage.setItem(
                    'auth',
                    JSON.stringify({ isLoggedIn, username })
                )
            } else {
                clearAuthData()
            }
        } catch (error) {
            console.error('Lỗi lưu dữ liệu auth:', error)
        }
    }, [isLoggedIn, username])

    const login = (username) => {
        setIsLoggedIn(true)
        setUsername(username)
    }

    const logout = () => {
        setIsLoggedIn(false)
        setUsername('')
        clearAuthData()
    }

    const clearAuthData = () => {
        localStorage.removeItem('auth')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('userId') // Clear userId as well
        // Keep deviceId to maintain device identity
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
