import { LS_SESSION_NAME } from '@/utils/constants'
import GenericHandlers from '@/websocket/GenericHandler'
import WebsocketHandler from '@/websocket/websocket'
import {
    CommandHandler,
    SessionData,
    SessionDescribeData,
    SessionListData,
} from '@/websocket/websocket-types'

type ProtocolHandler = {
    protocol: string
    handlers: CommandHandler[]
}

const PROTOCOL_HANDLERS: ProtocolHandler[] = [
    { protocol: 'generic', handlers: GenericHandlers },
]

export default class WSBuiltinHandler {
    static updateSessionList(wsh: WebsocketHandler, data: SessionListData) {
        wsh.sessions = data.sessions
    }

    static updateSession(wsh: WebsocketHandler, data: SessionData) {
        wsh.session = data.session
        localStorage.setItem(LS_SESSION_NAME, data.session ?? '')
    }

    static updateServerInfo(wsh: WebsocketHandler, data: SessionDescribeData) {
        wsh.protocol = data.command_protocol
        wsh.title = data.title
        wsh.handlersProtocol =
            PROTOCOL_HANDLERS.find((ph) => ph.protocol === wsh.protocol)
                ?.handlers ?? []
    }
}
