import styles from './NavmenuPage.module.scss'
import React, { useState } from 'react'
import Focusable from '@/components/input/Focusable'

interface Props {
    children: React.ReactNode
    className?: string
    options?: string[]
    currentOption?: string
    onChange?: (str: string) => any
}

export default function NavmenuPage(props: Props) {
    const [open, setOpen] = useState(false)
    const toggleOpen = () => setOpen(!open)

    const navbarClass = styles.navbar + (open ? ` ${styles.navbarOpen}` : '')
    const contentClass = `${props.className ?? ''} ${styles.content}`

    const options = props.options?.map((option) => {
        const className = styles.menu + (props.currentOption === option ? ` ${styles.chosen}` : '')
        const onClick = () => {
            if (props.currentOption !== option && props.onChange)
                props.onChange(option)
            toggleOpen()
        }

        return (
            <Focusable focusable={open} className={className} key={option} onClick={onClick}>
                {option}
            </Focusable>
        )
    })

    return (
        <div className={styles.wrapper}>
            <div className={navbarClass}>
                <Focusable className={styles.tab} onClick={toggleOpen}>
                    <div className={styles.button}>
                        <p>{'>'}</p>
                    </div>
                </Focusable>
                <div className={styles.navbarContent}>
                    {options}
                </div>
            </div>
            <div className={contentClass}>{props.children}</div>
        </div>
    )
}
