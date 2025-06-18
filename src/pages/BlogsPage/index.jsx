import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import { useNavigate } from 'react-router-dom'

function Index() {
    const navigate = useNavigate()
    const blogs = [
        {
            id: 1,
            blogName: 'Bài viết 111 111 11111 1 1111 11111 11 111 111',
            blogContent:
                'Nội dung bài viết 1 sẽ được hiển thị ở đây. 100 kí tự đầu tiên của nội dung bài viết sẽ được hiển thị. Nếu nội dung bài viết dài hơn 100 kí tự, sẽ có nút "Xem thêm" để xem toàn bộ nội dung. Nội dung bài viết 1 sẽ được hiển thị ở đây. 100 kí tự đầu tiên của nội dung bài viết sẽ được hiển thị. Nếu nội dung bài viết dài hơn 100 kí tự, sẽ có nút "Xem thêm" để xem toàn bộ nội dung. Nội dung bài viết 1 sẽ được hiển thị ở đây. 100 kí tự đầu tiên của nội dung bài viết sẽ được hiển thị. Nếu nội dung bài viết dài hơn 100 kí tự, sẽ có nút "Xem thêm" để xem toàn bộ nội dung. Nội dung bài viết 1 sẽ được hiển thị ở đây. 100 kí tự đầu tiên của nội dung bài viết sẽ được hiển thị. Nếu nội dung bài viết dài hơn 100 kí tự, sẽ có nút "Xem thêm" để xem toàn bộ nội dung. Nội dung bài viết 1 sẽ được hiển thị ở đây. 100 kí tự đầu tiên của nội dung bài viết sẽ được hiển thị. Nếu nội dung bài viết dài hơn 100 kí tự, sẽ có nút "Xem thêm" để xem toàn bộ nội dung. Nội dung bài viết 1 sẽ được hiển thị ở đây. 100 kí tự đầu tiên của nội dung bài viết sẽ được hiển thị. Nếu nội dung bài viết dài hơn 100 kí tự, sẽ có nút "Xem thêm" để xem toàn bộ nội dung.',
            blogImage: '/image.png',
            createdDate: '2025-01-01',
            createdBy: 'admin'
        },
        {
            id: 2,
            blogName: 'Bài viết 2',
            blogContent:
                'Nội dung bài viết 2 sẽ được hiển thị ở đây. 100 kí tự đầu tiên của nội dung bài viết sẽ được hiển thị. Nếu nội dung bài viết dài hơn 100 kí tự, sẽ có nút "Xem thêm" để xem toàn bộ nội dung.',
            blogImage: '/image.png',
            createdDate: '2025-01-02',
            createdBy: 'admin'
        },
        {
            id: 3,
            blogName: 'Bài viết 3',
            blogContent:
                'Nội dung bài viết 3 sẽ được hiển thị ở đây. 100 kí tự đầu tiên của nội dung bài viết sẽ được hiển thị. Nếu nội dung bài viết dài hơn 100 kí tự, sẽ có nút "Xem thêm" để xem toàn bộ nội dung.',
            blogImage: '/image.png',
            createdDate: '2025-01-03',
            createdBy: 'admin'
        }
    ]

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
            <Header />
            <main className="flex-grow py-10">
                <h1 className="text-3xl font-bold text-center">
                    Danh sách các bài viết
                </h1>
                <p className="mt-4 text-gray-600 text-center">
                    Cập nhật thường xuyên các bài viết mới nhất về du lịch và
                    khám phá thế giới.
                </p>
                <div className="mt-8 max-w-4xl mx-auto px-4">
                    <ul className="space-y-6">
                        {blogs.map((blog) => (
                            <li
                                key={blog.id}
                                className="flex bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-200 cursor-pointer hover:ring-2 hover:ring-blue-400 active:scale-95 gap-6"
                                onClick={() =>
                                    setTimeout(() => {
                                        navigate(`/blogs/${blog.id}`)
                                    }, 100)
                                }
                            >
                                {/* Hình ảnh bên trái (3 phần) */}
                                <div className="w-3/10 max-w-[30%] aspect-[4/3] bg-gray-200 overflow-hidden rounded-md flex items-center justify-center">
                                    <img
                                        src={blog.blogImage}
                                        alt={`Image for ${blog.blogName}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Nội dung bên phải (7 phần) */}
                                <div className="w-7/10">
                                    <h2
                                        className="text-xl font-semibold line-clamp-2"
                                        title={blog.blogName}
                                    >
                                        {blog.blogName}
                                    </h2>
                                    <p className="mt-2 text-gray-600 line-clamp-3">
                                        {blog.blogContent}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default Index
