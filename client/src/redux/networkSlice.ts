import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export const networkSlice = createSlice({
  name: 'network',
  initialState: { isOnline: navigator.onLine },
  reducers: {
    setOnline: (state, action: PayloadAction<boolean>) => {
        console.log("updationg state",action.payload)
      state.isOnline = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setOnline } = networkSlice.actions;

export default networkSlice.reducer;
