import React, { useEffect, useState } from 'react'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import { paymentAPI } from '@/apis'

function Index() {
    const [payments, setPayments] = useState([])
    const [filteredPayments, setFilteredPayments] = useState([])

    const [search, setSearch] = useState('')
    const [sortType, setSortType] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    const fetchPaymentHistory = async () => {
        try {
            const response = await paymentAPI.fetchPaymentHistory({
                status: 'success'
            })
            if (response.status === 200) {
                setPayments(response.data)
                setFilteredPayments(response.data)
            }

            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchPaymentHistory()
    }, [])

    useEffect(() => {
        let filtered = [...payments]

        if (search.trim()) {
            filtered = filtered.filter((p) =>
                p.orderCode.toLowerCase().includes(search.toLowerCase())
            )
        }

        if (sortType !== 'all') {
            filtered = filtered.filter((p) => p.orderCode.includes(sortType))
        }

        setFilteredPayments(filtered)
        setCurrentPage(1)
    }, [search, sortType, payments])

    const pageCount = Math.ceil(filteredPayments.length / itemsPerPage)
    const paginatedPayments = filteredPayments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-grow max-w-5xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Lịch sử thanh toán</h1>

                {/* Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo orderCode..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border px-3 py-2 rounded-md w-full sm:w-60"
                    />
                    <select
                        value={sortType}
                        onChange={(e) => setSortType(e.target.value)}
                        className="border px-3 py-2 rounded-md"
                    >
                        <option value="all">Tất cả</option>
                        <option value="plan">Theo Plan</option>
                        <option value="booking">Theo Booking</option>
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border border-gray-200 text-sm">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="p-3 border">Mã giao dịch</th>
                                <th className="p-3 border">Tên</th>
                                <th className="p-3 border">Số tiền</th>
                                <th className="p-3 border">Trạng thái</th>
                                <th className="p-3 border">Ngân hàng</th>
                                <th className="p-3 border">Ngày thanh toán</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedPayments.length > 0 ? (
                                paginatedPayments.map((item) => (
                                    <tr
                                        key={item.transactionId}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="p-3 border">
                                            {item.transactionId}
                                        </td>
                                        <td className="p-3 border">
                                            {item.planName === null ? (
                                                <a
                                                    href={`/tour-detail/${item.tourId}`}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {item.tourName}
                                                </a>
                                            ) : (
                                                item.planName
                                            )}
                                        </td>
                                        <td className="p-3 border">
                                            {item.amount.toLocaleString()}đ
                                        </td>
                                        <td className="p-3 border text-green-600">
                                            {item.paymentStatus}
                                        </td>
                                        <td className="p-3 border">
                                            {item.bankCode}
                                        </td>
                                        <td className="p-3 border">
                                            {new Date(
                                                item.paymentTime
                                            ).toLocaleString('vi-VN')}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="p-3 text-center text-gray-500"
                                    >
                                        Không có kết quả
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex justify-center items-center gap-2">
                    <button
                        className="px-3 py-1 border rounded disabled:opacity-50"
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        disabled={currentPage === 1}
                    >
                        Trước
                    </button>
                    <span>
                        Trang {currentPage} / {pageCount}
                    </span>
                    <button
                        className="px-3 py-1 border rounded disabled:opacity-50"
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        disabled={currentPage === pageCount}
                    >
                        Sau
                    </button>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default Index
