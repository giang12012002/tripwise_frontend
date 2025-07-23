import AiTourCreateButton from './AiTourCreateButton.jsx'
import HotToursSection from './HotToursSection'
import WhyChooseUsSection from './WhyChooseUsSection'
import AboutUsSection from './AboutUsSection'
import BlogsSection from './BlogsSection'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import ApprovedToursSection from '@/pages/HomePage/ApprovedToursSection.jsx'

function HomePage() {
    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <Header />
            <div>
                <AiTourCreateButton />
            </div>
            <div className="my-8">
                <ApprovedToursSection />
            </div>
            <div className="my-8">
                <WhyChooseUsSection />
            </div>
            <div className="my-8">
                <AboutUsSection />
            </div>
            <div className="my-4">
                <BlogsSection />
            </div>
            <Footer />
        </div>
    )
}

export default HomePage
