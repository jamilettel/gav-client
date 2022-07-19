import { AppDispatch } from '@/utils/store'

export interface Command {
    command: string
}

export type Service = 'join-or-create' | 'leave' | 'delete' | 'list' | 'info' | 'describe'

export type CommandHandler = {
    info: string
    handler: (dispatch: AppDispatch, data: any) => any
}

export type CommandBuiltinArgs = {
    name?: string
}

export type CommandBuiltin = {
    session: Service
} & CommandBuiltinArgs

export type SessionListData = {
    info: 'session_list'
    sessions: string[]
}

export type SessionInfo = {
    info: 'session'
    session: string | null
}

export type SessionDescribeData = {
    info: 'session'
    title: string
    command_protocol: string
}
