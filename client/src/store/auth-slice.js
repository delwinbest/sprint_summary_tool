import { createSlice } from "@reduxjs/toolkit";

const initialUserState = { email: null, id: null, name: null };

const authSlice = createSlice({
  name: "authentication",
  initialState: initialUserState,
  reducers: {
    login(state, action) {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.id = action.payload.id;
    },
    logout(state) {
      state.email = null;
      state.password = null;
      state.id = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const authActions = authSlice.actions;

export default authSlice.reducer;
