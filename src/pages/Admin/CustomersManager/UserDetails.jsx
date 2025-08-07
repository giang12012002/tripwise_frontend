import React, { useState } from 'react'

const UserDetails = ({
    user,
    updateForm,
    setUpdateForm,
    onUpdate,
    onClose
}) => {
    const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState(false)

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
        <>
            {/* User Details Popup */}
            <div
                className="fixed inset-0 flex justify-center items-center z-50 transition-opacity duration-300"
                onClick={onClose}
                role="dialog"
                aria-modal="true"
                aria-labelledby="user-details-modal-title"
            >
                <div
                    className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200 max-w-3xl w-full m-4 transform transition-all duration-300 scale-100 ring-2 ring-blue-200 ring-opacity-50"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2
                        id="user-details-modal-title"
                        className="text-2xl font-bold text-gray-800 mb-6 tracking-tight"
                    >
                        Chi tiết người dùng
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    ID:
                                </strong>{' '}
                                {user.userId}
                            </p>
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    Tên tài khoản :
                                </strong>{' '}
                                {user.userName}
                            </p>
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    Email:
                                </strong>{' '}
                                {user.email}
                            </p>
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    Họ:
                                </strong>{' '}
                                {user.firstName}
                            </p>
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    Tên:
                                </strong>{' '}
                                {user.lastName}
                            </p>
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    Số điện thoại:
                                </strong>{' '}
                                {user.phoneNumber || 'Không có'}
                            </p>
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    Quốc gia:
                                </strong>{' '}
                                {user.country || 'Không có'}
                            </p>
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    Thành phố:
                                </strong>{' '}
                                {user.city || 'Không có'}
                            </p>
                        </div>
                        <div className="space-y-4">
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    Phường:
                                </strong>{' '}
                                {user.ward || 'Không có'}
                            </p>
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    Quận:
                                </strong>{' '}
                                {user.district || 'Không có'}
                            </p>
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    Địa chỉ:
                                </strong>{' '}
                                {user.streetAddress || 'Không có'}
                            </p>
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    Trạng thái:
                                </strong>{' '}
                                <span
                                    className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                                        user.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}
                                >
                                    {user.isActive
                                        ? 'Hoạt động'
                                        : 'Không hoạt động'}
                                </span>
                            </p>
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    Gói hiện tại:
                                </strong>{' '}
                                {user.currentPlanName || 'Không có'}
                            </p>
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    Ngày tạo:
                                </strong>{' '}
                                {formatDate(user.createdDate)}
                            </p>
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    Tạo bởi:
                                </strong>{' '}
                                {user.createdByName ||
                                    user.createdBy ||
                                    'Không có'}
                            </p>
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    Ngày sửa:
                                </strong>{' '}
                                {formatDate(user.modifiedDate)}
                            </p>
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    Sửa bởi:
                                </strong>{' '}
                                {user.modifiedByName ||
                                    user.modifiedBy ||
                                    'Không có'}
                            </p>
                        </div>
                    </div>
                    {!user.isActive && (
                        <div className="mb-6 space-y-4">
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    Ngày xóa:
                                </strong>{' '}
                                {formatDate(user.removedDate)}
                            </p>
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    Xóa bởi:
                                </strong>{' '}
                                {user.removedByName ||
                                    user.removedBy ||
                                    'Không có'}
                            </p>
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    Lý do xóa:
                                </strong>{' '}
                                {user.removedReason || 'Không có'}
                            </p>
                        </div>
                    )}
                    <div className="flex justify-end space-x-4">
                        {user.isActive && (
                            <button
                                onClick={() => setIsUpdatePopupOpen(true)}
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md font-semibold"
                            >
                                Cập nhật thông tin
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition duration-200 shadow-md font-semibold"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>

            {/* Update Form Popup */}
            {isUpdatePopupOpen && user.isActive && (
                <div
                    className="fixed inset-0 flex justify-center items-center z-[60] transition-opacity duration-300"
                    onClick={() => setIsUpdatePopupOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="update-user-modal-title"
                >
                    <div
                        className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200 max-w-3xl w-full m-4 max-h-[80vh] overflow-y-auto transform transition-all duration-300 scale-100 ring-2 ring-blue-200 ring-opacity-50"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3
                            id="update-user-modal-title"
                            className="text-2xl font-bold text-gray-800 mb-6 tracking-tight"
                        >
                            Cập nhật thông tin
                        </h3>
                        <form onSubmit={onUpdate} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block mb-1 text-sm font-semibold text-gray-700">
                                        Họ
                                    </label>
                                    <input
                                        type="text"
                                        value={updateForm.firstName}
                                        onChange={(e) =>
                                            setUpdateForm({
                                                ...updateForm,
                                                firstName: e.target.value
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-semibold text-gray-700">
                                        Tên
                                    </label>
                                    <input
                                        type="text"
                                        value={updateForm.lastName}
                                        onChange={(e) =>
                                            setUpdateForm({
                                                ...updateForm,
                                                lastName: e.target.value
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-semibold text-gray-700">
                                        Tên tài khoản
                                    </label>
                                    <input
                                        type="text"
                                        value={updateForm.userName}
                                        onChange={(e) =>
                                            setUpdateForm({
                                                ...updateForm,
                                                userName: e.target.value
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-semibold text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={updateForm.email}
                                        onChange={(e) =>
                                            setUpdateForm({
                                                ...updateForm,
                                                email: e.target.value
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-semibold text-gray-700">
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="text"
                                        value={updateForm.phoneNumber}
                                        onChange={(e) =>
                                            setUpdateForm({
                                                ...updateForm,
                                                phoneNumber: e.target.value
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-semibold text-gray-700">
                                        Quốc gia
                                    </label>
                                    <input
                                        type="text"
                                        value={updateForm.country}
                                        onChange={(e) =>
                                            setUpdateForm({
                                                ...updateForm,
                                                country: e.target.value
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-semibold text-gray-700">
                                        Thành phố
                                    </label>
                                    <input
                                        type="text"
                                        value={updateForm.city}
                                        onChange={(e) =>
                                            setUpdateForm({
                                                ...updateForm,
                                                city: e.target.value
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-semibold text-gray-700">
                                        Phường
                                    </label>
                                    <input
                                        type="text"
                                        value={updateForm.ward}
                                        onChange={(e) =>
                                            setUpdateForm({
                                                ...updateForm,
                                                ward: e.target.value
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-semibold text-gray-700">
                                        Quận
                                    </label>
                                    <input
                                        type="text"
                                        value={updateForm.district}
                                        onChange={(e) =>
                                            setUpdateForm({
                                                ...updateForm,
                                                district: e.target.value
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-semibold text-gray-700">
                                        Địa chỉ
                                    </label>
                                    <input
                                        type="text"
                                        value={updateForm.streetAddress}
                                        onChange={(e) =>
                                            setUpdateForm({
                                                ...updateForm,
                                                streetAddress: e.target.value
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end mt-8 space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setIsUpdatePopupOpen(false)}
                                    className="bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition duration-200 shadow-md font-semibold"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md font-semibold"
                                >
                                    Cập nhật
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default UserDetails
