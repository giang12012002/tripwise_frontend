import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const HotNewsDialog = ({ isOpen, onClose, onConfirm, news }) => {
    const [formData, setFormData] = useState({
        imageFile: null,
        imageUrl: '',
        redirectUrl: ''
    })
    const [previewImage, setPreviewImage] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (news) {
            setFormData({
                imageFile: null,
                imageUrl: news.imageUrl || '',
                redirectUrl: news.redirectUrl || ''
            })
            setPreviewImage(news.imageUrl || null)
        } else {
            setFormData({
                imageFile: null,
                imageUrl: '',
                redirectUrl: ''
            })
            setPreviewImage(null)
        }
    }, [news])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData({ ...formData, imageFile: file, imageUrl: '' })
            setPreviewImage(URL.createObjectURL(file))
        } else {
            setFormData({ ...formData, imageFile: null })
            setPreviewImage(formData.imageUrl || null)
        }
    }

    const handlePreviewImage = () => {
        if (formData.imageUrl) {
            setPreviewImage(formData.imageUrl)
        } else {
            toast.error('Vui lòng nhập URL hình ảnh trước khi thêm')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const data = {
            imageFile: formData.imageFile,
            imageUrl: formData.imageUrl,
            redirectUrl: formData.redirectUrl
        }

        try {
            await onConfirm(data, news?.id)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-6">
                    {news ? 'Chỉnh sửa tin tức nổi bật' : 'Tạo tin tức nổi bật'}
                </h2>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hình Ảnh Cho News (tối đa 1 hình ảnh)
                        </label>
                        <div className="flex space-x-4 mb-4">
                            <button
                                type="button"
                                onClick={() =>
                                    document
                                        .querySelector('input[type="file"]')
                                        .click()
                                }
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            >
                                Chọn ảnh
                            </button>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                        <div className="flex items-center space-x-4">
                            <input
                                type="text"
                                name="imageUrl"
                                value={
                                    formData.imageFile ? '' : formData.imageUrl
                                }
                                onChange={handleInputChange}
                                placeholder="https://example.com/image.jpg"
                                className="flex-1 border border-gray-300 rounded-lg p-2"
                                disabled={formData.imageFile !== null}
                            />
                            <button
                                type="button"
                                onClick={handlePreviewImage}
                                disabled={
                                    loading || formData.imageFile !== null
                                }
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-300"
                            >
                                Thêm
                            </button>
                        </div>
                        {previewImage && (
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="mt-4 h-32 w-32 object-cover rounded-lg border border-gray-200"
                            />
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            URL chuyển hướng
                        </label>
                        <input
                            type="text"
                            name="redirectUrl"
                            value={formData.redirectUrl}
                            onChange={handleInputChange}
                            placeholder="Nhập URL chuyển hướng"
                            className="mt-1 block w-full border rounded p-2"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 transition"
                        >
                            {loading
                                ? 'Đang xử lý...'
                                : news
                                  ? 'Cập nhật'
                                  : 'Tạo mới'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HotNewsDialog
