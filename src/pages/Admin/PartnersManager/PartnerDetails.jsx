import React, { useState } from 'react'

const PartnerDetails = ({
    partner,
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
            {/* Partner Details Popup */}
            <div
                className="fixed inset-0 flex justify-center items-center z-50 transition-opacity duration-300"
                onClick={onClose}
                role="dialog"
                aria-modal="true"
                aria-labelledby="partner-details-modal-title"
            >
                <div
                    className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200 max-w-3xl w-full m-4 transform transition-all duration-300 scale-100 ring-2 ring-blue-200 ring-opacity-50"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2
                        id="partner-details-modal-title"
                        className="text-2xl font-bold text-gray-800 mb-6 tracking-tight"
                    >
                        Chi tiết đối tác
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    ID:
                                </strong>{' '}
                                {partner.partnerId}
                            </p>
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    Tên người dùng:
                                </strong>{' '}
                                {partner.userName}
                            </p>
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    Email:
                                </strong>{' '}
                                {partner.email}
                            </p>
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    Tên công ty:
                                </strong>{' '}
                                {partner.companyName}
                            </p>
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    Số điện thoại:
                                </strong>{' '}
                                {partner.phoneNumber || 'Không có'}
                            </p>
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    Địa chỉ:
                                </strong>{' '}
                                {partner.address || 'Không có'}
                            </p>
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    Website:
                                </strong>{' '}
                                {partner.website || 'Không có'}
                            </p>
                        </div>
                        <div className="space-y-4">
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    Trạng thái:
                                </strong>{' '}
                                <span
                                    className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                                        partner.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}
                                >
                                    {partner.isActive
                                        ? 'Hoạt động'
                                        : 'Không hoạt động'}
                                </span>
                            </p>
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    Ngày tạo:
                                </strong>{' '}
                                {formatDate(partner.createdDate)}
                            </p>
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    Tạo bởi:
                                </strong>{' '}
                                {partner.createdByName ||
                                    partner.createdBy ||
                                    'Không có'}
                            </p>
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    Ngày sửa:
                                </strong>{' '}
                                {formatDate(partner.modifiedDate)}
                            </p>
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    Sửa bởi:
                                </strong>{' '}
                                {partner.modifiedByName ||
                                    partner.modifiedBy ||
                                    'Không có'}
                            </p>
                        </div>
                    </div>
                    {!partner.isActive && (
                        <div className="mb-6 space-y-4">
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    Ngày vô hiệu hóa:
                                </strong>{' '}
                                {formatDate(partner.removedDate)}
                            </p>
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    Vô hiệu hóa bởi:
                                </strong>{' '}
                                {partner.removedByName ||
                                    partner.removedBy ||
                                    'Không có'}
                            </p>
                            <p className="text-sm">
                                <strong className="text-gray-600 font-semibold">
                                    Lý do vô hiệu hóa:
                                </strong>{' '}
                                {partner.removedReason || 'Không có'}
                            </p>
                        </div>
                    )}
                    <div className="flex justify-end space-x-4">
                        {partner.isActive && (
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
            {isUpdatePopupOpen && partner.isActive && (
                <div
                    className="fixed inset-0 flex justify-center items-center z-[60] transition-opacity duration-300"
                    onClick={() => setIsUpdatePopupOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="update-partner-modal-title"
                >
                    <div
                        className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200 max-w-3xl w-full m-4 max-h-[80vh] overflow-y-auto transform transition-all duration-300 scale-100 ring-2 ring-blue-200 ring-opacity-50"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3
                            id="update-partner-modal-title"
                            className="text-2xl font-bold text-gray-800 mb-6 tracking-tight"
                        >
                            Cập nhật thông tin đối tác
                        </h3>
                        <form onSubmit={onUpdate} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block mb-1 text-sm font-semibold text-gray-700">
                                        Tên người dùng
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
                                        Tên công ty
                                    </label>
                                    <input
                                        type="text"
                                        value={updateForm.companyName}
                                        onChange={(e) =>
                                            setUpdateForm({
                                                ...updateForm,
                                                companyName: e.target.value
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
                                        Địa chỉ
                                    </label>
                                    <input
                                        type="text"
                                        value={updateForm.address}
                                        onChange={(e) =>
                                            setUpdateForm({
                                                ...updateForm,
                                                address: e.target.value
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-semibold text-gray-700">
                                        Website
                                    </label>
                                    <input
                                        type="text"
                                        value={updateForm.website}
                                        onChange={(e) =>
                                            setUpdateForm({
                                                ...updateForm,
                                                website: e.target.value
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

export default PartnerDetails
