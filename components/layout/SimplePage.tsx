import styles from './SimplePage.module.scss'

export default function SimplePage(props: {
    children?: React.ReactNode,
}) {
    return (
        <div className={styles.contentWrapper}>
            <div className={styles.borderBefore} />
            {props.children}
            <div className={styles.borderAfter} />
        </div>
    )
}
