import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    value: {
      first_name: "",
      last_name: "",
      email: "",
      token: "",
      _id: "",
      subscription_data: {},
    },
  },
  reducers: {
    updateUserData: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateUserData } = userSlice.actions;

export default userSlice.reducer;
