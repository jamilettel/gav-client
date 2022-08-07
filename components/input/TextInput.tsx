import { useRef, useState } from 'react'
import styles from './Input.module.scss'

export default function TextInput(props: {
    children?: React.ReactNode
    onChange?: (str: any) => any
    value?: string
    placeholder?: string
    className?: string
    suggestions?: string[]
}) {
    let suggestions = undefined
    const [focused, setFocused] = useState(false)
    let hasSuggestions: boolean
    const filteredSuggestions = props.suggestions?.filter((suggestion) =>
        suggestion.toLowerCase().includes(props.value?.toLowerCase() ?? '')
    ).sort()
    let onKeyDown:
        | ((e: React.KeyboardEvent<HTMLInputElement>) => any)
        | undefined = undefined

    const ref = useRef<HTMLDivElement>(null)

    if ((hasSuggestions = (filteredSuggestions?.length ?? 0) > 0)) {
        onKeyDown = (e) => {
            console.log(e.code)
            if (
                e.code !== 'Enter' &&
                e.code !== 'ArrowDown' &&
                e.code !== 'ArrowUp'
            )
                return
            e.preventDefault()
        }

        const list = filteredSuggestions!.map((suggestion, index) => (
            <div
                key={suggestion + index.toString()}
                className={styles.item}
                onMouseDown={() => {
                    if (props.onChange) props.onChange(suggestion)
                }}
            >
                {suggestion}
            </div>
        ))
        suggestions = <div className={styles.suggestions}>{list}</div>
    }

    let classname =
        styles.input +
        ' ' +
        (props.className ?? '') +
        (hasSuggestions && focused ? ' ' + styles.inputSuggestions : '')

    return (
        <div className={classname}>
            <input
                placeholder={props.placeholder}
                type="text"
                value={props.value}
                onChange={(e) => {
                    if (props.onChange) props.onChange(e.target.value)
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={onKeyDown}
            />
            {focused ? suggestions : undefined}
        </div>
    )
}
