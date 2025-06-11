import TestimonialCard from './TestimonialCard'

function FeedbackSection() {
    return (
        <section className="bg-white py-12 max-w-7xl w-full mx-auto">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-center mb-8">
                    ĐÁNH GIÁ CỦA KHÁCH HÀNG?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <TestimonialCard text="Dịch vụ tuyệt vời và dễ sử dụng! Tôi đã tìm thấy nhiều tour du lịch thú vị cho chuyến đi của mình và đặt chỗ chỉ trong vài phút." />
                    <TestimonialCard text="Tôi rất ấn tượng với sự phản hồi nhanh chóng từ đội ngũ hỗ trợ khách hàng. Họ đã giúp tôi giải quyết một số vấn đề trong quá trình đặt tour." />
                    <TestimonialCard text="Tôi rất ấn tượng với tính năng AI trên trang web này! Nó đã giúp tôi tìm được tour du lịch hoàn hảo dựa trên sở thích của mình chỉ trong vài giây." />
                </div>
            </div>
        </section>
    )
}

export default FeedbackSection
