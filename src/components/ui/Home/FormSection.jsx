function FormSection({ title, children, showBack = true }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
                {showBack && <button className="text-gray-600 mr-2">←</button>}
                <h3 className="font-semibold">VIET DU KY</h3>
            </div>
            <h2 className="text-lg font-bold mb-4">{title}</h2>
            {children}
        </div>
    )
}

export default FormSection
