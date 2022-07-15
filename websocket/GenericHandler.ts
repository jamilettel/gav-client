import { CommandHandler } from '@/websocket/websocket-types'

type Setting =
    | {
          type: 'number'
          value: number
          range?: [number, number]
          min_increment?: number
      }
    | {
          type: 'string'
          value: string
          values?: string[]
      }

export type GenericProtocolData = {
    generation?: number
    settings?: {
        [key: string]: Setting
    },
    generation_stats?: {
        [key: string]: {
            [key: string]: number
        }
    }[]
}

type InfoAllData = {
    info: 'all'
    data: {
        generation: number
        // each element represents one generation
        all_stats: {
            // graph name
            [key: string]: {
                // line name & value
                [key: string]: number
            }
        }[]
        settings: {
            // setting name & value
            [key: string]: Setting
        }
    }
}

type InfoOneGen = {
    info: 'one-gen'
    data: {
        generation: number
        gen_stats: { [key: string]: { [key: string]: number } }
    }
}

type InfoSettingsUpdate = {
    info: 'settings-update'
    settings: { [key: string]: Setting }
}

const GenericHandlers: CommandHandler[] = [
    {
        info: 'all',
        handler: (wsh, data: InfoAllData) => {
            ;(wsh.data as GenericProtocolData).generation = data.data.generation
            ;(wsh.data as GenericProtocolData).generation_stats =
                data.data.all_stats
            ;(wsh.data as GenericProtocolData).settings = data.data.settings
        },
    },
    {
        info: 'one-gen',
        handler: (wsh, data: InfoOneGen) => {
            ;(wsh.data as GenericProtocolData).generation = data.data.generation
            ;(wsh.data as GenericProtocolData).generation_stats?.push(
                data.data.gen_stats
            )
        },
    },
    {
        info: 'settings-update',
        handler: (wsh, data: InfoSettingsUpdate) => {
            ;(wsh.data as GenericProtocolData).settings = data.settings
        },
    },
]

export default GenericHandlers
