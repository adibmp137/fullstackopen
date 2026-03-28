import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: { message: null, color: "red" },
  reducers: {
    setNotification(state, action) {
      return action.payload;
    },
    clearNotification() {
      return { message: null, color: "red" };
    },
  },
});

export const { setNotification, clearNotification } = notificationSlice.actions;

let timeoutId = null;

export const showNotification = (message, color, duration = 5) => {
  return (dispatch) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    dispatch(setNotification({ message, color }));
    timeoutId = setTimeout(() => {
      dispatch(clearNotification());
    }, duration * 1000);
  };
};

export default notificationSlice.reducer;
