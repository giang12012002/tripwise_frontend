import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import appSettingAPI from '@/apis/appSettingAPI.js'
import Swal from 'sweetalert2'

const AdminHotNewsCreate = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        imageFile: null,
        imageUrl: '',
        redirectUrl: ''
    })
    const [previewImage, setPreviewImage] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (id) {
            const fetchHotNews = async () => {
                try {
                    const response = await appSettingAPI.fetchHotNewsById(id)
                    const { imageUrl, redirectUrl } = response.data
                    setFormData({ imageFile: null, imageUrl, redirectUrl })
                    setPreviewImage(imageUrl)
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: 'Lỗi khi tải dữ liệu tin tức.',
                        showConfirmButton: true,
                        confirmButtonText: 'Đóng',
                        confirmButtonColor: '#2563eb'
                    })
                    console.error(error)
                }
            }
            fetchHotNews()
        }
    }, [id])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        setFormData({ ...formData, imageFile: file, imageUrl: '' })
        setPreviewImage(file ? URL.createObjectURL(file) : null)
    }

    const handlePreviewImage = () => {
        if (formData.imageUrl) {
            setPreviewImage(formData.imageUrl)
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Vui lòng nhập URL hình ảnh trước khi thêm.',
                showConfirmButton: true,
                confirmButtonText: 'Đóng',
                confirmButtonColor: '#2563eb'
            })
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
            if (id) {
                await appSettingAPI.updateHotNews(id, data)
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Cập nhật tin tức thành công.',
                    showConfirmButton: true,
                    confirmButtonText: 'Đóng',
                    confirmButtonColor: '#2563eb'
                })
            } else {
                await appSettingAPI.createHotNews(data)
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Tạo tin tức thành công.',
                    showConfirmButton: true,
                    confirmButtonText: 'Đóng',
                    confirmButtonColor: '#2563eb'
                })
            }
            navigate('/admin/hot-news')
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: id ? 'Lỗi khi cập nhật tin tức.' : 'Lỗi khi tạo tin tức.',
                showConfirmButton: true,
                confirmButtonText: 'Đóng',
                confirmButtonColor: '#2563eb'
            })
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6 max-w-2xl mx-auto bg-gray-50 min-h-screen flex items-center">
            <div className="w-full">
                <h1 className="text-2xl font-bold mb-6">
                    {id ? 'Chỉnh sửa tin tức nổi bật' : 'Tạo tin tức nổi bật'}
                </h1>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 bg-white p-6 rounded-lg shadow"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hình Ảnh Cho News( tối đa 1 hình ảnh)
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
                            onClick={() => navigate('/admin/hot-news')}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                        >
                            {loading
                                ? 'Đang xử lý...'
                                : id
                                  ? 'Cập nhật'
                                  : 'Tạo mới'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AdminHotNewsCreate
