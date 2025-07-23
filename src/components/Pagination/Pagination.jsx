import React from 'react'

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    onPreviousPage,
    onNextPage
}) => {
    if (totalPages <= 1) return null

    return (
        <div className="flex justify-center mt-8 space-x-2">
            <button
                onClick={onPreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gradient-to-r from-gray-400 to-gray-600 text-white rounded-lg hover:from-gray-500 hover:to-gray-700 transition-all duration-300 shadow-md flex items-center disabled:opacity-50"
            >
                <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
                Trước
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                            currentPage === page
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50'
                        }`}
                    >
                        {page}
                    </button>
                )
            )}
            <button
                onClick={onNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg hover:from-blue-500 hover:to-blue-700 transition-all duration-300 shadow-md flex items-center disabled:opacity-50"
            >
                Sau
                <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </button>
        </div>
    )
}

export default Pagination
