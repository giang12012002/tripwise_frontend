import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'

function id() {
    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <Header />
            <div className="py-10">
                <h1 className="text-3xl font-bold text-center">
                    Blog Post Title
                </h1>
                <p className="mt-4 text-gray-600 text-center">
                    Published on January 1, 2023
                </p>
            </div>
            <Footer />
        </div>
    )
}

export default id
