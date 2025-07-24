import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { planAPI } from '@/apis'

// Thunk async để gọi API
export const fetchRemainingRequests = createAsyncThunk(
    'plan/fetchRemainingRequests',
    async (userId, { rejectWithValue }) => {
        try {
            const res = await planAPI.getCurrentRequest(userId)
            console.log('API response in planSlice:', res.data)
            return res.data.remainingRequests
        } catch (err) {
            return rejectWithValue(err.response?.data || 'Lỗi khi fetch')
        }
    }
)

const planSlice = createSlice({
    name: 'plan',
    initialState: {
        remainingRequests: 0,
        loading: false,
        error: null
    },
    reducers: {
        setRemainingRequests(state, action) {
            state.remainingRequests = action.payload
        },
        decrementRequest(state) {
            state.remainingRequests -= 1
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRemainingRequests.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchRemainingRequests.fulfilled, (state, action) => {
                state.remainingRequests = action.payload
                state.loading = false
            })
            .addCase(fetchRemainingRequests.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export const { setRemainingRequests, decrementRequest } = planSlice.actions
export default planSlice.reducer
