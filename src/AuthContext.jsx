import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [username, setUsername] = useState('')

    //Load auth state from localStorage on mount
    useEffect(() => {
        const storedAuth = localStorage.getItem('auth')
        if (storedAuth) {
            const { isLoggedIn, username } = JSON.parse(storedAuth)
            setIsLoggedIn(isLoggedIn)
            setUsername(username)
        }
    }, [])

    // Update localStorage whenever auth state changes
    useEffect(() => {
        localStorage.setItem('auth', JSON.stringify({ isLoggedIn, username }))
    }, [isLoggedIn, username])

    const login = (username) => {
        setIsLoggedIn(true)
        setUsername(username)
    }

    const logout = () => {
        setIsLoggedIn(false)
        setUsername('')
        localStorage.removeItem('auth')
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
