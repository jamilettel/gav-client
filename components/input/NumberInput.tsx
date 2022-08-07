import { useEffect, useState } from 'react'
import styles from './Input.module.scss'

function getNumberFromString(
    value: string,
    max: number | undefined,
    min: number | undefined
): number {
    let num: number
    if (value == '') {
        if ((min ?? 0) <= 0 && (max ?? 0) >= 0) num = 0
        else num = min!
    } else {
        num = parseFloat(value)
    }

    return num
}

export default function NumberInput(props: {
    children?: React.ReactNode
    onChange?: (num: number) => any
    value?: number
    placeholder?: string
    minIncrement?: number
    min?: number
    max?: number
    className?: string
}) {
    const [value, setValue] = useState(props.value?.toString() ?? '')

    useEffect(() => {
        if (!props.onChange) return
        props.onChange(getNumberFromString(value, props.max, props.min))
    }, [value])

    useEffect(() => {
        let num = getNumberFromString(value, props.max, props.min)
        if (props.value !== undefined && num !== props.value)
            setValue(props.value.toString())
    }, [props.value])

    return (
        <div className={styles.input + ' ' + (props.className ?? '')}>
            <input
                placeholder={props.placeholder}
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                step={props.minIncrement}
                min={props.min}
                max={props.max}
            />
        </div>
    )
}
