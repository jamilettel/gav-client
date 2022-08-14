import { RootState } from '@/utils/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Gradient } from 'typescript-color-gradient'

export type Colors = {
    [value: string]: string
}

export interface ChromosomeColors {
    colors: Colors
    gradient: Gradient
}

const initialState: ChromosomeColors = {
    colors: {},
    gradient: new Gradient()
        .setGradient('#3e2a8d', '#ed4037')
        .setNumberOfColors(100),
}

const slice = createSlice({
    name: 'colors',
    initialState,
    reducers: {
        setColors: (state, action: PayloadAction<Colors>) => {
            state.colors = action.payload
        },
    },
})

export const getColors = (state: RootState) =>
    state.colors.colors

export const getGradient = (state: RootState) =>
    state.colors.gradient

export const { setColors } = slice.actions

export default slice.reducer
