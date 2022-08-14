import List from '@/components/list/List'
import { useEffect, useState } from 'react'
import {
    getGenericIndividualEncoding,
    getGenericPopulations,
    getShownGenericPop,
} from '@/modules/generic/genericSlice'
import { useAppDispatch, useAppSelector } from '@/utils/store'
import styles from './GenericPopulation.module.scss'
import GenerationNavigation from '@/modules/generic/bar/GenerationNavigation'
import { Individual } from '@/websocket/GenericHandler'
import IndividualViewPopup from '@/modules/generic/population/IndividualViewPopup'
import ChromosomeCellDecorator from '@/modules/generic/population/ChromosomeCell'
import { getColors, getGradient } from '@/modules/generic/population/colorsSlice'

export default function GenericPopulation(props: {
    setABContent: (setContent: React.ReactNode | undefined) => any
}) {
    const shownGeneration = useAppSelector(getShownGenericPop)
    const pops = useAppSelector(getGenericPopulations)
    const indEnc = useAppSelector(getGenericIndividualEncoding) || {encoding_type: 'indexes'}
    const gradient = useAppSelector(getGradient)
    const colors = useAppSelector(getColors)
    const [ind, setInd] = useState(null as Individual | null)
    const [indGen, setIndGen] = useState(null as number | null)
    const dispatch = useAppDispatch()

    useEffect(() => {
        props.setABContent(<GenerationNavigation />)
    }, [])

    return (
        <div className={styles.content}>
            <h4>Click on a row for more details</h4>
            <List
                data={pops?.at(shownGeneration) ?? []}
                columnWidths={{ id: 100, chromosome: 800, age: 100 }}
                columnClass={{ chromosome: styles.chromosomeCell }}
                cellContentProvider={{
                    chromosome: ChromosomeCellDecorator(dispatch, indEnc, gradient, colors),
                    fitness: (fitness) => (fitness != null ? fitness : 'N/A'),
                    mutated_from: (mutated) =>
                        mutated === -1 ? 'None' : mutated,
                    parent1_id: (mutated) =>
                        mutated === -1 ? 'None' : mutated,
                    parent2_id: (mutated) =>
                        mutated === -1 ? 'None' : mutated,
                }}
                className={styles.table}
                rowClass={styles.rowClass}
                onClickRow={(ind: Individual) => {
                    setInd(ind)
                    setIndGen(shownGeneration)
                }}
            />
            {ind !== null && (
                <div className={styles.popup}>
                    <div
                        className={styles.popupClose}
                        onMouseDown={() => setInd(null)}
                    />
                    <IndividualViewPopup generation={indGen!} ind={ind} />
                </div>
            )}
        </div>
    )
}
