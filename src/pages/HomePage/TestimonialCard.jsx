function TestimonialCard({ text }) {
    return (
        <div className="bg-gray-100 p-4 rounded-lg">
            <p className="mb-3">{text}</p>
            <div className="flex items-center">
                <span className="text-yellow-500">★★★★★</span>
            </div>
        </div>
    )
}

export default TestimonialCard
