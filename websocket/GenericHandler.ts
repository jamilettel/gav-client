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
    }
    generation_stats?: {
        [key: string]: string
    }[]
}

type InfoAllData = {
    info: 'all'
    data: {
        generation: number
        all_stats: [{ [key: string]: string }]
        settings: {
            [key: string]: Setting
        }
    }
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
]

export default GenericHandlers
