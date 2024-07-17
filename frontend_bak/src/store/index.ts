import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, shallowEqual, useDispatch, useSelector } from 'react-redux'
import { persistStore } from 'redux-persist'
import reducers from './modules'

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
    // serializableCheck: {
    //   ignoredActions: ['persist/PERSIST']
    // }
  }),
  devTools: true,
})

type GetStateFnType = typeof store.getState
type IRootState = ReturnType<GetStateFnType>
type dispatchType = typeof store.dispatch

export const persistor = persistStore(store)
export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector
export const useAppDispatch: () => dispatchType = useDispatch
export const useAppShallowEqual = shallowEqual
export default store
