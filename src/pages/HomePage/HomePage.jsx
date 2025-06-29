import AiTourCreateButton from './AiTourCreateButton.jsx'
import HotToursSection from './HotToursSection'
import WhyChooseUsSection from './WhyChooseUsSection'
import AboutUsSection from './AboutUsSection'
import FeedbackSection from './FeedbackSection.jsx'
import BlogsSection from './BlogsSection'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
function HomePage() {
    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <Header />
            <AiTourCreateButton />
            <HotToursSection />
            <WhyChooseUsSection />
            <AboutUsSection />
            <BlogsSection />
            <FeedbackSection />
            <Footer />
        </div>
    )
}

export default HomePage
