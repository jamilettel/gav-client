import { useAppDispatch } from '@/utils/store'
import { sendCommand } from '@/websocket/websocket'
import styles from './ActionBar.module.scss'

export default function ActionBarGeneric(props: {
    children?: React.ReactNode
}) {
    let className = styles.bar
    if (props.children === undefined)
        className += ' ' + styles.hidden

    return (
        <div className={className}>
            {props.children}
        </div>
    )
}
