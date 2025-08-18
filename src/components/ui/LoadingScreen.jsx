import React from 'react'

function LoadingScreen() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
            <div className="flex-grow flex items-center justify-center max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center space-x-3 p-6 bg-white rounded-xl shadow-lg">
                    <svg
                        className="animate-spin h-8 w-8 text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    <span className="text-lg font-medium text-gray-700">
                        Đang tải...
                    </span>
                </div>
            </div>
        </div>
    )
}

export default LoadingScreen
