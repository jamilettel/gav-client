import { LS_SERVER_URL } from '@/utils/constants'
import { AppDispatch, useAppDispatch } from '@/utils/store'
import {
    resetWS,
    sendWS,
    setConnectionStatus,
} from '@/websocket/connectionSlice'
import GenericHandlers from '@/websocket/GenericHandler'
import {
    Command,
    CommandBuiltin,
    CommandBuiltinArgs,
    CommandHandler,
    Service,
} from '@/websocket/websocket-types'
import WSBuiltinHandler from '@/websocket/WSBuiltinHandler'

type ProtocolHandler = {
    protocol: string
    handlers: CommandHandler[]
}

const PROTOCOL_HANDLERS: ProtocolHandler[] = [
    { protocol: 'generic', handlers: GenericHandlers },
]

const handlersBuiltin: CommandHandler[] = [
    {
        info: 'session_list',
        handler: WSBuiltinHandler.updateSessionList,
    },
    {
        info: 'session',
        handler: WSBuiltinHandler.updateSession,
    },
    {
        info: 'session_describe',
        handler: WSBuiltinHandler.updateServerInfo,
    },
]

export function configureWebsocket(
    ws: WebSocket,
    url: string,
    dispatch: AppDispatch
) {
    ws.onopen = () => {
        localStorage.setItem(LS_SERVER_URL, url)
        console.log('connecting to server ' + url)
        sendBuiltin(dispatch, 'describe')
        dispatch(setConnectionStatus(true))
    }

    ws.onclose = () => {
        console.log('CLOSE')
        dispatch(resetWS())
    }

    ws.onerror = () => {
        dispatch(resetWS())
    }

    // configures onmessage
    configureWebsocketProtocol(ws, '', dispatch)
}

export function configureWebsocketProtocol(
    ws: WebSocket,
    protocol: string,
    dispatch: AppDispatch
) {
    const protocolHandler = PROTOCOL_HANDLERS.find(
        (p) => p.protocol === protocol
    )?.handlers

    ws.onmessage = (msg) => {
        try {
            const data = JSON.parse(msg.data)
            const info = data.info
            if (typeof info === 'string') {
                const handler =
                    handlersBuiltin.find((h) => h.info === info) ??
                    protocolHandler?.find((h) => h.info === info)
                handler?.handler(dispatch, data)
            }
        } catch (e) {
            console.log(e)
        }
    }
}

export function sendBuiltin(
    dispatch: AppDispatch,
    command: Service,
    args?: CommandBuiltinArgs
) {
    dispatch(
        sendWS(
            JSON.stringify({
                ...args,
                session: command,
            } as CommandBuiltin)
        )
    )
}

export function sendCommand(
    dispatch: AppDispatch,
    command: string,
    args?: any
) {
    dispatch(
        sendWS(
            JSON.stringify({
                ...args,
                command: command,
            } as Command)
        )
    )
}
