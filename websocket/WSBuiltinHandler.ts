import WebsocketHandler from '@/websocket/websocket'
import { CommandHandler, SessionData, SessionDescribeData, SessionListData } from '@/websocket/websocket-types'

type ProtocolHandler = {
    protocol: string,
    handlers: CommandHandler[],
}

const PROTOCOL_HANDLERS: ProtocolHandler[] = [
    {
        protocol: 'generic',
        handlers: []
    }
]

export default class WSBuiltinHandler {
    static updateSessionList(wsh: WebsocketHandler, data: SessionListData) {
        wsh.sessions = data.sessions
    }

    static updateSession(wsh: WebsocketHandler, data: SessionData) {
        wsh.session = data.session
    }

    static updateProtocol(wsh: WebsocketHandler, data: SessionDescribeData) {
        wsh.protocol = data.command_protocol
        wsh.handlersProtocol = PROTOCOL_HANDLERS.find(ph => ph.protocol === wsh.protocol)?.handlers ?? []
    }

}
