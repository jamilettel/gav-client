import IconButton from '@/components/buttons/IconButton'
import NumberInput from '@/components/input/NumberInput'
import styles from './GenerationNavigation.module.scss'

export default function GenerationNavigation(props: {
    index: number
    onIndexChange: (index: number) => any
    max: number
}) {

    const onChange = (num: number) => {
        let newNum = Math.max(0, Math.min(num, props.max))
        console.log(newNum)
        props.onIndexChange(newNum)
    }

    return (
        <div className={styles.center}>
            <IconButton
                className={styles.button + ' ' + styles.mr}
                iconUrl="/icons/last.svg"
                height={45}
                width={45}
                onClick={() => props.onIndexChange(0)}
            />
            <IconButton
                className={styles.button}
                iconUrl="/icons/next.svg"
                height={45}
                width={45}
                onClick={() =>
                    props.onIndexChange(Math.max(0, props.index - 1))
                }
            />
            <div className={styles.generationIndex}>
                <NumberInput
                    value={props.index}
                    onChange={onChange}
                    max={props.max}
                    min={0}
                />
                <div className={styles.max}>{props.max}</div>
            </div>
            <IconButton
                className={
                styles.button + ' ' + styles.mr + ' ' + styles.reverse
                }
                iconUrl="/icons/next.svg"
                height={45}
                width={45}
                onClick={() =>
                    props.onIndexChange(Math.min(props.max, props.index + 1))
                }
            />
            <IconButton
                className={styles.button + ' ' + styles.reverse}
                iconUrl="/icons/last.svg"
                height={45}
                width={45}
                onClick={() => props.onIndexChange(props.max)}
            />
        </div>
    )
}
