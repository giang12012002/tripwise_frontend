import React, { useState, useEffect } from 'react'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import PlanCard from './PlanCard'
import ConfirmDialog from './ConfirmDialog'
import axios from 'axios'
import { splitTextByType } from '@/utils/text'
import { planAPI } from '@/apis'

function Index() {
    const [plans, setPlans] = useState([])

    const fetchPlans = async () => {
        const response = await planAPI.fetchPlans()
        if (response.status === 200) {
            const processing = response.data.map((plan) => ({
                ...plan,
                features: splitTextByType(plan.description, 'dot_space')
            }))
            setPlans(processing)
        }
    }

    useEffect(() => {
        fetchPlans()
    }, [])

    const [selectedPlan, setSelectedPlan] = useState({
        plan: null
    })
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)

    const handleOpenConfirmDialog = (plan) => {
        setSelectedPlan({ plan })
        setShowConfirmDialog(true)
    }

    const handleCheckout = async ({ plan, method }) => {
        // //TODO: cần sửa lại chỗ này
        let userId = localStorage.getItem('userId')
        if (userId === 'undefined' || userId === null) {
            userId = '1'
        }

        const accessToken = localStorage.getItem('accessToken')
        console.log('accessToken', accessToken)

        console.log('handleCheckout', plan, method, userId)
        if (method === 'vnpay') {
            const res = await axios.post(
                'http://localhost:3000/api/create-qr',
                {
                    plan, // planId, planName, price, features
                    method,
                    userId,
                    accessToken
                }
            )

            console.log('res.data', res.data)

            window.location.href = res.data
        } else if (method === 'qr') {
            console.log('qr')
        }

        const res = await planAPI.upgrade(plan.planId)
        console.log('res', res)
    }

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

                <div className="mt-8 max-w-4xl mx-auto px-4">
                    {plans.length === 0 ? (
                        <p className="text-center text-gray-500">
                            Không có gói nào.
                        </p>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto px-4 items-stretch">
                                {plans.map((plan) => (
                                    <PlanCard
                                        key={plan.planId}
                                        plan={plan}
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
                isOpen={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                onConfirm={handleCheckout}
            />
        </div>
    )
}

export default Index
