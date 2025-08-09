import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        showNotification(state, action) {
            return action.payload
        },
        clearNotification() {
            return ''
        }
    }
})

export const { showNotification, clearNotification } = notificationSlice.actions

let timeoutId

export const setNotification = (message, seconds) => {
  return async dispatch => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    dispatch(showNotification(message))
    
    timeoutId = setTimeout(() => {
      dispatch(clearNotification())
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer