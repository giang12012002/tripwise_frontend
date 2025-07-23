import React, { useEffect, useState } from 'react'
import { planAdminAPI, appSettingAPI } from '@/apis'
import { useLocation } from 'react-router-dom'
import PlanCard from './PlanCard'
import AddPlanDialog from './AddPlanDialog'
import UpdatePlanDialog from './AddPlanDialog'
import SettingDialog from './SettingDialog'
import DeleteConfirmDialog from './DeleteConfirmDialog'
import { toast } from 'react-toastify'
import { FaGear } from 'react-icons/fa6'

const getValueByKey = (dataArray, targetKey) => {
    const setting = dataArray.find((item) => item.key === targetKey)
    return setting?.value ?? null
}

function Index() {
    const location = useLocation()
    const [plans, setPlans] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showAddPlanDialog, setShowAddPlanDialog] = useState(false)
    const [showUpdatePlanDialog, setShowUpdatePlanDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showSettingDialog, setShowSettingDialog] = useState(false)
    const [updatingPlan, setUpdatingPlan] = useState(null)
    const [deletingPlan, setDeletingPlan] = useState(null)

    const [freePlan, setFreePlan] = useState('')
    const [trialPlan, setTrialPlan] = useState('')
    const [duration, setDuration] = useState(null)

    const fetchPlans = async () => {
        setLoading(true)
        try {
            const plansResponse = await planAdminAPI.fetchPlans()
            if (
                plansResponse.status === 200 &&
                plansResponse.data.success === true
            ) {
                setPlans(plansResponse.data.data)
            }
        } catch (error) {
            setError('Không thể lấy danh sách gói')
        } finally {
            setLoading(false)
        }
    }

    const fetchStates = async () => {
        try {
            const response = await appSettingAPI.fetchKeys()
            if (response.status === 200) {
                const data = response.data
                setFreePlan(getValueByKey(data, 'FreePlan'))
                setTrialPlan(getValueByKey(data, 'DefaultTrialPlanName'))
                setDuration(Number(getValueByKey(data, 'TrialDurationInDays')))
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchPlans()
        fetchStates()
    }, [])

    useEffect(() => {
        if (location.state?.refetch) {
            fetchPlans()
        }
    }, [location.state])

    const handleOnDelete = (plan) => {
        setDeletingPlan(plan)
        setShowDeleteDialog(true)
    }

    // done
    const handleDelete = async (plan) => {
        try {
            const response = await planAdminAPI.deletePlan(plan.planId)
            if (response.status === 200) {
                fetchPlans()
                toast.success(response.data.message || 'Xóa gói thành công')
            }
            setDeletingPlan(null)
            setShowDeleteDialog(false)
        } catch (e) {
            toast.error('Không thể xóa gói')
            console.log(e)
        }
    }

    const handleOnUpdate = (plan) => {
        setUpdatingPlan(plan)
        setShowUpdatePlanDialog(true)
    }

    // done
    const handleUpdate = async (plan, planId) => {
        try {
            const response = await planAdminAPI.updatePlan(planId, plan)
            if (response.status === 200) {
                fetchPlans()
                toast.success(
                    response.data.message || 'Cập nhật gói thành công'
                )
            }
            setUpdatingPlan(null)
            setShowUpdatePlanDialog(false)
        } catch (e) {
            toast.error('Không thể cập nhật gói')
            console.log(e)
        } finally {
            setShowUpdatePlanDialog(false)
        }
    }

    // done
    const handleAdd = async (plan, planId) => {
        try {
            const response = await planAdminAPI.createPlan(plan)
            if (response.status === 200) {
                fetchPlans()
                toast.success(response.data.message || 'Tạo gói thành công')
            }
        } catch (error) {
            toast.error(error.message || 'Không thể tạo gói')
        } finally {
            setShowAddPlanDialog(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 font-sans relative">
            <main className="flex-grow py-10">
                <h1 className="text-3xl font-bold text-center mb-8">
                    Danh sách các gói
                </h1>

                <div className="py-4 px-8 flex justify-end gap-4">
                    <button
                        onClick={() => setShowAddPlanDialog(true)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 hover:cursor-pointer active:scale-95 transition duration-200 ease-in-out"
                        title="Thêm plan mới"
                    >
                        Thêm
                    </button>

                    <button
                        onClick={() => {
                            setUpdatingPlan(plans[0]),
                                setShowSettingDialog(true)
                        }}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 hover:cursor-pointer active:scale-95 transition duration-200 ease-in-out"
                        title="Thêm plan mới"
                    >
                        <FaGear />
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
                                            isFreePlan={
                                                plan.planName === freePlan
                                            }
                                            isTrialPlan={
                                                plan.planName === trialPlan
                                            }
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

            <SettingDialog
                isOpen={showSettingDialog}
                onClose={() => {
                    setShowSettingDialog(false), fetchStates()
                }}
                plans={plans}
            />
        </div>
    )
}

export default Index
