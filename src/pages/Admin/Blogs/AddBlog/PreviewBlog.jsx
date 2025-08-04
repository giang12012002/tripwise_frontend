import React from 'react'
import { useLocation } from 'react-router-dom'
import { blogAPI } from '@/apis'
import ChooseNameDialog from './ChooseNameDialog'
import { toast } from 'react-toastify'

function PreviewBlog() {
    const location = useLocation()
    const { blogData } = location.state || {}
    const [showDialog, setShowDialog] = React.useState(false)

    const handleAddBlog = async ({ name, image }) => {
        try {
            const response = await blogAPI.createBlog({
                blogName: name,
                blogContent: blogData.content,
                image
            })
            if (response.status === 200) {
                toast.success(response.data.message)
                setShowDialog(false)
            }
        } catch (error) {
            toast.error(`Đã có lỗi xảy ra: ${error.message}`)
            console.log(error)
        }
    }

    return (
        <div className="relative max-w-4xl mx-auto bg-white shadow-md rounded h-screen-[calc(100vh-56px)] flex flex-col">
            {/* Nội dung scroll riêng */}
            <div
                className="flex-1 overflow-y-auto p-6"
                dangerouslySetInnerHTML={{ __html: blogData.content }}
            />

            {/* Nút cố định dưới component */}
            <div className="sticky bottom-0 bg-gray-100 border-t border-gray-200 px-6 py-4 flex justify-end gap-2">
                <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                    Thoát
                </button>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => setShowDialog(true)}
                >
                    Xác nhận
                </button>
            </div>
            <ChooseNameDialog
                isOpen={showDialog}
                blogName={blogData.title}
                onClose={() => setShowDialog(false)}
                onConfirm={handleAddBlog}
            />
        </div>
    )
}

export default PreviewBlog
