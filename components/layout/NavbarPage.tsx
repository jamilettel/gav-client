import styles from './NavbarPage.module.scss'
import React, { useState } from 'react'

interface Props {
    children: React.ReactNode
    className?: string
}

export default function NavbarPage(props: Props) {
    const [open, setOpen] = useState(false)
    const toggleOpen = () => setOpen(!open)

    const navbarClass = styles.navbar + (open ? ` ${styles.navbarOpen}` : '')
    const contentClass = `${props.className ?? ''} ${styles.content}`

    return (
        <div className={styles.wrapper}>
            <div className={navbarClass}>
                <div className={styles.tab} onClick={toggleOpen}>
                    <div className={styles.button}>
                        <p>{'>'}</p>
                    </div>
                </div>
                <div className={styles.navbarContent}></div>
            </div>
            <div className={contentClass}>{props.children}</div>
        </div>
    )
}
