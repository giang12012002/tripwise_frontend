import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import Register from '@/components/ui/Register'

function RegisterPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <Register />
            <Footer />
        </div>
    )
}
export default RegisterPage
