import {
    CommandBuiltin,
    CommandBuiltinArgs,
    CommandHandler,
    Service,
} from '@/websocket/websocket-types'
import WSBuiltinHandler from '@/websocket/WSBuiltinHandler'

export default class WebsocketHandler {
    ws: WebSocket | null = null
    onUpdate?: () => any
    sessions: string[] = []
    session: string | null = null
    protocol: string | null = null
    data: any = {}

    handlersBuiltin: CommandHandler[] = [
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
            handler: WSBuiltinHandler.updateProtocol,
        },
    ]

    handlersProtocol: CommandHandler[] = []

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
                        let handler =
                            this.handlersBuiltin.find(
                                (h) => h.info === data.info
                            ) ??
                            this.handlersProtocol.find(
                                (h) => h.info === data.info
                            )
                        handler?.handler(this, data)
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

    command(command: string, args?: any) {
        this.ws?.send(
            JSON.stringify({
                ...args,
                command,
            } as CommandBuiltin)
        )
    }

    isConnected(): boolean {
        return this.ws?.OPEN === 1 ?? false
    }
}
