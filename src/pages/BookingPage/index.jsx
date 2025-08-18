import Footer from '@/components/footer/Footer'
import Header from '@/components/header/Header'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { paymentAPI } from '@/apis'

function Index() {
    const location = useLocation()
    const navigate = useNavigate()
    const [bookingData, setBookingData] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editedData, setEditedData] = useState(null)

    const handlePayment = async () => {
        try {
            const response = await paymentAPI.confirmAndPay({
                bookingId: bookingData.bookingId
            })
            if (response.status === 200) {
                localStorage.setItem('vnpay-redirect', '/user/payment-history')
                window.location.href = response.data.url
            }
        } catch (err) {
            console.log('Handle payment error', err)
            toast.error(err.response.data.message)
        }
    }

    // Hàm xử lý khi người dùng thay đổi dữ liệu trong input
    const handleEdit = (e) => {
        const { name, value } = e.target
        setEditedData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSave = async () => {
        try {
            const response = await paymentAPI.updateBookingRequest({
                bookingId: bookingData.bookingId,
                firstName: editedData.firstName,
                lastName: editedData.lastName,
                phoneNumber: editedData.phoneNumber,
                numAdults: parseInt(editedData.numAdults),
                numChildren5To10: parseInt(editedData.numChildren5To10),
                numChildrenUnder5: parseInt(editedData.numChildrenUnder5)
            })
            if (response.status === 200) {
                setBookingData((prevData) => ({
                    ...prevData,
                    ...response.data
                }))
                console.log('Updated data:', response.data)
                // setBookingData(response.data)
                // setEditedData(response.data)
                setIsEditing(false)
                toast.success('Cập nhật thông tin thành công!')
            }
        } catch (err) {
            console.log('Handle save error', err)
            toast.error(err.response.data.message)
        }
    }

    useEffect(() => {
        // Kiểm tra xem location.state có dữ liệu không
        if (location.state) {
            setBookingData(location.state)
            setEditedData(location.state) // Khởi tạo editedData với dữ liệu ban đầu
            console.log('Booking data:', location.state)
        } else {
            toast.error('Không tìm thấy thông tin đặt tour.')
            navigate('/')
        }
    }, [location, navigate])

    // Tránh render nếu bookingData chưa được set
    if (!bookingData) {
        return null
    }

    const renderGuestDetails = () => {
        const details = []

        if (bookingData.numAdults > 0) {
            details.push(
                <p key="adults">
                    <span className="font-medium">
                        {bookingData.numAdults} người lớn
                    </span>{' '}
                    x {bookingData.priceAdult.toLocaleString('vi-VN')} đ
                </p>
            )
        }
        if (bookingData.numChildren5To10 > 0) {
            details.push(
                <p key="children5-10">
                    <span className="font-medium">
                        {bookingData.numChildren5To10} trẻ em (5-10t)
                    </span>{' '}
                    x {bookingData.priceChild5To10.toLocaleString('vi-VN')} đ
                </p>
            )
        }
        if (bookingData.numChildrenUnder5 > 0) {
            details.push(
                <p key="children<5">
                    <span className="font-medium">
                        {bookingData.numChildrenUnder5} trẻ em (&lt;5t)
                    </span>{' '}
                    x {bookingData.priceChildUnder5.toLocaleString('vi-VN')} đ
                </p>
            )
        }

        return details
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
            <Header />
            <main className="flex-grow py-10">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Phần tiêu đề và thanh tiến trình */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-800">
                            ĐẶT TOUR
                        </h1>
                    </div>

                    {/* Phần nội dung chính: Chia làm 2 cột */}
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Cột trái */}
                        <div className="md:w-2/3 space-y-6">
                            {/* THÔNG TIN LIÊN LẠC */}
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="font-bold text-lg mb-4">
                                    THÔNG TIN LIÊN LẠC
                                </h2>
                                {isEditing ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                            <p className="text-sm text-gray-500">
                                                Họ
                                            </p>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={editedData.lastName}
                                                onChange={handleEdit}
                                                className="border rounded p-2"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-sm text-gray-500">
                                                Tên
                                            </p>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={editedData.firstName}
                                                onChange={handleEdit}
                                                className="border rounded p-2"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-sm text-gray-500">
                                                Email
                                            </p>
                                            <input
                                                type="email"
                                                name="userEmail"
                                                value={editedData.userEmail}
                                                className="border rounded p-2 bg-gray-100 text-gray-500 cursor-not-allowed focus:ring-0 focus:border-gray-300"
                                                readOnly
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-sm text-gray-500">
                                                Điện thoại
                                            </p>
                                            <input
                                                type="tel"
                                                name="phoneNumber"
                                                value={editedData.phoneNumber}
                                                onChange={handleEdit}
                                                className="border rounded p-2"
                                            />
                                        </div>
                                        {/* Nút Hủy và Lưu */}
                                        <div className="md:col-span-2 flex items-center justify-center gap-4 mt-4">
                                            <button
                                                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                                                onClick={() =>
                                                    setIsEditing(false)
                                                }
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                                                onClick={handleSave}
                                            >
                                                Lưu
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Họ tên
                                            </p>
                                            <p className="font-medium">
                                                {bookingData.lastName}{' '}
                                                {bookingData.firstName}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Email
                                            </p>
                                            <p className="font-medium">
                                                {bookingData.userEmail}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Điện thoại
                                            </p>
                                            <p className="font-medium">
                                                {bookingData.phoneNumber}
                                            </p>
                                        </div>
                                        {/* Nút Chỉnh sửa */}
                                        <div className="flex items-center justify-start mt-4">
                                            <button
                                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                                                onClick={() => {
                                                    setIsEditing(true)
                                                    setEditedData(bookingData)
                                                }}
                                            >
                                                Chỉnh sửa
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* SỐ LƯỢNG KHÁCH */}
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="font-bold text-lg mb-4">
                                    SỐ LƯỢNG KHÁCH
                                </h2>
                                {isEditing ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="flex flex-col">
                                            <p className="text-sm text-gray-500">
                                                Người lớn
                                            </p>
                                            <input
                                                type="number"
                                                name="numAdults"
                                                value={editedData.numAdults}
                                                onChange={handleEdit}
                                                className="border rounded p-2"
                                                min="0"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-sm text-gray-500">
                                                Trẻ em (5-10t)
                                            </p>
                                            <input
                                                type="number"
                                                name="numChildren5To10"
                                                value={
                                                    editedData.numChildren5To10
                                                }
                                                onChange={handleEdit}
                                                className="border rounded p-2"
                                                min="0"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-sm text-gray-500">
                                                Trẻ em (&lt;5t)
                                            </p>
                                            <input
                                                type="number"
                                                name="numChildrenUnder5"
                                                value={
                                                    editedData.numChildrenUnder5
                                                }
                                                onChange={handleEdit}
                                                className="border rounded p-2"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-y-2">
                                        <p className="text-sm text-gray-500">
                                            Chi tiết:
                                        </p>
                                        <div className="font-medium text-sm space-y-1">
                                            {renderGuestDetails()}
                                        </div>

                                        <hr className="border-t border-gray-300 my-4 col-span-2" />

                                        <p className="text-sm text-gray-500">
                                            Tổng cộng
                                        </p>
                                        <div className="font-medium text-lg space-y-1">
                                            {bookingData.amount.toLocaleString(
                                                'vi-VN'
                                            )}{' '}
                                            đ
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* CHI TIẾT BOOKING */}
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="font-bold text-lg mb-4">
                                    CHI TIẾT BOOKING
                                </h2>
                                <div className="grid grid-cols-2 gap-y-2">
                                    <p className="text-sm text-gray-500">
                                        Mã đặt chỗ:
                                    </p>
                                    <p className="font-medium">
                                        {bookingData.orderCode}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        Ngày tạo:
                                    </p>
                                    <p className="font-medium">
                                        {new Date(
                                            bookingData.createdDate
                                        ).toLocaleString('vi-VN')}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        Trị giá booking:
                                    </p>
                                    <p className="font-medium">
                                        {bookingData.amount.toLocaleString(
                                            'vi-VN'
                                        )}{' '}
                                        đ
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        Ngày hết hạn:
                                    </p>
                                    <p className="font-medium text-red-500">
                                        {new Date(
                                            bookingData.expiredDate
                                        ).toLocaleString('vi-VN')}
                                    </p>
                                </div>
                            </div>

                            {/* DANH SÁCH KHÁCH HÀNG */}
                            <div className="bg-white p-6 rounded-lg shadow-md hidden">
                                <h2 className="font-bold text-lg mb-4">
                                    DANH SÁCH KHÁCH HÀNG
                                </h2>
                                {/* Hiển thị thông tin khách hàng nếu có */}
                            </div>
                        </div>

                        {/* Cột phải */}
                        <div className="md:w-1/3 space-y-6">
                            {/* PHIẾU XÁC NHẬN BOOKING */}
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="font-bold text-lg mb-4">
                                    PHIẾU XÁC NHẬN BOOKING
                                </h2>
                                <div className="border-b pb-4 mb-4">
                                    {/* Hiển thị ảnh từ bookingData.image với kích thước cố định */}
                                    <img
                                        src={bookingData.image}
                                        alt="Tour"
                                        className="w-full h-48 object-cover rounded-lg mb-2"
                                    />
                                    {/* Hiển thị các thông tin khác của tour */}
                                </div>
                                {/* Hiển thị thông tin booking */}
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Mã booking:
                                        </p>
                                        <p className="font-medium">
                                            {bookingData.orderCode}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Tên tour:
                                        </p>
                                        <p className="font-medium">
                                            {bookingData.tourName}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* Nút thanh toán */}
                            <button
                                className="w-full bg-red-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-red-700 transition-colors"
                                onClick={handlePayment}
                            >
                                Thanh toán ngay
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default Index
