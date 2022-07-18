import { AppDispatch, RootState } from '@/utils/store'
import {
    configureWebsocket,
    configureWebsocketProtocol,
} from '@/websocket/websocket'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type ConnectionState = {
    ws?: WebSocket
    url?: string
    connected: boolean
    status: 'idle' | 'loading' | 'failed'
}

const initialState: ConnectionState = {
    status: 'idle',
    connected: false,
}

interface PayloadConnect {
    url: string
    dispatch: AppDispatch
}

interface PayloadProtocol {
    protocol: string
    dispatch: AppDispatch
}

const connectionSlice = createSlice({
    name: 'connection',
    initialState: initialState,
    reducers: {
        connectWS: (state, action: PayloadAction<PayloadConnect>) => {
            const url = action.payload.url
            const dispatch = action.payload.dispatch
            try {
                state.status = 'loading'
                state.ws = new WebSocket(url)
                state.url = url
                configureWebsocket(state.ws, url, dispatch)
            } catch {
                state.status = 'failed'
            }
        },
        setConnectionStatus: (state, action: PayloadAction<boolean>) => {
            const connected = action.payload
            state.status = connected ? 'idle' : 'failed'
            state.connected = connected
        },
        disconnectWS: (state) => {
            state.ws?.close()
        },
        resetWS: () => {
            return initialState
        },
        sendWS: (state, action: PayloadAction<string>) => {
            state.ws?.send(action.payload)
        },
        setProtocolWS: (state, action: PayloadAction<PayloadProtocol>) => {
            configureWebsocketProtocol(
                state.ws!,
                action.payload.protocol,
                action.payload.dispatch
            )
        },
    },
})

export const isWebsocketConnected = (state: RootState) =>
    state.connection.connected

export const getWebsocket = (state: RootState) => state.connection.ws

export const {
    connectWS,
    resetWS,
    sendWS,
    setConnectionStatus,
    setProtocolWS,
    disconnectWS,
} = connectionSlice.actions
export default connectionSlice.reducer
