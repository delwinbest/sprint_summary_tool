import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import userSliceReducer from "./user-slice";

const store = configureStore({
  reducer: {
    user: userSliceReducer,
  },
  devTools: true,
});
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch(); // Export a hook that can be reused to resolve types

export default store;
