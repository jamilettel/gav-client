import WebsocketHandler from '@/websocket/websocket'

export interface Command {
    command: string
}

export type Service = 'join-or-create' | 'delete' | 'list' | 'info' | 'describe'

export type CommandHandler = { info: string; handler: (wsh: WebsocketHandler, data: any) => any }

export type CommandBuiltinArgs = {
    name?: string
}

export type CommandBuiltin = {
    session: Service
} & CommandBuiltinArgs

export type SessionListData = {
    info: 'session_list',
    sessions: string[]
}

export type SessionData = {
    info: 'session',
    session: string | null
}

export type SessionDescribeData = {
    info: 'session',
    command_protocol: string
}
