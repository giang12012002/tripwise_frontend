import { configureStore } from '@reduxjs/toolkit'
import planReducer from './planSlice'

const store = configureStore({
    reducer: {
        plan: planReducer
    }
})

export default store
