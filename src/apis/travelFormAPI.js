import authorizedAxios from './authorizedAxios'

const createItinerary = async (formData) => {
    return await authorizedAxios.post('api/AIGeneratePlan/CreateItinerary', {
        destination: formData.destination,
        travelDate: formData.travelDate,
        days: parseInt(formData.days),
        preferences: formData.preferences || 'General sightseeing',
        budgetVND: parseFloat(formData.budget), // Send budget as a number
        transportation: formData.transportation || null,
        diningStyle: formData.diningStyle || null,
        groupType: formData.groupType || null,
        accommodation: formData.accommodation || null
    })
}
const saveTourFromGenerated = async (generatePlanId) => {
    const response = await authorizedAxios.post(
        `api/AIGeneratePlan/SaveTourFromGenerated/${generatePlanId}`
    )
    console.log('saveTourFromGenerated response:', response.data)
    return response
}
const getToursByUserId = async (userId) => {
    return await authorizedAxios.get(
        `api/AIGeneratePlan/GetToursByUserId?userId=${userId}`
    )
}

export default {
    createItinerary,
    saveTourFromGenerated,
    getToursByUserId
}
