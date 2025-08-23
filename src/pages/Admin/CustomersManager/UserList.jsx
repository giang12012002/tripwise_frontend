import React from 'react'
import Swal from 'sweetalert2'

const UserList = ({
    users,
    deleteReasons,
    setDeleteReasons,
    onViewUserDetail,
    onDeleteUser
}) => {
    const handleDeleteClick = async (userId, userName) => {
        const inputResult = await Swal.fire({
            title: 'Vô hiệu hóa người dùng ' + userName,
            text: `Nhập lý do:`,
            input: 'text',
            inputPlaceholder: 'Lý do',
            inputAttributes: {
                autocapitalize: 'off',
                autocorrect: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Tiếp tục',
            cancelButtonText: 'Hủy',
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#6b7280',
            inputValidator: (value) => {
                if (!value.trim()) {
                    return 'Vui lòng nhập lý do'
                }
            }
        })

        if (inputResult.isConfirmed && inputResult.value) {
            const reason = inputResult.value.trim()
            setDeleteReasons((prev) => ({
                ...prev,
                [userId]: reason
            }))

            const confirmResult = await Swal.fire({
                icon: 'warning',
                title: 'Xác nhận vô hiệu hoá',
                text: `Bạn có chắc muốn vô hiệu hóa người dùng "${userName}"? Lý do: ${reason}`,
                showCancelButton: true,
                confirmButtonColor: '#2563eb',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Có',
                cancelButtonText: 'Hủy'
            })

            if (confirmResult.isConfirmed) {
                try {
                    await onDeleteUser(userId, reason)
                    setDeleteReasons((prev) => {
                        const newReasons = { ...prev }
                        delete newReasons[userId]
                        return newReasons
                    })
                } catch (err) {
                    // Error handling is managed in the parent component
                }
            }
        }
    }

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tên Tài Khoản
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Vai trò
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user, index) => (
                            <tr
                                key={user.userId}
                                className={
                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                }
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {user.userId}
                                    </div>
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
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {user.email}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {user.role === 'USER'
                                            ? 'Khách hàng'
                                            : user.role || 'Không xác định'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            user.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {user.isActive
                                            ? 'Hoạt động'
                                            : 'Không hoạt động'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <button
                                        onClick={() =>
                                            onViewUserDetail(user.userId)
                                        }
                                        className="text-blue-600 hover:text-blue-900 mr-2"
                                        aria-label="Xem chi tiết"
                                    >
                                        <svg
                                            className="h-5 w-5"
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
                                            handleDeleteClick(
                                                user.userId,
                                                user.userName
                                            )
                                        }
                                        className="text-red-600 hover:text-red-900"
                                        aria-label="Xóa người dùng"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            class="size-6"
                                            className="h-5 w-5"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
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

export default UserList
