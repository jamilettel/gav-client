import { RootState } from '@/utils/store'
import GenericHandlers from '@/websocket/GenericHandler'
import {
    CommandHandler,
    SessionDescribeData,
} from '@/websocket/websocket-types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type ProtocolHandler = {
    protocol: string
    handlers: CommandHandler[]
}

const PROTOCOL_HANDLERS: ProtocolHandler[] = [
    { protocol: 'generic', handlers: GenericHandlers },
]

type BuiltinState = {
    protocol?: string
    handlersProtocol?: CommandHandler[]
    sessions?: string[]
    session?: string
    title?: string
}

const initialState: BuiltinState = {}

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
            state.handlersProtocol = PROTOCOL_HANDLERS.find(
                (ph) => ph.protocol === state.protocol
            )?.handlers
        },
    },
})

export const getSession = (state: RootState) => state.builtin.session
export const getSessions = (state: RootState) => state.builtin.sessions ?? []
export const getProtocol = (state: RootState) => state.builtin.protocol ?? ''
export const getTitle = (state: RootState) => state.builtin.title ?? ''
export const getHandlers = (state: RootState) =>
    state.builtin.handlersProtocol ?? []

export const { updateServerInfo, updateSession, updateSessionList } =
    slice.actions
export default slice.reducer
