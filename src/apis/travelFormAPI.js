import authorizedAxios from './authorizedAxios'

const createItinerary = async (formData) => {
    return await authorizedAxios.post('api/AIGeneratePlan/CreateItinerary', {
        destination: formData.destination,
        travelDate: formData.travelDate,
        days: parseInt(formData.days),
        preferences:
            formData.preferences && formData.preferences.length > 0
                ? formData.preferences
                : null,
        budget: parseFloat(formData.budget),
        transportation: formData.transportation || null,
        diningStyle:
            formData.diningStyle && formData.diningStyle.length > 0
                ? formData.diningStyle
                : null,
        groupType: formData.groupType || null,
        accommodation: formData.accommodation || null
    })
}

export default {
    createItinerary
}
