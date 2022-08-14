import styles from './GenericPopulation.module.scss'
import { IndividualEncoding } from '@/websocket/GenericHandler'
import { CSSProperties } from 'react'
import { AppDispatch, useAppDispatch, useAppSelector } from '@/utils/store'
import { getGenericIndividualEncoding } from '@/modules/generic/genericSlice'
import {
    Colors,
    getColors,
    getGradient,
    setColors,
} from '@/modules/generic/population/colorsSlice'
import randomColor from 'randomcolor'
import { Gradient } from 'typescript-color-gradient'

function getStyle(
    c: number,
    indEnc: IndividualEncoding | undefined,
    colorsNow: Colors,
    gradient: Gradient
): [boolean, CSSProperties] {
    let resetColors = false
    let cssProperties: CSSProperties = {}

    switch (indEnc?.encoding_type) {
        case 'boolean':
            cssProperties =
                c === 1
                    ? {
                          background: 'black',
                      }
                    : {
                          background: 'white',
                          color: 'black',
                      }
            break
        case 'indexes':
            if (colorsNow[c] === undefined) {
                colorsNow[c] = randomColor()
                resetColors = true
            }
            cssProperties.background = colorsNow[c]
            break
        case 'range':
            const colorNb = Math.floor(
                ((c - indEnc.range[0]) / (indEnc.range[1] - indEnc.range[0])) *
                    99
            )
            cssProperties.background = gradient.getColors()[colorNb]
            break
    }
    return [resetColors, cssProperties]
}

export default function ChromosomeCellDecorator(
    dispatch: AppDispatch,
    indEnc: IndividualEncoding,
    gradient: Gradient,
    colors: Colors
) {
    const chromosomeCell = (data: number[]) => {
        const colorsNow = { ...colors }
        let resetColors = false
        let index = 0

        const cell = data.map((c) => {
            let [reset, cssProperties] = getStyle(
                c,
                indEnc,
                colorsNow,
                gradient
            )
            resetColors = reset || resetColors
            index++

            let value = c.toString()
            if (typeof c === 'number' && !Number.isInteger(c))
                value = c.toFixed(2)
            return (
                <div
                    key={index}
                    className={styles.chromosomePart}
                    style={cssProperties}
                    title={c.toString()}
                >
                    {value}
                </div>
            )
        })

        if (resetColors) dispatch(setColors(colorsNow))

        return cell
    }
    return chromosomeCell
}
