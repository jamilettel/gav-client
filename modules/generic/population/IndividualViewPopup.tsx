import IconButton from '@/components/buttons/IconButton'
import {
    getGenericIndividualEncoding,
    getGenericPopulations,
} from '@/modules/generic/genericSlice'
import ChromosomeCellDecorator from '@/modules/generic/population/ChromosomeCell'
import {
    getColors,
    getGradient,
} from '@/modules/generic/population/colorsSlice'
import { useAppDispatch, useAppSelector } from '@/utils/store'
import { Individual } from '@/websocket/GenericHandler'
import styles from './GenericPopulation.module.scss'

function displayChromsomeInfo(ind: Individual, generation: number) {
    let creationType = 'Randomly Generated'

    if (ind.mutated_from > -1 && ind.parent1_id === -1) creationType = 'Mutated'
    else if (ind.mutated_from > -1) creationType = 'Crossover & Mutation'
    else if (ind.parent1_id > -1) creationType = 'Crossover'

    return (
        <>
            <div className={styles.info}>
                <p>
                    Generation: <span>{generation}</span>
                </p>
                <p>
                    Age: <span>{ind.age}</span>
                </p>
                <p>
                    Fitness:{' '}
                    <span>{ind.fitness !== null ? ind.fitness : 'N/A'}</span>
                </p>
                <p>
                    Creation type: <span>{creationType}</span>
                </p>
            </div>
        </>
    )
}

function getIndFromPops(
    age: number,
    indId: number,
    pops: Individual[][],
    generation: number
) {
    let otherGen = generation - age - 1
    return pops[otherGen].find((other) => other.id === indId)
}

export default function IndividualViewPopup(props: {
    ind: Individual
    generation: number
    close: () => any
}) {
    const pops = useAppSelector(getGenericPopulations)
    const indEnc = useAppSelector(getGenericIndividualEncoding) || {
        encoding_type: 'indexes',
    }
    const gradient = useAppSelector(getGradient)
    const colors = useAppSelector(getColors)
    const dispatch = useAppDispatch()

    let chromosomeFct = ChromosomeCellDecorator(
        dispatch,
        indEnc,
        gradient,
        colors
    )

    let others: React.ReactNode[] | undefined = []
    if (props.ind.mutated_from === props.ind.id) {
        others.push(
            <div key="before-mutation">
                <div className={styles.descriptionMutation}>
                    <h2>&uarr;</h2>
                    <p>Self mutation</p>
                </div>
                <div className={styles.chromosomeView}>
                    {chromosomeFct(props.ind.before_mutation ?? [])}
                </div>
            </div>
        )
    } else if (props.ind.mutated_from > -1) {
        let mutFrom = getIndFromPops(
            props.ind.age,
            props.ind.mutated_from,
            pops ?? [],
            props.generation
        )
        if (mutFrom !== undefined)
            others.push(
                <div key="mutation">
                    <div className={styles.descriptionMutation}>
                        <h2>&uarr;</h2>
                        <p>Mutated from Chromosome {mutFrom?.id}</p>
                    </div>
                    <div className={styles.chromosomeView}>
                        <div className={styles.chromosomeView}>
                            {chromosomeFct(mutFrom.chromosome)}
                        </div>
                    </div>
                </div>
            )
    }
    if (props.ind.parent1_id > -1) {
        let parent1 = getIndFromPops(
            props.ind.age,
            props.ind.parent1_id,
            pops ?? [],
            props.generation
        )
        let parent2 = getIndFromPops(
            props.ind.age,
            props.ind.parent2_id,
            pops ?? [],
            props.generation
        )
        if (parent1 !== undefined && parent2 !== undefined)
            others.push(
                <div key="parents">
                    <h2>&uarr;</h2>
                    <div className={styles.chromosomeView}>
                        {chromosomeFct(parent1.chromosome)}
                    </div>
                    <div className={styles.descriptionCrossover}>
                        <h2>×</h2>
                        <div className={styles.left}>
                            &uarr; Parent 1: Chromosome {parent1.id}
                        </div>
                        <div className={styles.right}>
                            Parent 2: Chromosome {parent2.id} &darr;
                        </div>
                    </div>
                    <div className={styles.chromosomeView}>
                        {chromosomeFct(parent2.chromosome)}
                    </div>
                </div>
            )
    }

    return (
        <div className={styles.contentPopup}>
            <IconButton
                iconUrl='/icons/next.svg'
                height={35}
                width={35}
                className={styles.backButton}
                onClick={props.close}
            />
            <h2>Chromosome {props.ind.id}</h2>
            <div className={styles.chromosomeView}>
                {chromosomeFct(props.ind.chromosome)}
            </div>
            {others}
            {displayChromsomeInfo(props.ind, props.generation)}
        </div>
    )
}
