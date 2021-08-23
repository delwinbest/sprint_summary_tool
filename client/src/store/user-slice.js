import { createSlice } from "@reduxjs/toolkit";

const initialUserState = { email: null, id: null, name: null, role: null };

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    login(state, action) {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.id = action.payload.id;
      state.role = action.payload.role;
    },
    logout(state) {
      state.email = null;
      state.password = null;
      state.id = null;
      state.role = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const userActions = userSlice.actions;

export default userSlice.reducer;
