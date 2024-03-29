import { RootState } from '@/utils/store'
import {
    GeneralStats,
    GenerationStats,
    Individual,
    IndividualEncoding,
    InfoAllData,
    InfoOneGen,
    InfoSettingsChangelog,
    InfoSettingsUpdate,
    InfoStatus,
    Setting,
    SettingChangelog,
    Status,
} from '@/websocket/GenericHandler'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface GenericInitialState {
    generation?: number
    settings?: MenuSettings
    settingsRaw?: Settings
    graphData?: GraphData[]
    generalStats?: GeneralStats
    populations?: Individual[][]
    individual_encoding?: IndividualEncoding
    status?: Status
    settings_changelog?: SettingChangelog[]
    shownGenerationPop: number
}

const initialState: GenericInitialState = {
    shownGenerationPop: 0,
}

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

export type Settings = {
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
            state.populations = data.populations
            state.individual_encoding = data.individual_encoding
            state.status = action.payload.data.status
            state.settings_changelog = action.payload.data.settings_changelog
        },
        addGenDataGeneric: (state, action: PayloadAction<InfoOneGen>) => {
            const data = action.payload.data
            state.generation = parseInt(data.general_stats.Generation ?? '0')
            state.generalStats = data.general_stats
            state.graphData = getStats([data.gen_stats], state.graphData)
            state.populations?.push(data.population)
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
            if (
                state.settings == undefined ||
                state.settings[action.payload.key] == undefined
            )
                return
            state.settings[action.payload.key].currentValue =
                action.payload.value
        },
        updateStatusGeneric: (state, action: PayloadAction<InfoStatus>) => {
            state.status = action.payload.status
        },
        updateSettingsChangelogGeneric: (
            state,
            action: PayloadAction<InfoSettingsChangelog>
        ) => {
            state.settings_changelog = action.payload.settings_changelog
        },
        resetGeneric: () => initialState,
        showLastGenericPop: (state) => {
            state.shownGenerationPop = (state.populations?.length ?? 1) - 1
        },
        showFirstGenericPop: (state) => {
            state.shownGenerationPop = 0
        },
        showNextGenericPop: (state) => {
            const max = (state.populations?.length ?? 1) - 1
            state.shownGenerationPop = Math.min(
                max,
                state.shownGenerationPop + 1
            )
        },
        showPreviousGenericPop: (state) => {
            state.shownGenerationPop = Math.max(0, state.shownGenerationPop - 1)
        },
        setShownGenericPop: (state, action: PayloadAction<number>) => {
            const max = (state.populations?.length ?? 1) - 1
            state.shownGenerationPop = Math.max(
                0,
                Math.min(max, Math.floor(action.payload))
            )
        },
    },
})

export const getGenericGraphData = (state: RootState) => state.generic.graphData
export const getGenericGeneration = (state: RootState) =>
    state.generic.generation

export const getGenericGeneralStats = (state: RootState) =>
    state.generic.generalStats

export const getSettings = (state: RootState) => state.generic.settings

export const getGenericIndividualEncoding = (state: RootState) =>
    state.generic.individual_encoding

export const getGenericPopulations = (state: RootState) =>
    state.generic.populations

export const getGenericStatus = (state: RootState) => state.generic.status

export const getGenericSettingsChangelog = (state: RootState) =>
    state.generic.settings_changelog

export const getShownGenericPop = (state: RootState) =>
    state.generic.shownGenerationPop

export const {
    setAllDataGeneric,
    addGenDataGeneric,
    updateSettingsGeneric,
    resetAllSettingsGeneric,
    setMenuValueGeneric,
    resetGeneric,
    updateStatusGeneric,
    updateSettingsChangelogGeneric,
    setShownGenericPop,
    showFirstGenericPop,
    showLastGenericPop,
    showNextGenericPop,
    showPreviousGenericPop,
} = slice.actions
export default slice.reducer
