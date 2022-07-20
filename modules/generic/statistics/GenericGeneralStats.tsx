import { getGenericGeneralStats } from '@/modules/generic/genericSlice'
import { useSelector } from 'react-redux'
import styles from './GenericGeneralStats.module.scss'

export default function GenericGeneralStats() {
    const stats = useSelector(getGenericGeneralStats)
    let data = []
    for (const stat in stats) {
        data.push(
            <div className={styles.item} key={stat}>
                <h3>{stat}:</h3>
                <p>{stats[stat]}</p>
            </div>
        )
    }

    return <div className={styles.content}>{data}</div>
}
