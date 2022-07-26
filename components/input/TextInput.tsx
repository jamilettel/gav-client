import styles from './Input.module.scss'

export default function TextInput(props: {
    children?: React.ReactNode
    onChange?: (str: any) => any
    value?: string,
    placeholder?: string,
    className?: string,
}) {
    return (
        <input
            className={styles.input + ' ' + (props.className ?? '')}
            placeholder={props.placeholder}
            type="text"
            value={props.value}
            onChange={(e) => {
                if (props.onChange) props.onChange(e.target.value)
            }}
        />
    )
}
