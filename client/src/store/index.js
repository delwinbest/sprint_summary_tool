import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import authSliceReducer from "./auth-slice";

const store = configureStore({
  reducer: {
    auth: authSliceReducer,
  },
  devTools: true,
});
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch(); // Export a hook that can be reused to resolve types

export default store;
