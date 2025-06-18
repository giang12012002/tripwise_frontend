import { useNavigate } from 'react-router-dom'

function BlogsSection() {
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
        <section className="py-12 max-w-7xl w-full mx-auto">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-center mb-8">
                    VỀ CHÚNG TÔI
                </h2>
                <p className="text-center max-w-xl mx-auto mb-6 hidden">
                    TripeWise là nền tảng trực tuyến tiên phong trong việc sử
                    dụng trí tuệ nhân tạo (AI) để tạo ra lịch trình du lịch cá
                    nhân hóa.
                </p>

                <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
                    {blogs.map((blog) => (
                        <div
                            key={blog.id}
                            className="max-w-sm bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 hover:scale-105 cursor-pointer"
                            onClick={() => navigate(`/blogs/${blog.id}`)}
                        >
                            <img
                                src={blog.blogImage}
                                alt={`Image for ${blog.blogName}`}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h3
                                        className="text-xl font-bold line-clamp-1 mb-2 max-w-[40%] text-gray-800"
                                        title={blog.blogName}
                                    >
                                        {blog.blogName}
                                    </h3>
                                    <p className="text-gray-400 text-sm font-light mb-2 max-w-[40%]">
                                        {blog.createdDate}
                                    </p>
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-4 mb-4">
                                    {blog.blogContent}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-6">
                    <a
                        href="/blogs"
                        className="text-blue-600 font-semibold transition duration-200 ease-in-out hover:text-blue-800 active:scale-95"
                    >
                        Xem thêm
                    </a>
                </div>
            </div>
        </section>
    )
}

export default BlogsSection
