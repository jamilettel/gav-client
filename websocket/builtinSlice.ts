import { RootState } from '@/utils/store'
import { SessionDescribeData } from '@/websocket/websocket-types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type BuiltinState = {
    protocol?: string
    sessions?: string[]
    session?: string
    title?: string
    createdSession: boolean
}

const initialState: BuiltinState = {
    createdSession: false
}

const slice = createSlice({
    name: 'builtlin',
    initialState,
    reducers: {
        updateSessionList: (state, action: PayloadAction<string[]>) => {
            state.sessions = action.payload
        },
        updateSession: (state, action: PayloadAction<string | undefined>) => {
            state.session = action.payload
        },
        updateServerInfo: (
            state,
            action: PayloadAction<SessionDescribeData>
        ) => {
            state.protocol = action.payload.command_protocol
            state.title = action.payload.title
        },
        setCreatedSession: (state, action: PayloadAction<boolean>) => {
            state.createdSession = action.payload
        }
    },
})

export const getSession = (state: RootState) => state.builtin.session
export const getSessions = (state: RootState) => state.builtin.sessions ?? []
export const getProtocol = (state: RootState) => state.builtin.protocol ?? ''
export const getTitle = (state: RootState) => state.builtin.title ?? ''
export const getCreatedSession = (state: RootState) => state.builtin.createdSession

export const { updateServerInfo, updateSession, updateSessionList, setCreatedSession } =
    slice.actions
export default slice.reducer
