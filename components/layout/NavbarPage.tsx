import styles from './NavbarPage.module.scss'
import React, { useState } from 'react'

interface Props {
    children: React.ReactNode
}

export default function NavbarPage(props: Props) {
    const [open, setOpen] = useState(false)
    const toggleOpen = () => setOpen(!open)

    const navbarClass = styles.navbar + (open ? ` ${styles.navbarOpen}` : '')

    return (
        <div className={styles.wrapper}>
            <div className={navbarClass}>
                <div className={styles.tab} onClick={toggleOpen}>
                    <div className={styles.button}>
                        <p>
                            {'>'}
                        </p>
                    </div>
                </div>
                <div className={styles.navbarContent}>
                </div>
            </div>
            <div className={styles.content}>{props.children}</div>
        </div>
    )
}
