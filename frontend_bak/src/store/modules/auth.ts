import { createSlice } from "@reduxjs/toolkit";
import { userDto } from "../../types";

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: '',
    profile: {} as userDto,
  },
  reducers: {
    setToken(state, { payload }) {
      state.token = payload
    },
    setProfile(state, { payload }) {
      state.profile = payload
    }
  }
})

export const { setToken, setProfile } = authSlice.actions;