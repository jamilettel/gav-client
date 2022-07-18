import { RootState } from '@/utils/store'
import {
    InfoAllData,
    InfoOneGen,
    InfoSettingsUpdate,
    Setting,
} from '@/websocket/GenericHandler'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface GenericInitialState {
    generation?: number
    settings?: { [key: string]: Setting }
    graphData?: GraphData[]
}

const initialState: GenericInitialState = {}

export type GraphData = {
    name: string
    data: {
        [key: string]: number[]
    }
}

function getStats(data: InfoAllData): GraphData[] {
    const graphData: GraphData[] = []
    if (data.data.all_stats.length === 0) return graphData

    for (const graphName in data.data.all_stats[0])
        graphData.push({ name: graphName, data: {} })
    data.data.all_stats.forEach((genStats) => {
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
            state.generation = action.payload.data.generation
            state.settings = action.payload.data.settings
            state.graphData = getStats(action.payload)
        },
        addGenDataGeneric: (state, action: PayloadAction<InfoOneGen>) => {
            const data = action.payload.data
            state.generation = data.generation
            for (const graph of state.graphData ?? [])
                for (const statName in data.gen_stats[graph.name] ?? {}) {
                    if (graph.data[statName] === undefined)
                        graph.data[statName] = [
                            data.gen_stats[graph.name][statName],
                        ]
                    else
                        graph.data[statName].push(
                            data.gen_stats[graph.name][statName]
                        )
                }
        },
        updateSettingsGeneric: (
            state,
            action: PayloadAction<InfoSettingsUpdate>
        ) => {
            state.settings = action.payload.settings
        },
    },
})

export const getGenericGraphData = (state: RootState) => state.generic.graphData
export const getGenericGeneration = (state: RootState) =>
    state.generic.generation

export const { setAllDataGeneric, addGenDataGeneric, updateSettingsGeneric } =
    slice.actions
export default slice.reducer
