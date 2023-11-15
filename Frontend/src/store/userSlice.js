import { createSlice } from "@reduxjs/toolkit";

const initialState = () => {
  return {
    user: JSON.parse(localStorage.getItem("user-shophub")) || null,
  };
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState(),
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user-shophub", JSON.stringify(action.payload));
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user-shophub", JSON.stringify(state.user));
    },
    removeUser: (state) => {
      state.user = null;
      localStorage.removeItem("user-shophub");
      document.cookie=
        "user_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      ;
    },
  },
});

export const { setUser, updateUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
