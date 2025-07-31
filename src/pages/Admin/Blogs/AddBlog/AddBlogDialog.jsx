import React, { useEffect, useState } from 'react'
import LoadingSpinner from '@/components/states/LoadingSpinner'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function AddBlogDialog({ isOpen, onClose }) {
    const navigate = useNavigate()

    const [page, setPage] = useState('method')
    const [googleDocUrl, setGoogleDocUrl] = useState('')
    const [isVisible, setIsVisible] = useState(false)
    const [animationClass, setAnimationClass] = useState('fade-in')
    const [loading, setLoading] = useState(false)

    const userId = localStorage.getItem('userId')

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true)
            setAnimationClass('fade-in')
        } else {
            setAnimationClass('fade-out')
            setTimeout(() => setIsVisible(false), 300)
        }
    }, [isOpen])

    const handleUseGoogleDocs = async () => {
        if (!userId) return alert('Chưa có userId')
        try {
            setLoading(true)
            setPage('gg-docs-url')
        } catch (error) {
            console.error('Lỗi khi tạo Google Doc:', error)
            alert('Lỗi khi tạo Google Doc')
        } finally {
            setLoading(false)
        }
    }

    // Submit
    const handleSubmit = async () => {
        setLoading(true)
        try {
            // Giả lập delay (1.5s)
            await new Promise((resolve) => setTimeout(resolve, 1500))

            if (page === 'gg-docs-url') {
                try {
                    const response = await axios.post(
                        'http://localhost:4000/export',
                        {
                            url: googleDocUrl
                        }
                    )
                    if (response.data) {
                        console.log(response.data)
                        navigate(`/admin/blogs/preview`)
                    }
                } catch (err) {
                    console.log(err)
                }
            }
        } finally {
            setLoading(false)
            // handleClose()
        }
    }

    const handleClose = () => {
        onClose()
        setPage('method')
        setGoogleDocUrl('')
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
                    {/* Tiêu đề */}
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                        Tạo Blog Mới
                    </h2>

                    {page === 'method' && (
                        <div className="mb-4">
                            <label className="block mb-1 font-medium text-gray-700">
                                Bạn muốn tải lên bằng:
                            </label>

                            <div className="flex gap-4 mt-2">
                                {/* Upload from Word */}
                                <button
                                    onClick={() => {
                                        alert('Chưa có chức năng này')
                                    }}
                                    className="flex-1 border border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-100 transition hover:cursor-pointer active:bg-gray-200"
                                >
                                    <img
                                        src="/microsoft-word-icon.svg"
                                        alt="Word"
                                        className="w-10 h-10 mb-2"
                                    />
                                    <span className="text-gray-800 font-medium">
                                        Tải lên từ Word
                                    </span>
                                </button>

                                {/* Upload from Google Docs */}
                                <button
                                    onClick={handleUseGoogleDocs}
                                    className="flex-1 border border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-100 transition hover:cursor-pointer active:bg-gray-200 "
                                >
                                    <img
                                        src="/google-docs-icon.svg"
                                        alt="Google Docs"
                                        className="w-10 h-10 mb-2"
                                    />
                                    <span className="text-gray-800 font-medium">
                                        Dùng Google Docs
                                    </span>
                                </button>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={handleClose}
                                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 transition hover:cursor-pointer active:bg-gray-500"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    )}

                    {page === 'gg-docs-url' && (
                        <>
                            <div className="mb-4">
                                <label className="block mb-1 font-medium text-gray-700">
                                    Nhập link Google Doc
                                </label>
                                <input
                                    type="text"
                                    placeholder="Link có dạng https://docs.google.com/document/d/..."
                                    value={googleDocUrl}
                                    onChange={(e) =>
                                        setGoogleDocUrl(e.target.value)
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            {/* Nút */}
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
                                    Xem
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AddBlogDialog
