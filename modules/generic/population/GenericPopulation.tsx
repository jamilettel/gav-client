import List from '@/components/list/List'
import PlayButtons from '@/modules/generic/bar/PlayButtons'
import { useEffect, useState } from 'react'
import { getGenericPopulation } from '@/modules/generic/genericSlice'
import { useAppSelector } from '@/utils/store'
import styles from './GenericPopulation.module.scss'
import randomColor from 'randomcolor'

export default function GenericPopulation(props: {
    setABContent: (setContent: React.ReactNode | undefined) => any
}) {
    const pop = useAppSelector(getGenericPopulation)
    const [colors, setColors] = useState(
        {} as {
            [value: string]: string
        }
    )

    useEffect(() => {
        props.setABContent(<PlayButtons />)
    }, [])

    function ChromosomeCell(data: string[]) {
        let resetColors = false
        const colorsNow = { ...colors }
        const cell = data.map((c) => {
            if (colorsNow[c] === undefined) {
                resetColors = true
                colorsNow[c] = randomColor()
            }
            return (
                <div
                    className={styles.chromosomePart}
                    style={{ background: colorsNow[c] }}
                    title={c}
                >
                    {c}
                </div>
            )
        })

        if (resetColors) setColors(colorsNow)

        return cell
    }

    return (
        <div className={styles.content}>
            <List
                data={pop ?? []}
                columnWidths={{ Chromosome: 800 }}
                columnClass={{ Chromosome: styles.chromosomeCell }}
                cellContentProvider={{ Chromosome: ChromosomeCell }}
                className={styles.table}
            />
        </div>
    )
}
