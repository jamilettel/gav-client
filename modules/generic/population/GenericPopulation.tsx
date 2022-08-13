import List from '@/components/list/List'
import { CSSProperties, useEffect, useState } from 'react'
import {
    getGenericIndividualEncoding,
    getGenericPopulations,
    getShownGenericPop,
} from '@/modules/generic/genericSlice'
import { useAppSelector } from '@/utils/store'
import styles from './GenericPopulation.module.scss'
import randomColor from 'randomcolor'
import { Gradient } from 'typescript-color-gradient'
import GenerationNavigation from '@/modules/generic/bar/GenerationNavigation'

export default function GenericPopulation(props: {
    setABContent: (setContent: React.ReactNode | undefined) => any
}) {
    const shownGeneration = useAppSelector(getShownGenericPop)
    const pops = useAppSelector(getGenericPopulations)
    const indEnc = useAppSelector(getGenericIndividualEncoding)
    const [gradient] = useState(new Gradient())
    const [colors, setColors] = useState(
        {} as {
            [value: string]: string
        }
    )

    useEffect(() => {
        gradient.setGradient('#3e2a8d', '#ed4037')
        gradient.setNumberOfColors(100)
        props.setABContent(
            <GenerationNavigation/>
        )
    }, [])

    const colorsNow = { ...colors }

    const getStyle = (c: number): [boolean, CSSProperties] => {
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
                    ((c - indEnc.range[0]) /
                        (indEnc.range[1] - indEnc.range[0])) *
                        99
                )
                cssProperties.background = gradient?.getColors()[colorNb]
                break
        }
        return [resetColors, cssProperties]
    }

    function ChromosomeCell(data: number[]) {
        let resetColors = false
        let index = 0
        const cell = data.map((c) => {
            let [reset, cssProperties] = getStyle(c)
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

        if (resetColors) setColors(colorsNow)

        return cell
    }

    return (
        <div className={styles.content}>
            <List
                data={pops?.at(shownGeneration) ?? []}
                columnWidths={{ Chromosome: 800 }}
                columnClass={{ Chromosome: styles.chromosomeCell }}
                cellContentProvider={{ Chromosome: ChromosomeCell }}
                className={styles.table}
            />
        </div>
    )
}
