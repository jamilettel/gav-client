import { RootState } from '@/utils/store'
import {
    GeneralStats,
    GenerationStats,
    InfoAllData,
    InfoOneGen,
    InfoSettingsUpdate,
    Setting,
} from '@/websocket/GenericHandler'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface GenericInitialState {
    generation?: number
    settings?: MenuSettings
    settingsRaw?: Settings
    graphData?: GraphData[]
    generalStats?: GeneralStats
}

const initialState: GenericInitialState = {}

export type GraphData = {
    name: string
    data: {
        [key: string]: number[]
    }
}

export type MenuSettings = {
    [key: string]: Setting &
        (
            | {
                  type: 'string'
                  currentValue: string
              }
            | {
                  type: 'number'
                  currentValue: number
              }
        )
}

type Settings = {
    [key: string]: Setting
}

function extractSettings(
    settings: Settings,
    oldMenus: MenuSettings
): MenuSettings {
    const newMenus = {} as MenuSettings
    for (const settingName in settings) {
        const setting = settings[settingName]
        if (setting.type === 'string') {
            let currentValue = setting.value
            if (
                oldMenus[settingName] !== undefined &&
                oldMenus[settingName].currentValue !==
                    oldMenus[settingName].value
            )
                currentValue = oldMenus[settingName].currentValue as string

            newMenus[settingName] = {
                ...setting,
                currentValue,
            }
        } else {
            let currentValue = setting.value
            if (
                oldMenus[settingName] !== undefined &&
                oldMenus[settingName].currentValue !==
                    oldMenus[settingName].value
            )
                currentValue = oldMenus[settingName].currentValue as number

            newMenus[settingName] = {
                ...setting,
                currentValue,
            }
        }
    }
    return newMenus
}

function getStats(
    data: GenerationStats[],
    graphData: GraphData[] = []
): GraphData[] {
    if (data.length === 0) return graphData

    for (const graphName in data[0])
        if (!graphData.find((gd) => gd.name === graphName))
            graphData.push({ name: graphName, data: {} })
    data.forEach((genStats) => {
        graphData!.forEach((graph) => {
            for (const statName in genStats[graph.name]) {
                if (graph.data[statName] === undefined)
                    graph.data[statName] = [genStats[graph.name][statName]]
                else graph.data[statName].push(genStats[graph.name][statName])
            }
        })
    })

    return graphData
}

const slice = createSlice({
    initialState,
    name: 'generic-protocol',
    reducers: {
        setAllDataGeneric: (state, action: PayloadAction<InfoAllData>) => {
            const data = action.payload.data
            state.generation = parseInt(data.general_stats.Generation ?? '0')
            state.generalStats = data.general_stats
            state.settingsRaw = data.settings
            state.settings = extractSettings(
                state.settingsRaw,
                state.settings ?? {}
            )
            state.graphData = getStats(data.all_stats)
        },
        addGenDataGeneric: (state, action: PayloadAction<InfoOneGen>) => {
            const data = action.payload.data
            state.generation = parseInt(data.general_stats.Generation ?? '0')
            state.generalStats = data.general_stats
            state.graphData = getStats([data.gen_stats], state.graphData)
        },
        updateSettingsGeneric: (
            state,
            action: PayloadAction<InfoSettingsUpdate>
        ) => {
            state.settingsRaw = action.payload.settings
            state.settings = extractSettings(
                state.settingsRaw,
                state.settings ?? {}
            )
        },
        resetAllSettingsGeneric: (state) => {
            if (state.settingsRaw)
                state.settings = extractSettings(state.settingsRaw, {})
        },
        setMenuValueGeneric: (
            state,
            action: PayloadAction<{ key: string; value: string | number }>
        ) => {
            if (state.settings == undefined || state.settings[action.payload.key] == undefined)
                return
            state.settings[action.payload.key].currentValue = action.payload.value
        },
    },
})

export const getGenericGraphData = (state: RootState) => state.generic.graphData
export const getGenericGeneration = (state: RootState) =>
    state.generic.generation

export const getGenericGeneralStats = (state: RootState) =>
    state.generic.generalStats

export const getSettings = (state: RootState) => state.generic.settings

export const {
    setAllDataGeneric,
    addGenDataGeneric,
    updateSettingsGeneric,
    resetAllSettingsGeneric,
    setMenuValueGeneric,
} = slice.actions
export default slice.reducer
