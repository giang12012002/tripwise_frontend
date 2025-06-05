import React from 'react'

function Home() {
    return (
        <div className="min-h-screen">
            <section
                className="relative bg-cover bg-center h-96 flex items-end"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')` // Replaced with a real image URL
                }}
            >
                {/* Overlay để làm tối nền */}
                <div className="absolute inset-0 bg-black opacity-50"></div>

                {/* Nội dung banner */}
                <div className="relative z-10 p-6 md:p-10 bg-white bg-opacity-90 rounded-lg m-6 md:m-10 max-w-md">
                    <h1 className="text-2xl md:text-3xl font-bold text-red-800 mb-4">
                        Tạo tour cá nhân hóa bằng AI!
                    </h1>
                    <p className="text-gray-700 mb-6">
                        Khám phá di sản việt theo cách của bạn.
                    </p>
                    <div className="flex space-x-4">
                        <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors">
                            Bạn muốn đi đâu
                        </button>
                        <button className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-900 transition-colors">
                            Tạo tour
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home
