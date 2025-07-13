import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { planAdminAPI } from '@/apis'
import { useLocation } from 'react-router-dom'
import { plansData } from './mockData'
import PlanCard from './PlanCard'
import AddPlanDialog from './AddPlanDialog'
import UpdatePlanDialog from './AddPlanDialog'
import DeleteConfirmDialog from './DeleteConfirmDialog'
import { toast } from 'react-toastify'

function Index() {
    const navigate = useNavigate()
    const location = useLocation()
    const [plans, setPlans] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showAddPlanDialog, setShowAddPlanDialog] = useState(false)
    const [showUpdatePlanDialog, setShowUpdatePlanDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [updatingPlan, setUpdatingPlan] = useState(null)
    const [deletingPlan, setDeletingPlan] = useState(null)

    const fetchPlans = async () => {
        setLoading(true)
        try {
            setPlans(plansData.filter((p) => p.isDeleted === false))
        } catch (error) {
            setError('Không thể lấy danh sách gói')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPlans()
    }, [])

    useEffect(() => {
        if (location.state?.refetch) {
            fetchPlans()
        }
    }, [location.state])

    // TODO
    const handleOnDelete = (plan) => {
        setDeletingPlan(plan)
        setShowDeleteDialog(true)
    }

    const handleDelete = (plan) => {
        try {
            setPlans(plans.filter((p) => p.planId !== plan.planId))
            setDeletingPlan(null)
            toast.success('Xóa gói thành công')
        } catch (e) {
            toast.error('Không thể xóa gói')
            console.log(e)
        }
    }
    // TODO
    const handleOnUpdate = (plan) => {
        setUpdatingPlan(plan)
        setShowUpdatePlanDialog(true)
    }

    const handleUpdate = (plan, planId) => {
        try {
            if (planId !== null && updatingPlan.planId === planId) {
                const newPlans = plans.map((p) =>
                    p.planId === planId ? { ...plan, planId } : p
                )
                setPlans(newPlans)
                setUpdatingPlan(null)
                setShowUpdatePlanDialog(false)
                toast.success('Cập nhật gói thành công')
            }
        } catch (e) {
            toast.error('Không thể cập nhật gói')
            console.log(e)
        } finally {
            setShowUpdatePlanDialog(false)
        }
    }

    const handleAdd = (plan, planId) => {
        const nextId =
            plans && plans.length > 0
                ? Math.max(...plans.map((p) => p.planId)) + 1
                : 1

        const completePlan = {
            ...plan,
            planId: nextId
        }

        setPlans((prev) => [...(prev || []), completePlan])
        toast.success('Thêm gói thành công')
        setShowAddPlanDialog(false)
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 font-sans relative">
            <main className="flex-grow py-10">
                <h1 className="text-3xl font-bold text-center mb-8">
                    Danh sách các gói
                </h1>

                <div className="py-4 px-8 flex justify-end">
                    <button
                        onClick={() => setShowAddPlanDialog(true)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 hover:cursor-pointer active:scale-95 transition duration-200 ease-in-out"
                        title="Thêm plan mới"
                    >
                        Thêm
                    </button>
                </div>

                {loading ? (
                    <div className="text-center text-gray-500">
                        Đang tải danh sách gói...
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500">{error}</div>
                ) : plans.length > 0 ? (
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
                                            onDelete={handleOnDelete}
                                            onUpdate={handleOnUpdate}
                                            isPreview={true}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="text-center text-gray-500">
                        Không có bài viết nào.
                    </div>
                )}
            </main>

            <AddPlanDialog
                isOpen={showAddPlanDialog}
                onClose={() => {
                    setShowAddPlanDialog(false)
                }}
                onConfirm={handleAdd}
            />

            <UpdatePlanDialog
                isOpen={showUpdatePlanDialog}
                onClose={() => {
                    setShowUpdatePlanDialog(false)
                }}
                onConfirm={handleUpdate}
                plan={updatingPlan}
            />

            <DeleteConfirmDialog
                plan={deletingPlan}
                isOpen={showDeleteDialog}
                onClose={() => {
                    setShowDeleteDialog(false)
                }}
                onConfirm={handleDelete}
            />
        </div>
    )
}

export default Index
