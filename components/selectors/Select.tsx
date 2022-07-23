import { useState } from 'react'
import styles from './Select.module.scss'

export class SelectElement {
    title: string
    value: string

    /// By default, key takes the value of value
    constructor(title: string, value?: string) {
        this.title = title
        this.value = value ?? title
    }
}

interface Props {
    elements: SelectElement[]
    defaultTitle?: string
    onChange?: (value: string) => any
    disabled?: boolean
    chosenValue?: string
}

export const toSelectElem = (list: string[]) =>
    list.map((str) => new SelectElement(str))

export default function Select(props: Props) {
    const [open, setOpen] = useState(false)
    const [chosenElem, setChosenElem] = useState(
        new SelectElement(props.defaultTitle || 'Choose value...', '')
    )

    let className = styles.select
    if (props.disabled === true) className += ' ' + styles.selectDisabled
    else if (open) className += ' ' + styles.selectOpen

    if (
        props.chosenValue !== undefined &&
        props.chosenValue !== chosenElem.value
    ) {
        for (const elem of props.elements)
            if (elem.value === props.chosenValue) setChosenElem(elem)
    }

    const elem = props.elements.find((e) => {
        return e.value === chosenElem.value
    })
    if (elem !== undefined && elem.title !== chosenElem.title) {
        setChosenElem(elem)
    }

    const mainButtonKeyDown = (e: React.KeyboardEvent) => {
        if (e.key !== "ArrowUp" && e.key !== "ArrowDown")
            return
        e.preventDefault()
        let index = props.elements.findIndex((elem) => elem.value === chosenElem.value) ?? 0
        if (e.key === "ArrowUp")
            index--
        else
            index++
        if (index >= 0 && index < props.elements.length)
            setChosenElem(props.elements[index])
    }

    return (
        <>
            <div className={className}>
                <button
                    className={styles.current}
                    onClick={(e) => {
                        e.preventDefault()
                        if (props.disabled === true) return
                        setOpen(!open)
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    type="button"
                    title={chosenElem.title}
                    onKeyDown={mainButtonKeyDown}
                >
                    {chosenElem.title}
                </button>
                <div className={styles.dropdown}>
                    {props.elements.map((elem, index) => {
                        let className: string = ''
                        if (index === props.elements.length - 1)
                            className = styles.buttonLast
                        if (chosenElem.value === elem.value) {
                            className += ' ' + styles.buttonChosen
                        }
                        return (
                            <button
                                className={className}
                                onClick={(e) => {
                                    e.preventDefault()
                                    if (props.onChange)
                                        props.onChange(elem.value)
                                    setOpen(false)
                                    setChosenElem(elem)
                                }}
                                onMouseDown={(e) => e.preventDefault()}
                                title={elem.title}
                                key={elem.value}
                            >
                                {elem.title}
                            </button>
                        )
                    })}
                </div>
                <button
                    className={styles.closeButton}
                    onClick={() => {
                        setOpen(false)
                    }}
                    tabIndex={-1}
                    onMouseDown={(e) => e.preventDefault()}
                />
            </div>
        </>
    )
}
