import React, { useEffect, useState } from 'react'
import LoadingSpinner from '@/components/states/LoadingSpinner'

function AddBlogDialog({ isOpen, onClose, onConfirm }) {
    const [isVisible, setIsVisible] = useState(false)
    const [animationClass, setAnimationClass] = useState('fade-in')
    const [loading, setLoading] = useState(false)

    const [blogName, setBlogName] = useState('')
    const [blogContent, setBlogContent] = useState('')
    const [images, setImages] = useState([])
    const [previewURLs, setPreviewURLs] = useState([])

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true)
            setAnimationClass('fade-in')
        } else {
            setAnimationClass('fade-out')
            setTimeout(() => setIsVisible(false), 300)
        }
    }, [isOpen])

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        const newPreviews = files.map((file) => URL.createObjectURL(file))
        setImages((prev) => [...prev, ...files])
        setPreviewURLs((prev) => [...prev, ...newPreviews])
    }

    const handleRemoveImage = (indexToRemove) => {
        setImages((prev) => prev.filter((_, i) => i !== indexToRemove))
        setPreviewURLs((prev) => prev.filter((_, i) => i !== indexToRemove))
    }

    const handleSubmit = async () => {
        if (!blogName.trim() || !blogContent.trim()) {
            alert('Vui lòng nhập đầy đủ tên và nội dung blog.')
            return
        }

        setLoading(true)

        try {
            // Giả lập delay (1.5s)
            await new Promise((resolve) => setTimeout(resolve, 1500))

            onConfirm({
                blogName,
                blogContent,
                images
            })

            // // Reset form
            // setBlogName('')
            // setBlogContent('')
            // setImages([])
            // setPreviewURLs([])
        } finally {
            setLoading(false)
            handleClose()
        }
    }

    const handleClose = () => {
        setBlogName('')
        // setBlogContent('')
        // setImages([])
        // setPreviewURLs([])
        onClose()
    }

    if (!isVisible) return null

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center z-50 bg-white/10 backdrop-blur-sm ${animationClass}`}
        >
            <div className="relative bg-white rounded-lg p-6 shadow-lg max-w-2xl w-[90%] transition-transform">
                {/* Overlay Loading */}
                {loading && (
                    <div className="absolute inset-0 z-20 bg-white/20 backdrop-blur-[0.5px] flex items-center justify-center rounded-lg">
                        <LoadingSpinner />
                    </div>
                )}

                {/* Dialog */}
                <div
                    className={`${loading ? 'opacity-50 pointer-events-none select-none' : ''}`}
                >
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Tạo Blog Mới
                    </h2>

                    <div className="mb-4">
                        <label className="block mb-1 font-medium text-gray-700">
                            Tên blog
                        </label>
                        <input
                            type="text"
                            value={blogName}
                            onChange={(e) => setBlogName(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Nhập tên blog"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 font-medium text-gray-700">
                            Nội dung
                        </label>
                        <textarea
                            value={blogContent}
                            onChange={(e) => setBlogContent(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 h-32 resize-none focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Nhập nội dung blog"
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 font-medium text-gray-700">
                            Hình ảnh (có thể chọn nhiều)
                        </label>
                        <div>
                            <label
                                htmlFor="file-upload"
                                className="inline-block px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 active:scale-95 transition"
                            >
                                Chọn ảnh
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {previewURLs.length > 0 && (
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                            {previewURLs.map((url, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={url}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-24 object-cover rounded border cursor-pointer"
                                        onClick={() => handleRemoveImage(index)}
                                        title="Click để xóa"
                                    />
                                    <span className="absolute top-1 right-2 text-white text-sm bg-black bg-opacity-50 px-1 rounded opacity-0 group-hover:opacity-100 transition">
                                        Xóa
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-end gap-4">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 transition hover:cursor-pointer active:bg-gray-500"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white transition hover:cursor-pointer active:bg-green-800"
                        >
                            Tạo blog
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddBlogDialog
