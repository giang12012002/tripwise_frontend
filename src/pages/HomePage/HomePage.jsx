import AiTourCreateButton from '@/components/ui/Home/AiTourCreateButton.jsx'
import HotToursSection from '@/components/ui/Home/HotToursSection'
import WhyChooseUsSection from '@/components/ui/Home/WhyChooseUsSection'
import AboutUsSection from '@/components/ui/Home//AboutUsSection'
import FeedbackSection from '@/components/ui/Home/FeedbackSection.jsx'
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
            <FeedbackSection />
            <Footer />
        </div>
    )
}

export default HomePage
