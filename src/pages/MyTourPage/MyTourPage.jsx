import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import MyTour from '@/components/ui/TravelForm/MyTour'

function MyTourPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <MyTour />
        </div>
    )
}
export default MyTourPage
