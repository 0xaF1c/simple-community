import { combineReducers } from '@reduxjs/toolkit'
import persistReducer from 'redux-persist/es/persistReducer'
import { persistConfig } from '../persistConfig'
import { storagedCommonSlice } from './storagedCommon'
import { common } from './common'
import { authSlice } from './auth'

const storage = combineReducers({
  common: storagedCommonSlice.reducer,
  auth: authSlice.reducer,
})

export default combineReducers({
  storage: persistReducer(persistConfig, storage),
  common: common.reducer,
})


// export default combineSlices(
//   common,
//   storagedCommonSlice,
//   {
//     storagedCommon: persistReducer(persistConfig, storagedCommonSlice.reducer)
//   }
// )