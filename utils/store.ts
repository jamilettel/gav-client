import { combineReducers, configureStore, PayloadAction } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import builtinSlice from '@/websocket/builtinSlice'
import connectionSlice, { resetWS } from '@/websocket/connectionSlice'
import genericSlice from '@/modules/generic/genericSlice'
import slice from '@/modules/generic/population/colorsSlice'

const reducers = combineReducers({
    connection: connectionSlice,
    builtin: builtinSlice,
    generic: genericSlice,
    colors: slice,
})

const rootReducer = (state: any, action: PayloadAction<any>) => {
    if (action.type === resetWS.toString())
        state = undefined
    return reducers(state, action)
}

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({ serializableCheck: false })
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
