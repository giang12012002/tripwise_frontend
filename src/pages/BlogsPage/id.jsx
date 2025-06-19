import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import { useParams, useNavigate } from 'react-router-dom'

function Id() {
    const { id } = useParams()
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

    const blog = {
        id: id || 1,
        blogName:
            'Du Lịch: Hơn Cả Một Chuyến Đi, Đó Là Hành Trình Khám Phá Bản Thân',
        blogContent: `Du lịch là một trong những hoạt động phổ biến nhất trên thế giới, thu hút hàng tỷ người tham gia mỗi năm. Với sự phát triển của công nghệ và các phương tiện đi lại, du lịch ngày càng trở nên dễ dàng và tiện lợi hơn bao giờ hết.
Bạn có bao giờ cảm thấy mệt mỏi với nhịp sống hối hả, với những bộn bề công việc thường ngày? Đôi khi, tất cả những gì chúng ta cần là một chuyến đi, một cơ hội để thoát khỏi vòng lặp quen thuộc và đắm mình vào những trải nghiệm mới mẻ. Du lịch không chỉ đơn thuần là việc di chuyển từ nơi này đến nơi khác; đó là hành trình khám phá bản thân, mở rộng tầm nhìn và tái tạo năng lượng cho tâm hồn. Từ những bãi biển xanh ngắt đầy nắng đến những dãy núi hùng vĩ, từ những thành phố cổ kính trầm mặc đến những đô thị hiện đại sôi động, thế giới này luôn ẩn chứa vô vàn điều kỳ diệu đang chờ chúng ta khám phá.
Mỗi chuyến đi là một câu chuyện, một dấu ấn khó phai trong ký ức. Bạn có thể chọn thử thách bản thân với những cung đường trekking hiểm trở ở vùng núi phía Bắc Việt Nam, ngắm nhìn những thửa ruộng bậc thang kỳ vĩ uốn lượn như dải lụa. Hay bạn muốn thả mình vào làn nước trong xanh của những bãi biển miền Trung, thưởng thức hải sản tươi ngon và đón bình minh trên biển. Đối với những tâm hồn yêu thích lịch sử và văn hóa, việc lang thang qua những con phố cổ kính của Hội An, chiêm ngưỡng kiến trúc độc đáo và tìm hiểu về cuộc sống của người dân địa phương chắc chắn sẽ là một trải nghiệm khó quên. Hoặc nếu bạn là người của nhịp sống hiện đại, hãy lạc bước vào sự phồn hoa của Sài Gòn hay Hà Nội, khám phá những quán cà phê độc đáo, thưởng thức ẩm thực đường phố và cảm nhận năng lượng bất tận của những thành phố không ngủ. Du lịch còn là cơ hội để chúng ta gặp gỡ những con người mới, tìm hiểu về nền văn hóa đa dạng, và đôi khi, còn tìm thấy một phần nào đó của chính mình trong những vùng đất xa lạ.
Để có một chuyến đi trọn vẹn, việc chuẩn bị kỹ lưỡng là vô cùng quan trọng. Hãy lên kế hoạch chi tiết về địa điểm, thời gian, phương tiện di chuyển và ngân sách. Đừng quên đặt phòng khách sạn và vé máy bay (nếu cần) trước để tránh tình trạng hết chỗ hoặc giá cao. Chuẩn bị hành lý phù hợp với khí hậu và đặc điểm của nơi bạn đến. Quan trọng hơn cả, hãy giữ một tinh thần cởi mở và sẵn sàng đón nhận những điều bất ngờ. Đôi khi, những khoảnh khắc không theo kế hoạch lại chính là những kỷ niệm đáng nhớ nhất. Hãy thử những món ăn địa phương, trò chuyện với người dân bản xứ và đắm mình vào văn hóa nơi đó.
Sau mỗi chuyến đi, chúng ta không chỉ mang về những món quà lưu niệm hay những bức ảnh đẹp, mà còn là những trải nghiệm quý giá, những câu chuyện để kể và một trái tim giàu có hơn. Du lịch là cách để chúng ta làm phong phú thêm cuộc sống, nuôi dưỡng tâm hồn và vượt qua những giới hạn của bản thân. Vì vậy, đừng chần chừ nữa! Hãy lên kế hoạch cho chuyến đi tiếp theo của bạn, để mỗi hành trình là một khám phá mới, một dấu mốc đáng nhớ trong cuộc đời. Thế giới ngoài kia đang chờ bạn!`,
        blogImage: [
            {
                url: '/image.png',
                alt: 'Hình ảnh bài viết 1'
            },
            {
                url: '/image.png',
                alt: 'Hình ảnh bài viết 2'
            }
            // {
            //     url: '/image.png',
            //     alt: 'Hình ảnh bài viết 3'
            // },
            // {
            //     url: '/image.png',
            //     alt: 'Hình ảnh bài viết 4'
            // },
            // {
            //     url: '/image.png',
            //     alt: 'Hình ảnh bài viết 5'
            // },
            // {
            //     url: '/image.png',
            //     alt: 'Hình ảnh bài viết 6'
            // },
            // {
            //     url: '/image.png',
            //     alt: 'Hình ảnh bài viết 7'
            // }
        ],
        createdDate: '2025-01-01',
        createdBy: 'admin'
    }

    const splitParagraphs = (blog) => {
        return blog.split('\n').filter((paragraph) => paragraph.trim() !== '')
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    const updatedblog = {
        id: blog.id,
        blogName: blog.blogName,
        blogParagraphs: splitParagraphs(blog.blogContent),
        blogImage: blog.blogImage,
        createdDate: blog.createdDate,
        createdBy: blog.createdBy
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
            <Header />
            <main className="flex-grow py-10 px-[20%]">
                <h1 className="text-3xl font-bold text-center">
                    {updatedblog.blogName}
                </h1>

                <p className="mt-4 text-gray-600 text-right">
                    Được đăng ngày{' '}
                    <span className="text-red-500">
                        {formatDate(updatedblog.createdDate)}
                    </span>{' '}
                    bởi{' '}
                    <span className="font-bold text-blue-500">
                        {updatedblog.createdBy}
                    </span>
                </p>

                <div className="space-y-6 py-6">
                    <p className="text-gray-700 text-justify">
                        {updatedblog.blogParagraphs[0]}
                    </p>

                    {updatedblog.blogParagraphs
                        .slice(1, updatedblog.blogParagraphs.length - 1)
                        .map((paragraph, index) => {
                            const paragraphImage = updatedblog.blogImage[index]
                            return (
                                <div key={index}>
                                    {paragraphImage && (
                                        <div className="flex flex-col items-center">
                                            <img
                                                src={paragraphImage.url}
                                                alt={paragraphImage.alt}
                                                className="my-4 rounded w-full max-w-[80%] object-cover"
                                            />
                                            <p className="text-gray-600 italic text-sm text-center">
                                                {paragraphImage.alt}
                                            </p>
                                        </div>
                                    )}

                                    <p
                                        key={index}
                                        className="text-gray-700 text-justify"
                                    >
                                        {paragraph}
                                    </p>
                                </div>
                            )
                        })}

                    {updatedblog.blogImage
                        .slice(
                            updatedblog.blogParagraphs.length - 2,
                            updatedblog.blogImage.length
                        )
                        .map((img, idx) => (
                            <div
                                key={`extra-${idx}`}
                                className="flex flex-col items-center"
                            >
                                <img
                                    src={img.url}
                                    alt={img.alt}
                                    className="my-4 rounded w-full max-w-[80%] object-cover"
                                />
                                <p className="text-gray-600 italic text-sm text-center">
                                    {img.alt}
                                </p>
                            </div>
                        ))}

                    <p className="text-gray-700 text-justify">
                        {
                            updatedblog.blogParagraphs[
                                updatedblog.blogParagraphs.length - 1
                            ]
                        }
                    </p>

                    {/* Phần ký tên cuối bài */}
                    <p className="text-right mt-8 text-gray-700 italic">
                        — {updatedblog.createdBy}
                    </p>
                </div>

                <div className="mt-10 flex">
                    <section className="py-12 max-w-7xl w-full mx-auto">
                        <div className="container mx-auto px-4">
                            <h2 className="text-2xl font-bold text-center mb-8">
                                CÁC BÀI VIẾT KHÁC
                            </h2>
                            <p className="text-center max-w-xl mx-auto mb-6 hidden">
                                TripeWise là nền tảng trực tuyến tiên phong
                                trong việc sử dụng trí tuệ nhân tạo (AI) để tạo
                                ra lịch trình du lịch cá nhân hóa.
                            </p>

                            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
                                {blogs.map((blog) => (
                                    <div
                                        key={blog.id}
                                        className="max-w-sm bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
                                        onClick={() =>
                                            navigate(`/blogs/${blog.id}`)
                                        }
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
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default Id
