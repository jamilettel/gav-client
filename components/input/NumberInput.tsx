import styles from './Input.module.scss'

export default function NumberInput(props: {
    children?: React.ReactNode
    onChange?: (num: number) => any
    value?: number,
    placeholder?: string,
    minIncrement?: number,
    min?: number,
    max?: number,
}) {
    return (
        <input
            className={styles.input}
            placeholder={props.placeholder}
            type="number"
            value={props.value}
            onChange={(e) => {
                let value = parseFloat(e.target.value)
                if ((props.min ?? value) > value)
                    value = props.min!
                else if ((props.max ?? value) < value)
                    value = props.max!

                if (props.onChange) props.onChange(value)
            }}
            step={props.minIncrement}
            min={props.min}
            max={props.max}
        />
    )
}
