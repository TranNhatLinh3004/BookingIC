// userSlice.js
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  email: "",
  username: "",
  avatar: "",
  _id: "",
  user_type: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      const { _id, username, email, avatar, user_type } = action.payload;
      state._id = _id;
      state.username = username;
      state.email = email;
      state.avatar = avatar;
      state.user_type = user_type;
    },
    logout: (state) => {
      state._id = "";
      state.username = "";
      state.email = "";
      state.avatar = "";
      state.user_type = "";
    },
    updateUserInfo: (state, action) => {
      const { _id, username, email, avatar, user_type } = action.payload;
      state._id = _id;
      state.username = username;
      state.email = email;
      state.avatar = avatar;
      state.user_type = user_type;
    },
  },
});

export const { login, logout, updateUserInfo } = userSlice.actions;
export default userSlice.reducer;
