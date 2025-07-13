import React, { useEffect, useState } from 'react'
import LoadingSpinner from '@/components/states/LoadingSpinner'
import { toast } from 'react-toastify'

function AddBlogDialog({ isOpen, onClose, onConfirm }) {
    const [page, setPage] = useState('method')
    const [documentId, setDocumentId] = useState(null)
    const [documentContent, setDocumentContent] = useState('')
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

            const response = await fetch('http://localhost:4000/create-doc', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    userEmail: 'vietanhnguyenvu219@gmail.com'
                })
            })

            const data = await response.json()

            if (!response.ok || !data.docUrl) {
                alert('Không thể tạo tài liệu Google Docs')
                return
            }

            setPage('confirm')
            setDocumentId(data.documentId)

            window.open(data.docUrl, '_blank')
        } catch (error) {
            console.error('Lỗi khi tạo Google Doc:', error)
            alert('Lỗi khi tạo Google Doc')
        } finally {
            setLoading(false)
        }
    }

    const handleUserDone = async () => {
        if (!documentId) return toast.error('Thiếu documentId')

        try {
            setLoading(true)

            const res = await fetch(
                `http://localhost:4000/get-doc?docId=${documentId}`
            )
            const htmlText = await res.text()
            if (res.ok) {
                setDocumentContent(htmlText)
                console.log('htmlText', htmlText)
                setPage('preview')
            } else {
                toast.error('Không thể lấy nội dung từ Google Docs')
            }
        } catch (error) {
            toast.error('Lỗi khi lấy nội dung tài liệu')
            console.error(error)
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
            onConfirm({
                documentId,
                documentContent
            })
        } finally {
            setLoading(false)
            // handleClose()
        }
    }

    const handleClose = () => {
        onClose()
        setPage('method')
        setDocumentId(null)
        setDocumentContent('')
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
                                <button className="flex-1 border border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-100 transition hover:cursor-pointer active:bg-gray-200">
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
                        </div>
                    )}

                    {page === 'confirm' && (
                        <>
                            <div className="mb-4">
                                <h3>Bạn đã tạo bài viết chưa ?</h3>
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
                                    onClick={handleUserDone}
                                    className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white transition hover:cursor-pointer active:bg-green-800"
                                >
                                    Xem
                                </button>
                            </div>
                        </>
                    )}

                    {page === 'preview' && (
                        <>
                            <iframe
                                src={`https://docs.google.com/document/d/${documentId}/preview`}
                                width="100%"
                                height="600"
                                className="rounded border"
                            />

                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={handleClose}
                                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 transition"
                                >
                                    Đóng
                                </button>
                                <button
                                    onClick={() => {
                                        handleSubmit()
                                    }}
                                    className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white transition"
                                >
                                    Xác nhận
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
