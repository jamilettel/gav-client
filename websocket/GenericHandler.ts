import {
    addGenDataGeneric,
    MenuSettings,
    setAllDataGeneric,
    updateSettingsGeneric,
} from '@/modules/generic/genericSlice'
import { AppDispatch } from '@/utils/store'
import { sendCommand } from '@/websocket/websocket'
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

export type GenerationStats = {
    // graph name
    [key: string]: {
        // line name & value
        [key: string]: number
    }
}

export type GeneralStats = {
    Generation: string
    [key: string]: string
}

export type Individual = {
    Chromomose: number[]
    [key: string]: any
}

export type IndividualEncoding =
    | {
          encoding_type: 'indexes' | 'boolean'
      }
    | {
          encoding_type: 'range'
          range: [number, number]
      }

export type InfoAllData = {
    info: 'all'
    data: {
        general_stats: GeneralStats
        // each element represents one generation
        all_stats: GenerationStats[]
        population: Individual[]
        individual_encoding: IndividualEncoding
        settings: {
            // setting name & value
            [key: string]: Setting
        }
    }
}

export type InfoOneGen = {
    info: 'one-gen'
    data: {
        general_stats: GeneralStats
        gen_stats: GenerationStats
        population: Individual[]
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
    {
        info: 'settings-update',
        handler: (dispatch, data: InfoSettingsUpdate) => {
            dispatch(updateSettingsGeneric(data))
        },
    },
]

export function saveSettingsGeneric(
    dispatch: AppDispatch,
    menus: MenuSettings
) {
    let settings: {
        [setting_name: string]: string | number
    } = {}
    let empty = true

    for (const menuName in menus) {
        if (menus[menuName].currentValue !== menus[menuName].value) {
            settings[menuName] = menus[menuName].currentValue
            empty = false
        }
    }

    if (!empty) sendCommand(dispatch, 'set-setting', { settings })
}

export default GenericHandlers
