import React, { useEffect, useState } from 'react'
import LoadingSpinner from '@/components/states/LoadingSpinner'
import { toast } from 'react-toastify'

function ChooseNameDialog({ isOpen, blogName = '', onClose, onConfirm }) {
    const [isVisible, setIsVisible] = useState(false)
    const [animationClass, setAnimationClass] = useState('fade-in')
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState(blogName)
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(null)

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true)
            setAnimationClass('fade-in')
        } else {
            setAnimationClass('fade-out')
            setTimeout(() => setIsVisible(false), 300)
        }
    }, [isOpen])

    // Hiển thị ảnh preview
    useEffect(() => {
        if (image) {
            const reader = new FileReader()
            reader.onloadend = () => setPreview(reader.result)
            reader.readAsDataURL(image)
        } else {
            setPreview(null)
        }
    }, [image])

    const handleSubmit = async () => {
        if (!name.trim()) {
            toast.error('Vui lòng nhập tiêu đề')
            return
        }

        if (!image) {
            toast.error('Vui lòng chọn ảnh nền')
            return
        }

        setLoading(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            onConfirm({ name, image }) // Gửi dữ liệu ra ngoài
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setName('')
        setImage(null)
        setPreview(null)
        onClose()
    }

    if (!isVisible) return null

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center z-50 bg-white/10 backdrop-blur-sm ${animationClass}`}
        >
            <div className="relative bg-white rounded-lg p-6 shadow-lg max-w-2xl w-[90%] transition-transform">
                {loading && (
                    <div className="absolute inset-0 z-20 bg-white/30 backdrop-blur-sm flex items-center justify-center rounded-lg">
                        <LoadingSpinner />
                    </div>
                )}

                <div
                    className={`${loading ? 'opacity-50 pointer-events-none select-none' : ''}`}
                >
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                        Tạo tiêu đề cho blog
                    </h2>

                    {/* Nhập tên */}
                    <div className="mb-4">
                        <label className="block mb-1 font-medium text-gray-700">
                            Tiêu đề
                        </label>
                        <input
                            type="text"
                            value={blogName}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                            placeholder="Nhập tiêu đề blog"
                        />
                    </div>

                    {/* Chọn ảnh */}
                    <div className="mb-4">
                        <label className="block mb-1 font-medium text-gray-700">
                            Ảnh nền
                        </label>
                        <div className="flex items-center gap-4">
                            <label
                                htmlFor="upload-image"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V7.414a2 2 0 00-.586-1.414l-3.414-3.414A2 2 0 0012.586 2H4zm6 3a1 1 0 011 1v3h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 110-2h2V7a1 1 0 011-1z" />
                                </svg>
                                Chọn ảnh
                            </label>
                            <input
                                id="upload-image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])}
                                className="hidden"
                            />
                        </div>

                        {/* Preview ảnh */}
                        {preview && (
                            <img
                                src={preview}
                                alt="Preview"
                                className="mt-3 max-h-48 rounded-lg shadow-md border"
                            />
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end mt-6 gap-4">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 transition"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition"
                        >
                            Tạo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChooseNameDialog
