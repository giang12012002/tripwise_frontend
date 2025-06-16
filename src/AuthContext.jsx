import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [username, setUsername] = useState('')

    // Load auth state from localStorage on mount
    useEffect(() => {
        console.log('Checking localStorage for auth data...')
        try {
            const storedAuth = localStorage.getItem('auth')
            if (storedAuth) {
                const parsedAuth = JSON.parse(storedAuth)
                console.log('Parsed auth data:', parsedAuth)
                if (parsedAuth.isLoggedIn && parsedAuth.username) {
                    setIsLoggedIn(true)
                    setUsername(parsedAuth.username)
                    console.log(
                        'Restored auth state: isLoggedIn=true, username=',
                        parsedAuth.username
                    )
                } else {
                    console.log(
                        'Invalid auth data in localStorage, resetting...'
                    )
                    localStorage.removeItem('auth')
                }
            } else {
                console.log('No auth data found in localStorage')
            }
        } catch (error) {
            console.error('Error parsing auth data from localStorage:', error)
            localStorage.removeItem('auth')
        }
    }, [])

    // Update localStorage whenever auth state changes
    useEffect(() => {
        console.log(
            'Saving auth state to localStorage: isLoggedIn=',
            isLoggedIn,
            'username=',
            username
        )
        try {
            if (isLoggedIn && username) {
                localStorage.setItem(
                    'auth',
                    JSON.stringify({ isLoggedIn, username })
                )
                console.log('Auth state saved to localStorage')
            } else {
                localStorage.removeItem('auth')
                console.log('Auth state cleared from localStorage')
            }
        } catch (error) {
            console.error('Error saving auth data to localStorage:', error)
        }
    }, [isLoggedIn, username])

    const login = (username) => {
        console.log('Logging in user:', username)
        setIsLoggedIn(true)
        setUsername(username)
    }

    const logout = () => {
        console.log('Logging out user')
        setIsLoggedIn(false)
        setUsername('')
        try {
            localStorage.removeItem('auth')
            console.log('Auth data removed from localStorage')
        } catch (error) {
            console.error('Error removing auth data from localStorage:', error)
        }
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
