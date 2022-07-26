import styles from './NavmenuPage.module.scss'
import React, { useState } from 'react'
import Focusable from '@/components/input/Focusable'
import { useAppDispatch } from '@/utils/store'
import { sendBuiltin } from '@/websocket/websocket'

interface Props {
    children: React.ReactNode
    className?: string
    options?: string[]
    currentOption?: string
    onChange?: (str: string) => any
}

export default function NavmenuPage(props: Props) {
    const dispatch = useAppDispatch()
    const [open, setOpen] = useState(false)
    const toggleOpen = () => setOpen(!open)

    const navmenuClass = styles.navmenu + (open ? ` ${styles.navmenuOpen}` : '')
    const contentClass = `${props.className ?? ''} ${styles.content}`

    const options = props.options?.map((option) => {
        const className =
            styles.menu +
            (props.currentOption === option ? ` ${styles.chosen}` : '')
        const onClick = () => {
            if (props.currentOption !== option && props.onChange)
                props.onChange(option)
            toggleOpen()
        }

        return (
            <Focusable
                focusable={open}
                className={className}
                key={option}
                onClick={onClick}
            >
                {option}
            </Focusable>
        )
    })

    const deleteSession = () => sendBuiltin(dispatch, 'delete')

    return (
        <div className={styles.wrapper}>
            <div className={navmenuClass}>
                <div className={styles.closeNavmenu} onClick={toggleOpen}></div>
                <Focusable className={styles.tab} onClick={toggleOpen}>
                    <div className={styles.button}>
                        <p>{'>'}</p>
                    </div>
                </Focusable>
                <div className={styles.navmenuContent}>
                    {options}
                    <Focusable
                        className={styles.menu + ' ' + styles.menuDelete}
                        onClick={deleteSession}
                    >
                        Delete session
                    </Focusable>
                </div>
            </div>
            <div className={contentClass}>{props.children}</div>
        </div>
    )
}
