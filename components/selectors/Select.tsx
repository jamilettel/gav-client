import { useRef, useState } from 'react'
import styles from './Select.module.scss'

export class SelectElement {
    value: string
    key: string

    /// By default, key takes the value of value
    constructor(value: string, key?: string) {
        this.value = value
        this.key = key ?? value
    }
}

interface Props {
    elements: SelectElement[]
    defaultTitle?: string
    onChange?: (value: string) => any
    disabled?: boolean
    chosenValue?: string
    className?: string
}

export const toSelectElem = (list: string[]) =>
    list.map((str) => new SelectElement(str))

export default function Select(props: Props) {
    const refDropdown = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState(false)
    const [chosenElem, setChosenElem] = useState(
        new SelectElement(props.defaultTitle || 'Choose value...', '')
    )

    let className = styles.select
    if (props.disabled === true) className += ' ' + styles.selectDisabled
    else if (open) className += ' ' + styles.selectOpen
    if (props.className) className += ' ' + props.className

    if (
        props.chosenValue !== undefined &&
        props.chosenValue !== chosenElem.key
    ) {
        for (const elem of props.elements)
            if (elem.key === props.chosenValue) setChosenElem(elem)
    }

    const elem = props.elements.find((e) => {
        return e.key === chosenElem.key
    })
    if (elem !== undefined && elem.value !== chosenElem.value) {
        setChosenElem(elem)
    }

    const mainButtonKeyDown = (e: React.KeyboardEvent) => {
        if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
        e.preventDefault()
        let index =
            props.elements.findIndex((elem) => elem.key === chosenElem.key) ?? 0
        if (e.key === 'ArrowUp') index--
        else index++
        if (index >= 0 && index < props.elements.length) {
            if (props.onChange) props.onChange(props.elements[index].key)
            setChosenElem(props.elements[index])
        }
        let elemPos = refDropdown.current?.children.item(index)?.getBoundingClientRect()
        let scrollPos = refDropdown.current?.getBoundingClientRect()
        if (!elemPos || !scrollPos)
            return
        let pos = elemPos.top - scrollPos.top
        if (pos < 0) {
            refDropdown.current!.scrollTop += pos
        } else if (pos + elemPos.height > scrollPos.height) {
            refDropdown.current!.scrollTop +=
                pos + elemPos.height - scrollPos.height
        }
    }

    return (
        <>
            <div className={className}>
                <button
                    className={styles.current}
                    onMouseDown={(e) => {
                        if (props.disabled) {
                            e.preventDefault()
                            return
                        }
                        if (e.currentTarget == document.activeElement && open) {
                            e.preventDefault()
                            e.currentTarget.blur()
                        }
                    }}
                    type="button"
                    title={chosenElem.value}
                    onKeyDown={mainButtonKeyDown}
                    onBlur={() => setOpen(false)}
                    onFocus={() => setOpen(true)}
                >
                    {chosenElem.value}
                </button>
                <div ref={refDropdown} className={styles.dropdown}>
                    {props.elements.map((elem, index) => {
                        let className: string = ''
                        if (index === props.elements.length - 1)
                            className = styles.buttonLast
                        if (chosenElem.key === elem.key) {
                            className += ' ' + styles.buttonChosen
                        }
                        return (
                            <button
                                className={className}
                                onMouseDown={() => {
                                    if (props.onChange) props.onChange(elem.key)
                                    setOpen(false)
                                    setChosenElem(elem)
                                }}
                                title={elem.value}
                                key={elem.key}
                                tabIndex={-1}
                            >
                                {elem.value}
                            </button>
                        )
                    })}
                </div>
            </div>
        </>
    )
}
