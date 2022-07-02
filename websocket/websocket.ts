import {
    CommandBuiltin,
    CommandBuiltinArgs,
    CommandHandler,
    Service,
    SessionData,
    SessionDescribeData,
    SessionListData,
} from '@/websocket/websocket-types'

export default class WebsocketHandler {
    ws: WebSocket | null = null
    onUpdate?: () => any
    sessions: string[] = []
    session: string | null = null
    protocol: string | null = null

    handlers: CommandHandler[] = [
        {
            info: 'session_list',
            handler: (data: any) => this.updateSessionList(data),
        },
        {
            info: 'session',
            handler: (data: any) => this.updateSession(data),
        },
        {
            info: 'session_describe',
            handler: (data: any) => this.updateProtocol(data),
        },
    ]

    updateSessionList(data: SessionListData) {
        this.sessions = data.sessions
    }

    updateSession(data: SessionData) {
        this.session = data.session
    }

    updateProtocol(data: SessionDescribeData) {
        this.protocol = data.command_protocol
    }

    connect(url: string) {
        try {
            this.ws = new WebSocket(url)

            this.ws.onopen = () => {
                console.log('connected to server ' + url)
                this.builtinCommand('describe')
                if (this.onUpdate) this.onUpdate()
            }

            this.ws.onmessage = (ws) => {
                try {
                    const data = JSON.parse(ws.data)
                    if (typeof data.info === 'string') {
                        this.handlers.find(value => value.info === data.info)?.handler(data)
                        if (this.onUpdate) this.onUpdate()
                    }
                } catch (e) {}
            }

            this.ws.onclose = () => {
                this.ws = null
                if (this.onUpdate) this.onUpdate()
            }
        } catch {}
    }

    builtinCommand(command: Service, args?: CommandBuiltinArgs) {
        this.ws?.send(
            JSON.stringify({
                ...args,
                session: command,
            } as CommandBuiltin)
        )
    }

    isConnected(): boolean {
        return this.ws?.OPEN === 1 ?? false
    }
}
