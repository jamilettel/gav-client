import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import builtinSlice from '@/websocket/builtinSlice'
import connectionSlice from '@/websocket/connectionSlice'
import genericSlice from '@/modules/generic/genericSlice'

const store = configureStore({
    reducer: {
        connection: connectionSlice,
        builtin: builtinSlice,
        generic: genericSlice,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({ serializableCheck: false })
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
