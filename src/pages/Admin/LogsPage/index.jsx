import React, { useEffect, useState } from 'react'
import { logAPI } from '@/apis'

function Index() {
    const [logs, setLogs] = useState([])
    const [filteredLogs, setFilteredLogs] = useState([])
    const [actionFilter, setActionFilter] = useState('')
    const [userNameFilter, setUserNameFilter] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const logsPerPage = 10

    const getLogs = async () => {
        try {
            const res = await logAPI.get({ page: 1, pageSize: 1000 })
            if (res.status === 200) {
                setLogs(res.data.data)
            }
        } catch (error) {
            console.error('Error fetching logs:', error)
        }
    }

    useEffect(() => {
        getLogs()
    }, [])

    useEffect(() => {
        let filtered = logs

        if (actionFilter) {
            filtered = filtered.filter((log) => log.action === actionFilter)
        }

        if (userNameFilter.trim()) {
            filtered = filtered.filter((log) =>
                log.userName
                    ?.toLowerCase()
                    .includes(userNameFilter.toLowerCase())
            )
        }

        setFilteredLogs(filtered)
        setCurrentPage(1)
    }, [logs, actionFilter, userNameFilter])

    const totalPages = Math.ceil(filteredLogs.length / logsPerPage)
    const currentLogs = filteredLogs.slice(
        (currentPage - 1) * logsPerPage,
        currentPage * logsPerPage
    )

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1)
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1)
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const uniqueActions = [...new Set(logs.map((log) => log.action))]

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Tiêu đề */}
            <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                Logs
            </h1>

            {/* Bộ lọc */}
            <div className="flex gap-4 mb-4 flex-wrap">
                <select
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                    className="px-4 py-2 border rounded"
                >
                    <option value="">-- Lọc theo Action --</option>
                    {uniqueActions.map((action) => (
                        <option key={action} value={action}>
                            {action}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Lọc theo User Name..."
                    value={userNameFilter}
                    onChange={(e) => setUserNameFilter(e.target.value)}
                    className="px-4 py-2 border rounded w-64"
                />
            </div>

            {/* Bảng logs */}
            {currentLogs.length > 0 ? (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600 uppercase text-xs text-center">
                                <tr>
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Mã người dùng</th>
                                    <th className="px-6 py-3">
                                        Tên người dùng
                                    </th>
                                    <th className="px-6 py-3">Hành động</th>
                                    <th className="px-6 py-3">Mã</th>
                                    <th className="px-6 py-3">Nội dung</th>
                                    <th className="px-6 py-3">Thời gian</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 text-center">
                                {currentLogs.map((log, index) => (
                                    <tr
                                        key={log.id}
                                        className={
                                            index % 2 === 0
                                                ? 'bg-white'
                                                : 'bg-gray-50'
                                        }
                                    >
                                        <td className="px-6 py-4">{log.id}</td>
                                        <td className="px-6 py-4">
                                            {log.userId}
                                        </td>
                                        <td className="px-6 py-4">
                                            {log.userName}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${
                                                    log.statusCode >= 200 &&
                                                    log.statusCode < 300
                                                        ? 'bg-green-100 text-green-600'
                                                        : 'bg-red-100 text-red-600'
                                                }`}
                                            >
                                                {log.statusCode}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {log.message}
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(
                                                log.dateTime
                                            ).toLocaleString('vi-VN')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="text-center p-8 bg-white shadow rounded">
                    <p className="text-gray-600">Không có log phù hợp.</p>
                </div>
            )}

            {/* Phân trang */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 gap-3">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Trước
                    </button>

                    <div className="flex items-center gap-2">
                        <span>Trang</span>
                        <input
                            type="number"
                            min={1}
                            max={totalPages}
                            value={currentPage}
                            onChange={(e) => {
                                const page = Number(e.target.value)
                                if (page >= 1 && page <= totalPages) {
                                    handlePageChange(page)
                                }
                            }}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                        />
                        <span>trong {totalPages}</span>
                    </div>

                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Sau
                    </button>
                </div>
            )}
        </div>
    )
}

export default Index
