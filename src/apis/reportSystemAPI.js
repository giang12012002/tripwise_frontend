import authorizedAxios from './authorizedAxios'

const reportSystemAPI = {
    fetchRevenueSummary: async (fromDate, toDate) => {
        const response = await authorizedAxios.get(
            '/api/reports/get-revenue-summary',
            {
                params: { fromDate, toDate }
            }
        )
        return response.data
    },
    exportRevenueSummary: async (fromDate, toDate) => {
        const response = await authorizedAxios.get(
            '/api/reports/revenue-summary/export',
            {
                params: { fromDate, toDate },
                responseType: 'blob'
            }
        )
        return response.data
    },
    fetchPartnerPerformance: async (fromDate, toDate) => {
        const response = await authorizedAxios.get(
            '/api/reports/get-partner-performance',
            {
                params: { fromDate, toDate }
            }
        )
        return response.data
    },
    exportPartnerPerformance: async (fromDate, toDate) => {
        const response = await authorizedAxios.get(
            '/api/reports/partner-performance/export',
            {
                params: { fromDate, toDate },
                responseType: 'blob'
            }
        )
        return response.data
    },
    fetchTourBookingStats: async (fromDate, toDate) => {
        const response = await authorizedAxios.get(
            '/api/reports/get-tour-booking-stats',
            {
                params: { fromDate, toDate }
            }
        )
        return response.data
    },
    exportTourBookingStats: async (fromDate, toDate) => {
        const response = await authorizedAxios.get(
            '/api/reports/tour-booking-stats/export',
            {
                params: { fromDate, toDate },
                responseType: 'blob'
            }
        )
        return response.data
    },
    getAnnualAdminStats: async (year) => {
        const response = await authorizedAxios.get(
            '/api/reports/total-statistic',
            {
                params: { year }
            }
        )
        return response.data
    },

    fetchDashboardStatistics: async () => {
        const response = await authorizedAxios.get(
            '/api/reports/get-dashboard-statistics'
        )
        return response.data
    }
}

export default reportSystemAPI
