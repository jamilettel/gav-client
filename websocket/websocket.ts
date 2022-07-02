interface Command {
    command: string
}

type Service = 'join-or-create' | 'delete' | 'list' | 'info' | 'describe'

type CommandBuiltinArgs = {
    name?: string
}

type CommandBuiltin = {
    session: Service
} & CommandBuiltinArgs

export default class WebsocketHandler {
    ws: WebSocket | null = null
    onConnectionChange?: (connected: boolean) => any

    constructor(onConnectionChange: (connected: boolean) => any) {
        this.onConnectionChange = onConnectionChange
    }

    connect(url: string) {
        this.ws = new WebSocket(url)

        this.ws.onopen = () => {
            console.log('connected to server ' + url)
            this.builtinCommand('describe')
            if (this.onConnectionChange) this.onConnectionChange(true)
        }

        this.ws.onmessage = (ws) => {
            try {
                const data = JSON.parse(ws.data)
                console.log(data)
            } catch (e) {}
        }

        this.ws.onclose = () => {
            if (this.onConnectionChange) this.onConnectionChange(false)
            this.ws = null
        }
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
