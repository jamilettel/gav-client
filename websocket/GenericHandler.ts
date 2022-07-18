import {
    addGenDataGeneric,
    setAllDataGeneric,
    updateSettingsGeneric,
} from '@/modules/generic/genericSlice'
import { CommandHandler } from '@/websocket/websocket-types'

export type Setting =
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
        [key: string]: {
            [key: string]: number
        }
    }[]
}

export type InfoAllData = {
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

export type InfoOneGen = {
    info: 'one-gen'
    data: {
        generation: number
        gen_stats: { [key: string]: { [key: string]: number } }
    }
}

export type InfoSettingsUpdate = {
    info: 'settings-update'
    settings: { [key: string]: Setting }
}

const GenericHandlers: CommandHandler[] = [
    {
        info: 'all',
        handler: (dispatch, data: InfoAllData) =>
            dispatch(setAllDataGeneric(data)),
    },
    {
        info: 'one-gen',
        handler: (dispatch, data: InfoOneGen) =>
            dispatch(addGenDataGeneric(data)),
    },
    {
        info: 'settings-update',
        handler: (dispatch, data: InfoSettingsUpdate) => {
            dispatch(updateSettingsGeneric(data))
        },
    },
]

export default GenericHandlers
