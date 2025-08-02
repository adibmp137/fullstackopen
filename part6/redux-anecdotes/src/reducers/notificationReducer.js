import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
    name: 'notification',
    initialState:'render here notification...',
    reducers: {
        notificationChange(state, action) {
            return state
        }
    }
})

export default notificationSlice.reducer