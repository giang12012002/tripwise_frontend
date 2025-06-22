import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import ItineraryDisplay from '@/components/ui/TravelForm/ItineraryDisplay'

function ItineraryPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <ItineraryDisplay />
            <Footer />
        </div>
    )
}
export default ItineraryPage
