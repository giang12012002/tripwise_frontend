import React, { useState } from 'react'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import PlanCard from './PlanCard'
import ConfirmDialog from './ConfirmDialog'
import { useNavigate } from 'react-router-dom'

import { splitToParagraphs } from '@/utils/text'

const periodMultipliers = {
    week: 1,
    month: 4,
    year: 48
}

function Index() {
    const [plans, setPlans] = useState([
        {
            id: 1,
            name: 'Plan 1',
            price: 20000,
            features: splitToParagraphs(
                `ABC ladasd asdasd asd asd asd as da sd asd a da aaaaaa\nXYZ\nMLN\nMLN\nMLN\nMLN\nMLN`
            )
        },
        {
            id: 2,
            name: 'Plan 2',
            price: 30000,
            features: splitToParagraphs(`ABC\nDEF\nGHI`)
        }
    ])
    const [selectedPeriod, setSelectedPeriod] = useState('month')
    const [selectedPlan, setSelectedPlan] = useState({
        plan: null,
        multiplier: 1,
        billingPeriod: 'month'
    })
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)

    const handleOpenConfirmDialog = (plan, billingPeriod, multiplier) => {
        setSelectedPlan({ plan, multiplier, billingPeriod })
        setShowConfirmDialog(true)
    }

    const handleCheckout = ({ plan, method, price, billingPeriod }) => {
        console.log({ plan, method, price, billingPeriod })
    }

    const navigate = useNavigate()

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
            <Header />
            <main className="flex-grow py-10">
                <h1 className="text-3xl font-bold text-center">
                    Chọn gói sử dụng
                </h1>
                <p className="mt-4 text-gray-600 text-center">
                    Hãy mua gói để tận hưởng nhiều đặc quyền hơn.
                </p>

                <div className="flex justify-center space-x-4 mb-8">
                    {['week', 'month', 'year'].map((period) => (
                        <button
                            key={period}
                            className={`px-4 py-2 rounded hover:cursor-pointer active:bg-gray-500 ${
                                selectedPeriod === period
                                    ? 'bg-gray-300 text-black'
                                    : 'text-gray-500 hover:text-black hover:bg-gray-200 '
                            }`}
                            onClick={() => setSelectedPeriod(period)}
                        >
                            {period === 'week'
                                ? 'Tuần'
                                : period === 'month'
                                  ? 'Tháng'
                                  : 'Năm'}
                        </button>
                    ))}
                </div>

                <div className="mt-8 max-w-4xl mx-auto px-4">
                    {plans.length === 0 ? (
                        <p className="text-center text-gray-500">
                            Không có gói nào.
                        </p>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto px-4 items-stretch">
                                {plans.map((plan) => (
                                    <PlanCard
                                        key={plan.id}
                                        plan={plan}
                                        billingPeriod={selectedPeriod}
                                        multiplier={
                                            periodMultipliers[selectedPeriod]
                                        }
                                        onSelect={handleOpenConfirmDialog}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </main>
            <Footer />

            <ConfirmDialog
                plan={selectedPlan?.plan}
                billingPeriod={selectedPlan?.billingPeriod}
                multiplier={selectedPlan?.multiplier}
                isOpen={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                onConfirm={handleCheckout}
            />
        </div>
    )
}

export default Index
