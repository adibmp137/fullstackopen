import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
    name: 'notification',
    initialState: ['init', ''],
    reducers: {
        notificationChange(state, action) {
            if (action.payload[0] === 'vote') {
                return ['you voted', action.payload[1]]
            }
            if (action.payload[0] === 'new') {
                return ['you added', action.payload[1]]
            }
            if (action.payload[0] === 'init') {
                return action.payload
            }
            return state
        }
    }
})

export const { notificationChange } = notificationSlice.actions
export default notificationSlice.reducer