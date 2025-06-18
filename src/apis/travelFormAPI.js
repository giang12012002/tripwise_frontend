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

export default {
    createItinerary
}
