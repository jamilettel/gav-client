import { LS_SERVER_URL } from '@/utils/constants'
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
    url: string | null = null
    title?: string

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
            handler: WSBuiltinHandler.updateServerInfo,
        },
    ]

    handlersProtocol: CommandHandler[] = []

    disconnect() {
        this.ws?.close()
    }

    reset() {
        this.ws = null
        this.data = {}
        this.protocol = null
        this.session = null
        this.sessions = []
        this.url = null
    }

    connect(url: string) {
        try {
            this.ws = new WebSocket(url)

            this.ws.onopen = () => {
                localStorage.setItem(LS_SERVER_URL, url)
                console.log('connected to server ' + url)
                this.url = url
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
                this.reset()
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
