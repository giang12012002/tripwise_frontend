import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '@/AuthContext'
import { fetchRemainingRequests } from '@/stores/planSlice'
import userProfileAPI from '@/apis/userProfileAPI.js'
import Swal from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux'
import avatarImage from '@/assets/images/maleAvatar.png'
import logoImage from '/logo/logo-no-brand.png'

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
    const { isLoggedIn, username, logout, userId } = useAuth()
    const [avatar, setAvatar] = useState(avatarImage)
    const dispatch = useDispatch()
    const { remainingRequests } = useSelector((state) => state.plan)

    // Fetch user profile for avatar
    useEffect(() => {
        if (isLoggedIn && userId) {
            dispatch(fetchRemainingRequests(userId))
            const fetchProfile = async () => {
                try {
                    const response = await userProfileAPI.getProfile()
                    if (response.status === 200 && response.data?.avatar) {
                        setAvatar(response.data.avatar)
                    }
                } catch (err) {
                    console.error('Fetch profile error:', err)
                    setAvatar(avatarImage) // Fallback to default avatar
                }
            }
            fetchProfile()
        }
    }, [isLoggedIn, userId, dispatch])

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
                    className="text-2xl font-bold uppercase tracking-wide flex items-center"
                >
                    <img
                        src={logoImage}
                        alt="Tripwise Logo"
                        className="h-10 w-10 mr-2"
                    />
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
                            className="block hover:bg-blue-800 px-4 py-2 rounded transition-colors duration-200 text-base flex items-center"
                            onClick={() => setIsMenuOpen(false)}
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
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            Trang chủ
                        </Link>
                    </li>
                    {isLoggedIn && (
                        <li>
                            <Link
                                to="/user/mytour"
                                className="block hover:bg-blue-800 px-4 py-2 rounded transition-colors duration-200 text-base flex items-center"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <svg
                                    className="w-7 h-7 mr-2"
                                    viewBox="0 0 512 512"
                                    fill="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M332.56,155.12H179.44a24.35,24.35,0,0,0-24.32,24.31V332.56a24.34,24.34,0,0,0,24.32,24.31H332.56a24.34,24.34,0,0,0,24.32-24.31V179.43A24.35,24.35,0,0,0,332.56,155.12ZM343.5,332.56a11,11,0,0,1-10.94,10.94H179.44a11,11,0,0,1-10.94-10.94V179.43a11,11,0,0,1,10.94-10.94H332.56a11,11,0,0,1,10.94,10.94Z" />
                                    <path d="M260.13,277.31a4,4,0,0,0,.66-.64,6,6,0,0,0,1.55-4,6.89,6.89,0,0,0-1.25-3.93,6.38,6.38,0,0,0-3.77-2.59l-.27-.06-7-21.44q-2.4-7.14-4.26-13-2-6-3.8-10.31a32,32,0,0,0-4.05-7.12c-2.3-2.88-4.74-3.49-6.39-3.49-2.32,0-4.45,1.19-6.35,3.53a34.29,34.29,0,0,0-4.16,7.19q-1.95,4.31-4,10.19t-4.21,12.65l-15.92,49.37a7.69,7.69,0,0,0-.16,1.52,5.67,5.67,0,0,0,2.16,4.59,6.52,6.52,0,0,0,4,1.34c1.78,0,4.37-.66,6.6-3.8a3.09,3.09,0,0,0,.48-1l5.44-17.74h31.37L251.48,297a6.49,6.49,0,0,0,6.11,3.82c4,0,6.67-2.39,7-6.22a3.12,3.12,0,0,0-.11-1.18Zm-26.24-37q1.62,4.66,3.31,9.7l3.33,10.09c.57,1.73,1.1,3.41,1.61,5H220l11.1-32.85C231.94,234.71,232.85,237.39,233.89,240.33Z" />
                                    <path d="M298.9,271.5q.25-6.78.49-14.35l.8-27.13q.07-3.09.12-5.37l1.62.06c2.41.09,4.52.21,6.31.34,3.64.18,6.49-1.93,7-6.25a6.75,6.75,0,0,0-5.66-6.76c-1-.14-2.5-.3-4.58-.47-.79-.07-3.19-.27-22.77.23-6.91-.18-13.5.3-14.68,5-1,4.14.4,6.19,1.79,7.17a7.15,7.15,0,0,0,5.12,1.24,30.16,30.16,0,0,1,3.42-.22l6.73-.1,2.41,0c0,.6,0,1.25,0,2q0,3.45-.2,8l-1,28.19c-.34,8.43-.56,14.65-.69,18.62-.08,2.32-.15,4.35-.23,6.08q-8.89-.15-11.46-.15a7.73,7.73,0,0,0-3.79,1c-1.25.69-2.74,2.2-2.74,5.32-.08,1.75.52,4.94,5.36,6.6a3.53,3.53,0,0,0,1,.18l35.07.6a6.2,6.2,0,0,0,6.52-5.94,6.45,6.45,0,0,0-1.44-4.93,7.4,7.4,0,0,0-5.52-2.29l-9.8-.14q.18-1.92.3-4.41C298.57,280.05,298.74,276,298.9,271.5Z" />
                                    <path d="M430.25,234.08a6.69,6.69,0,0,0,0-13.38H390.08V176.87h40.17a6.69,6.69,0,1,0,0-13.38H389.52a46.84,46.84,0,0,0-41-41V81.76a6.69,6.69,0,1,0-13.38,0v40.15H291.29V81.76a6.69,6.69,0,1,0-13.37,0v40.15H234.08V81.76a6.69,6.69,0,1,0-13.37,0v40.15H176.87V81.76a6.69,6.69,0,1,0-13.38,0v40.71a46.84,46.84,0,0,0-41,41H81.75a6.69,6.69,0,0,0,0,13.38h40.17V220.7H81.75a6.69,6.69,0,1,0,0,13.38h40.17v43.83H81.75a6.69,6.69,0,0,0,0,13.38h40.17v43.84H81.75a6.69,6.69,0,1,0,0,13.37h40.73a46.83,46.83,0,0,0,41,41v40.72a6.69,6.69,0,1,0,13.38,0V390.08h43.84v40.16a6.69,6.69,0,1,0,13.37,0V390.08h43.84v40.16a6.69,6.69,0,1,0,13.37,0V390.08h43.84v40.16a6.69,6.69,0,1,0,13.38,0V389.52a46.83,46.83,0,0,0,41-41h40.73a6.69,6.69,0,1,0,0-13.37H390.08V291.29h40.17a6.69,6.69,0,0,0,0-13.38H390.08V234.08ZM376.71,343A33.75,33.75,0,0,1,343,376.7H169A33.75,33.75,0,0,1,135.29,343V169A33.76,33.76,0,0,1,169,135.29H343A33.76,33.76,0,0,1,376.71,169Z" />
                                </svg>
                                Tour AI của bạn
                            </Link>
                        </li>
                    )}
                    {isLoggedIn && (
                        <li>
                            <Link
                                to="/user/favoritetour"
                                className="block hover:bg-blue-800 px-4 py-2 rounded transition-colors duration-200 text-base flex items-center"
                                onClick={() => setIsMenuOpen(false)}
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
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                                Tour Yêu thích
                            </Link>
                        </li>
                    )}
                    <li>
                        <Link
                            to="/alltour"
                            className="block hover:bg-blue-800 px-4 py-2 rounded transition-colors duration-200 text-base flex items-center"
                            onClick={() => setIsMenuOpen(false)}
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
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                            Du lịch trọn gói
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/connect"
                            className="block hover:bg-blue-800 px-4 py-2 rounded transition-colors duration-200 text-base flex items-center"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <svg
                                className="w-8 h-8 mr-2"
                                fill="currentColor"
                                stroke="white"
                                strokeWidth="4"
                                viewBox="0 0 512 512"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M449.27,257.2H377a4.92,4.92,0,0,0-3.49,1.44l-9.28,9.27-59.33-59.32c13.8-.75,28.9-5.91,43.7-19.3a5,5,0,0,0-6.65-7.34c-16.52,15-33.33,18.22-47.66,16.64a4.93,4.93,0,0,0-2.31-.29c-20.19-3-34.93-15.17-36-16.05a5,5,0,0,0-6.69.27l-15.19,15.2c-11.47,11.48-31.47,11.51-43,0l-3.26-3.25,54.23-54.21a71.63,71.63,0,0,1,51-21.12H449.27a4.95,4.95,0,0,0,0-9.89H293.06q-3.46,0-6.88.29a5,5,0,0,0-1.64-.29H67.07a4.95,4.95,0,1,0,0,9.89H253.94a82.17,82.17,0,0,0-18.88,14.12L177.34,191a5,5,0,0,0-1.44,3.5,4.93,4.93,0,0,0,1.46,3.5l6.74,6.74a40.28,40.28,0,0,0,57,0l12.17-12.18c6.22,4.34,19.79,12.53,36.81,15.25L375.25,293a13.35,13.35,0,0,1,0,18.87,13.39,13.39,0,0,1-17.44,1.23c-.41-.48-.83-.95-1.28-1.4l-29.48-29.47a4.94,4.94,0,0,0-7,0l-.08.08-.09.08a5,5,0,0,0,0,7l29.49,29.48c.44.44.9.86,1.37,1.25a13.33,13.33,0,0,1-18.63,18.7c-.41-.48-.83-1-1.29-1.42l-29.47-29.47a5,5,0,0,0-7,0,.6.6,0,0,1-.08.08l-.09.09a5,5,0,0,0,0,7l29.47,29.47c.46.46.94.89,1.42,1.3a13.33,13.33,0,0,1-18.69,18.64c-.4-.47-.82-.94-1.27-1.39L297,355a4.86,4.86,0,0,0-1.21-.88l-16.65-16.65A23.19,23.19,0,0,0,254,308.71a23.16,23.16,0,0,0-25.7-25.7,23.19,23.19,0,0,0-6.63-19.07,23.44,23.44,0,0,0-19.1-6.45,23.22,23.22,0,0,0-39.48-19.28l-17.29,17.3-7.25-7.25a5,5,0,0,0-3.5-1.44H62.73a4.95,4.95,0,0,0,0,9.89H133l5.8,5.8-5.17,5.17a23.23,23.23,0,0,0,19.06,39.5,23.14,23.14,0,0,0,25.7,25.71,23.23,23.23,0,0,0,25.72,25.71,23.23,23.23,0,0,0,39.51,19.07l5.17-5.17L272.24,396a23.22,23.22,0,0,0,39.51-19.07,23.19,23.19,0,0,0,25.71-25.72,23.17,23.17,0,0,0,25.71-25.7A23.23,23.23,0,0,0,382.25,286L371.18,274.9l7.83-7.82h70.26a4.94,4.94,0,0,0,0-9.88ZM140.61,293.56h0a13.33,13.33,0,0,1,0-18.87l29.48-29.48a13.34,13.34,0,0,1,20.07,17.47c-.47.4-.93.81-1.37,1.25L159.31,293.4c-.44.45-.86.91-1.26,1.39A13.32,13.32,0,0,1,140.61,293.56Zm25.7,25.71a13.33,13.33,0,0,1-1.21-17.45c.47-.4.94-.82,1.38-1.26L196,271.08q.67-.68,1.29-1.41a13.33,13.33,0,0,1,18.65,18.68c-.48.41-1,.83-1.41,1.28L185,319.11c-.46.45-.89.93-1.3,1.42A13.31,13.31,0,0,1,166.31,319.27ZM192,345a13.33,13.33,0,0,1-1.24-17.42c.48-.41.95-.83,1.41-1.28l29.47-29.48c.46-.46.88-.93,1.3-1.42a13.33,13.33,0,0,1,18.62,18.7c-.47.4-.93.81-1.37,1.26l-29.48,29.47c-.45.45-.87.92-1.27,1.39A13.3,13.3,0,0,1,192,345Zm44.58,25.71a13.65,13.65,0,0,1-18.87,0h0a13.33,13.33,0,0,1-1.21-17.45c.47-.39.93-.81,1.37-1.25l29.47-29.48c.45-.44.87-.91,1.28-1.39a13.34,13.34,0,0,1,17.44,20.1ZM298.11,389a13.3,13.3,0,0,1-18.86,0l-4.18-4.17-19.29-19.29,17.3-17.3c.47-.48.92-1,1.34-1.48L298,370.27c.44.44.9.85,1.37,1.25A13.33,13.33,0,0,1,298.11,389Z"
                                    fill="currentColor"
                                    stroke="white"
                                    strokeWidth="4"
                                />
                            </svg>
                            Hợp tác với chúng tôi
                        </Link>
                    </li>

                    {isLoggedIn && (
                        <li title="Subscription plan">
                            <Link
                                to="/user/plans"
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
                                        strokeWidth="2"
                                        d="M3 10h18M7 15h1m4 0h1m4 0h1M3 6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6z"
                                    />
                                </svg>
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                    {remainingRequests}
                                </span>
                            </Link>
                        </li>
                    )}

                    {/* Profile/Avatar */}
                    <li className="relative">
                        {isLoggedIn ? (
                            <>
                                <button
                                    className="flex items-center space-x-2 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors duration-200"
                                    onClick={toggleProfileDropdown}
                                    aria-label="Toggle profile menu"
                                >
                                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-md">
                                        <img
                                            src={avatar}
                                            alt="User Avatar"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = avatarImage
                                            }}
                                        />
                                    </div>
                                    <span className="text-base font-medium">
                                        {username}
                                    </span>
                                </button>
                                {isProfileDropdownOpen && (
                                    <ul className="absolute top-full right-0 bg-white text-gray-800 rounded-xl shadow-xl mt-2 w-56 z-20 transform transition-all duration-200 ease-in-out">
                                        <li>
                                            <Link
                                                to="/user/view-Profile"
                                                className="block hover:bg-gray-100 px-4 py-3 rounded-t-xl text-base font-medium flex items-center"
                                                onClick={() => {
                                                    setIsMenuOpen(false)
                                                    setIsProfileDropdownOpen(
                                                        false
                                                    )
                                                }}
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
                                                Thông tin tài khoản
                                            </Link>
                                        </li>

                                        <li>
                                            <Link
                                                to="/user/HistoryItinerary"
                                                className="block hover:bg-gray-100 px-4 py-3 text-base font-medium flex items-center"
                                                onClick={() => {
                                                    setIsMenuOpen(false)
                                                    setIsProfileDropdownOpen(
                                                        false
                                                    )
                                                }}
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
                                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                Lịch sử hành trình AI
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/user/payment-history"
                                                className="block hover:bg-gray-100 px-4 py-3 text-base font-medium flex items-center"
                                                onClick={() => {
                                                    setIsMenuOpen(false)
                                                    setIsProfileDropdownOpen(
                                                        false
                                                    )
                                                }}
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
                                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                Lịch sử thanh toán
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/user/booking-history"
                                                className="block hover:bg-gray-100 px-4 py-3 text-base font-medium flex items-center"
                                                onClick={() => {
                                                    setIsMenuOpen(false)
                                                    setIsProfileDropdownOpen(
                                                        false
                                                    )
                                                }}
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
                                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                Lịch sử đặt chỗ
                                            </Link>
                                        </li>
                                        <li>
                                            <button
                                                className="block w-full text-left hover:bg-gray-100 px-4 py-3 rounded-b-xl text-base font-medium text-red-600 flex items-center"
                                                onClick={handleLogout}
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
                                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                    />
                                                </svg>
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
                                                className="block hover:bg-blue-800 px-4 py-2 rounded text-base flex items-center"
                                                onClick={() => {
                                                    setIsMenuOpen(false)
                                                    setIsProfileDropdownOpen(
                                                        false
                                                    )
                                                }}
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
                                                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                                    />
                                                </svg>
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
