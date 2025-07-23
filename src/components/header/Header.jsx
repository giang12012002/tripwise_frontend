import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '@/AuthContext'
import Swal from 'sweetalert2'

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
    const { isLoggedIn, username, logout } = useAuth()

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
    const toggleProfileDropdown = () =>
        setIsProfileDropdownOpen(!isProfileDropdownOpen)

    const handleLogout = () => {
        logout()
        setIsMenuOpen(false)
        setIsProfileDropdownOpen(false)
        Swal.fire({
            icon: 'success',
            title: 'Thành công',
            text: 'Đăng xuất thành công!',
            showConfirmButton: false,
            timer: 1500
        })
    }

    return (
        <header className="bg-blue-700 text-white shadow-md">
            <nav className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                {/* Logo/Title */}
                <Link
                    to="/"
                    className="text-2xl font-bold uppercase tracking-wide"
                >
                    TRIPWISE
                </Link>

                {/* Hamburger Menu for Mobile */}
                <button
                    className="md:hidden focus:outline-none"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d={
                                isMenuOpen
                                    ? 'M6 18L18 6M6 6l12 12'
                                    : 'M4 6h16M4 12h16M4 18h16'
                            }
                        />
                    </svg>
                </button>

                {/* Menu Items */}
                <ul
                    className={`${
                        isMenuOpen ? 'flex' : 'hidden'
                    } md:flex flex-col md:flex-row items-center absolute md:static top-16 left-0 w-full md:w-auto bg-blue-700 md:bg-transparent z-10 md:z-auto space-y-2 md:space-y-0 md:space-x-6 p-4 md:p-0`}
                >
                    <li>
                        <Link
                            to="/"
                            className="block hover:bg-blue-800 px-4 py-2 rounded transition-colors duration-200 text-base"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Trang chủ
                        </Link>
                    </li>
                    {isLoggedIn && (
                        <li>
                            <Link
                                to="/mytour"
                                className="block hover:bg-blue-800 px-4 py-2 rounded transition-colors duration-200 text-base"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Yêu thích
                            </Link>
                        </li>
                    )}
                    <li>
                        <Link
                            to="/connect"
                            className="block hover:bg-blue-800 px-4 py-2 rounded transition-colors duration-200 text-base"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Hợp tác với chúng tôi
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/support"
                            className="block hover:bg-blue-800 px-4 py-2 rounded transition-colors duration-200 text-base"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Hỗ trợ
                        </Link>
                    </li>

                    {isLoggedIn && (
                        <li title="Subcription plan">
                            <Link
                                to="/plans"
                                className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-blue-800 transition-colors duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 10h18M7 15h1m4 0h1m4 0h1M3 6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6z"
                                    />
                                </svg>
                                {/* Badge (hiện tại là 0) */}
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                    0
                                </span>
                            </Link>
                        </li>
                    )}

                    {/* Profile Icon */}
                    <li className="relative">
                        {isLoggedIn ? (
                            <>
                                <button
                                    className="flex items-center hover:bg-blue-800 px-4 py-2 rounded transition-colors duration-200 text-base"
                                    onClick={toggleProfileDropdown}
                                    aria-label="Toggle profile menu"
                                >
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                    {username}
                                </button>
                                {isProfileDropdownOpen && (
                                    <ul className="absolute top-full right-0 bg-blue-700 text-white rounded shadow-md mt-2 w-48 z-20">
                                        <li>
                                            <Link
                                                to="/view-Profile"
                                                className="block hover:bg-blue-800 px-4 py-2 rounded text-base"
                                                onClick={() => {
                                                    setIsMenuOpen(false)
                                                    setIsProfileDropdownOpen(
                                                        false
                                                    )
                                                }}
                                            >
                                                Thông tin tài khoản
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/HistoryItinerary"
                                                className="block hover:bg-blue-800 px-4 py-2 rounded text-base"
                                                onClick={() => {
                                                    setIsMenuOpen(false)
                                                    setIsProfileDropdownOpen(
                                                        false
                                                    )
                                                }}
                                            >
                                                Lịch sử lịch trình AI
                                            </Link>
                                        </li>
                                        <li>
                                            <button
                                                className="block w-full text-left hover:bg-blue-800 px-4 py-2 rounded text-base"
                                                onClick={handleLogout}
                                            >
                                                Đăng xuất
                                            </button>
                                        </li>
                                    </ul>
                                )}
                            </>
                        ) : (
                            <>
                                <button
                                    className="flex items-center hover:bg-blue-800 px-4 py-2 rounded transition-colors duration-200 text-base"
                                    onClick={toggleProfileDropdown}
                                    aria-label="Toggle profile menu"
                                >
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                    Tài khoản
                                </button>
                                {isProfileDropdownOpen && (
                                    <ul className="absolute top-full right-0 bg-blue-700 text-white rounded shadow-md mt-2 w-48 z-20">
                                        <li>
                                            <Link
                                                to="/signin"
                                                className="block hover:bg-blue-800 px-4 py-2 rounded text-base"
                                                onClick={() => {
                                                    setIsMenuOpen(false)
                                                    setIsProfileDropdownOpen(
                                                        false
                                                    )
                                                }}
                                            >
                                                Đăng nhập
                                            </Link>
                                        </li>
                                    </ul>
                                )}
                            </>
                        )}
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header
