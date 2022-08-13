import IconButton from '@/components/buttons/IconButton'
import NumberInput from '@/components/input/NumberInput'
import { getGenericPopulations, getShownGenericPop, setShownGenericPop, showFirstGenericPop, showLastGenericPop, showNextGenericPop, showPreviousGenericPop } from '@/modules/generic/genericSlice'
import { useAppDispatch, useAppSelector } from '@/utils/store'
import styles from './GenerationNavigation.module.scss'

export default function GenerationNavigation() {
    const dispatch = useAppDispatch()
    const pops = useAppSelector(getGenericPopulations)
    const shownGeneration = useAppSelector(getShownGenericPop)
    const max = (pops?.length ?? 1) - 1

    return (
        <div className={styles.center}>
            <IconButton
                className={styles.button + ' ' + styles.mr}
                iconUrl="/icons/last.svg"
                height={45}
                width={45}
                onClick={() => dispatch(showFirstGenericPop())}
            />
            <IconButton
                className={styles.button}
                iconUrl="/icons/next.svg"
                height={45}
                width={45}
                onClick={() => dispatch(showPreviousGenericPop())}
            />
            <div className={styles.generationIndex}>
                <NumberInput
                    value={shownGeneration}
                    onChange={(num: number) => dispatch(setShownGenericPop(num))}
                    max={max}
                    min={0}
                />
                <div className={styles.max}>{max}</div>
            </div>
            <IconButton
                className={
                styles.button + ' ' + styles.mr + ' ' + styles.reverse
                }
                iconUrl="/icons/next.svg"
                height={45}
                width={45}
                onClick={() => dispatch(showNextGenericPop())}
            />
            <IconButton
                className={styles.button + ' ' + styles.reverse}
                iconUrl="/icons/last.svg"
                height={45}
                width={45}
                onClick={() => dispatch(showLastGenericPop())}
            />
        </div>
    )
}
