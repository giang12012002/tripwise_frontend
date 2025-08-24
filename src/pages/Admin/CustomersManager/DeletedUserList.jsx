import React from 'react'

const DeletedUserList = ({ users, onViewUserDetail, onActivateUser }) => {
    // Helper function to format date to DD/MM/YYYY
    const formatDate = (dateString) => {
        if (!dateString) return 'Không có'
        try {
            const date = new Date(dateString)
            if (isNaN(date.getTime())) return 'Không hợp lệ'
            const day = String(date.getDate()).padStart(2, '0')
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const year = date.getFullYear()
            return `${day}/${month}/${year}`
        } catch {
            return 'Không hợp lệ'
        }
    }

    return (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                Tên Tài Khoản
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                Vai trò
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                Ngày vô hiệu hóa
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user, index) => (
                            <tr
                                key={user.userId}
                                className={`transition duration-150 hover:bg-gray-50 ${
                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                                }`}
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {user.userId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <svg
                                                className="h-10 w-10 text-gray-300 rounded-full bg-blue-100 p-1"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.userName}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {user.role === 'USER'
                                        ? 'Khách hàng'
                                        : user.role === 'ADMIN'
                                          ? 'Quản trị viên'
                                          : user.role || 'Không xác định'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                        Không hoạt động
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatDate(user.removedDate)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button
                                        onClick={() =>
                                            onViewUserDetail(user.userId)
                                        }
                                        className="text-blue-600 hover:text-blue-800 mr-4 transition duration-200"
                                        aria-label="Xem chi tiết"
                                    >
                                        <svg
                                            className="h-6 w-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() =>
                                            onActivateUser(user.userId)
                                        }
                                        className="text-green-600 hover:text-green-800 transition duration-200"
                                        aria-label="Kích hoạt người dùng"
                                    >
                                        <svg
                                            className="h-6 w-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DeletedUserList
