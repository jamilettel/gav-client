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

// export default class WebsocketHandler {
//     ws: WebSocket | null = null
//     onUpdate?: () => any
//     sessions: string[] = []
//     session: string | null = null
//     protocol: string | null = null
//     data: any = {}
//     url: string | null = null
//     title?: string

//     handlersBuiltin: CommandHandler[] = [
//         {
//             info: 'session_list',
//             handler: WSBuiltinHandler.updateSessionList,
//         },
//         {
//             info: 'session',
//             handler: WSBuiltinHandler.updateSession,
//         },
//         {
//             info: 'session_describe',
//             handler: WSBuiltinHandler.updateServerInfo,
//         },
//     ]

//     handlersProtocol: CommandHandler[] = []

//     disconnect() {
//         this.ws?.close()
//     }

//     reset() {
//         this.ws = null
//         this.data = {}
//         this.protocol = null
//         this.session = null
//         this.sessions = []
//         this.url = null
//     }

//     connect(url: string) {
//         try {
//             this.ws = new WebSocket(url)

//             this.ws.onopen = () => {
//                 localStorage.setItem(LS_SERVER_URL, url)
//                 console.log('connected to server ' + url)
//                 this.url = url
//                 this.builtinCommand('describe')
//                 if (this.onUpdate) this.onUpdate()
//             }

//             this.ws.onmessage = (ws) => {
//                 try {
//                     const data = JSON.parse(ws.data)
//                     if (typeof data.info === 'string') {
//                         let handler =
//                             this.handlersBuiltin.find(
//                                 (h) => h.info === data.info
//                             ) ??
//                             this.handlersProtocol.find(
//                                 (h) => h.info === data.info
//                             )
//                         handler?.handler(this, data)
//                         if (this.onUpdate) this.onUpdate()
//                     }
//                 } catch (e) {}
//             }

//             this.ws.onclose = () => {
//                 this.reset()
//                 if (this.onUpdate) this.onUpdate()
//             }
//         } catch {}
//     }

//     builtinCommand(command: Service, args?: CommandBuiltinArgs) {
//         this.ws?.send(
//             JSON.stringify({
//                 ...args,
//                 session: command,
//             } as CommandBuiltin)
//         )
//     }

//     command(command: string, args?: any) {
//         this.ws?.send(
//             JSON.stringify({
//                 ...args,
//                 command,
//             } as CommandBuiltin)
//         )
//     }

//     isConnected(): boolean {
//         return this.ws?.OPEN === 1 ?? false
//     }
// }
