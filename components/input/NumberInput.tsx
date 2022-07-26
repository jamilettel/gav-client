import { useEffect, useState } from 'react'
import styles from './Input.module.scss'

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
        let num: number;
        if (value == '') {
            if ((props.min ?? 0) <= 0 && (props.max ?? 0) >= 0)
                num = 0
            else
                num = props.min!
        } else {
            num = parseFloat(value)
        }

        console.log(num)
        props.onChange(num)
    }, [value])

    return (
        <input
            className={styles.input + ' ' + (props.className ?? '')}
            placeholder={props.placeholder}
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            step={props.minIncrement}
            min={props.min}
            max={props.max}
        />
    )
}
