import { createSlice } from "@reduxjs/toolkit";

export const branchSlice = createSlice({
  name: "branch",
  initialState: {
    value: [{
      _id: "",
      name: "",
      location: "",
      user_id: "",
    }],
  },
  reducers: {
    updatebranchData: (state, action) => {
      state.value =action.payload;
    },

  
  },
});

// Action creators are generated for each case reducer function
export const { updatebranchData,  } = branchSlice.actions;

export default branchSlice.reducer;
