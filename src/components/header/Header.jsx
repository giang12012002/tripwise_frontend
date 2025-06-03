import { Link } from 'react-router-dom'
import { useState } from 'react'

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    return (
        <header className="bg-blue-700 text-white shadow-md">
            <nav className="flex items-center justify-between h-16 px-4 md:px-20">
                {/* Logo/Title */}
                <Link
                    to="/"
                    className="text-xl font-bold uppercase tracking-wider"
                >
                    TRIPWISE
                </Link>

                {/* Nút hamburger cho di động */}
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
                    } md:flex flex-col md:flex-row items-center absolute md:static top-16 left-0 w-full md:w-auto bg-blue-700 md:bg-transparent space-y-4 md:space-y-0 md:space-x-6 py-4 md:p-0`}
                >
                    <li>
                        <Link
                            to="/"
                            className="block hover:bg-blue-800 px-3 py-2 rounded transition-colors duration-200"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Trang chủ
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/packages"
                            className="block hover:bg-blue-800 px-3 py-2 rounded transition-colors duration-200"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Du lịch trọn gói
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/collaborate"
                            className="block hover:bg-blue-800 px-3 py-2 rounded transition-colors duration-200"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Hợp tác với chúng tôi
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/support"
                            className="block hover:bg-blue-800 px-3 py-2 rounded transition-colors duration-200"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Hỗ trợ
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/authen"
                            className="block hover:bg-blue-800 px-3 py-2 rounded transition-colors duration-200"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Đăng nhập/Đăng ký
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/profile"
                            className="flex items-center hover:bg-blue-800 px-3 py-2 rounded transition-colors duration-200"
                            onClick={() => setIsMenuOpen(false)}
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
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}
export default Header
