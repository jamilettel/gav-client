import { getGenericGeneration, getGenericPopulations, getShownGenericPop } from '@/modules/generic/genericSlice'
import { useAppSelector } from '@/utils/store'
import { Individual } from '@/websocket/GenericHandler'
import styles from './GenericPopulation.module.scss'

export default function IndividualViewPopup(props: {
    ind: Individual,
    generation: number,
}) {
    const pops = useAppSelector(getGenericPopulations)

    return (
        <div className={styles.contentPopup}>
            {JSON.stringify(props.ind)}
            <br />
            Generation: {props.generation}
        </div>
    )
}
