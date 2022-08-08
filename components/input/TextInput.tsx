import { useEffect, useRef, useState } from 'react'
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
    const filteredSuggestions = props.suggestions
        ?.filter((suggestion) =>
            suggestion.toLowerCase().includes(props.value?.toLowerCase() ?? '')
        )
        .sort()
    let hasSuggestions: boolean = (filteredSuggestions?.length ?? 0) > 0
    let onKeyDown:
        | ((e: React.KeyboardEvent<HTMLInputElement>) => any)
        | undefined = undefined
    const [chosenSuggestion, setChosenSuggestion] = useState(0)

    const refScroll = useRef<HTMLDivElement>(null)
    const refInput = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setChosenSuggestion(0)
    }, [props.value])

    useEffect(() => {
        if (!hasSuggestions) return
        let elemPos = refScroll.current?.children
            .item(chosenSuggestion)
            ?.getBoundingClientRect()
        let scrollPos = refScroll.current?.getBoundingClientRect()
        if (elemPos === undefined || scrollPos === undefined) return
        let pos = elemPos.top - scrollPos.top
        if (pos < 0) {
            refScroll.current!.scrollTop += pos
        } else if (pos + elemPos.height > scrollPos.height) {
            refScroll.current!.scrollTop += pos + elemPos.height - scrollPos.height
        }
    }, [chosenSuggestion])

    if (hasSuggestions) {
        onKeyDown = (e) => {
            if (
                e.code !== 'Enter' &&
                e.code !== 'ArrowDown' &&
                e.code !== 'ArrowUp' &&
                e.code !== 'Escape'
            )
                return
            e.preventDefault()
            switch (e.code) {
                case 'Escape':
                    refInput.current?.blur()
                    break
                case 'Enter':
                    refInput.current?.blur()
                    if (
                        chosenSuggestion > 0 &&
                        chosenSuggestion < filteredSuggestions!.length
                    )
                        if (props.onChange)
                            props.onChange(
                                filteredSuggestions![chosenSuggestion]
                            )
                    break
                case 'ArrowUp':
                    setChosenSuggestion(Math.max(0, chosenSuggestion - 1))
                    break
                case 'ArrowDown':
                    setChosenSuggestion(
                        Math.min(
                            filteredSuggestions!.length - 1,
                            chosenSuggestion + 1
                        )
                    )
                    break
            }
        }

        const list = filteredSuggestions!.map((suggestion, index) => (
            <div
                key={suggestion + index.toString()}
                className={
                    styles.item +
                    (chosenSuggestion === index
                        ? ' ' + styles.itemHighlight
                        : '')
                }
                onMouseDown={() => {
                    if (props.onChange) props.onChange(suggestion)
                }}
            >
                {suggestion}
            </div>
        ))
        suggestions = (
            <div className={styles.suggestions} ref={refScroll}>
                {list}
            </div>
        )
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
                ref={refInput}
            />
            {focused ? suggestions : undefined}
        </div>
    )
}
