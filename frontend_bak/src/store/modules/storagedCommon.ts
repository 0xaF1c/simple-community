import { createSlice } from "@reduxjs/toolkit"

export const storagedCommonSlice = createSlice({
  name: "storagedCommon",
  initialState: {
    language: (navigator.language.replace('-', '') ?? '') as string,
    darkMode: true,
    autoDarkMode: false,
  },
  reducers: {
    setLanguage: (state, action: { payload: string }) => {
      state.language = action.payload
    },
    setDarkMode: (state, action: { payload: boolean }) => {
      state.darkMode = action.payload
    },
    setAutoDarkMode: (state, action: { payload: boolean }) => {
      state.autoDarkMode = action.payload
    }
  }
})

export const { setLanguage, setDarkMode, setAutoDarkMode } = storagedCommonSlice.actions