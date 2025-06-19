import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import TravelForm from '@/components/ui/TravelForm/TravelForm'

function TravelFormPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <TravelForm />
            <Footer />
        </div>
    )
}
export default TravelFormPage
