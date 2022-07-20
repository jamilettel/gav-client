import IconButton from '@/components/buttons/IconButton'
import { useAppDispatch } from '@/utils/store'
import { getSession, getTitle } from '@/websocket/builtinSlice'
import { sendBuiltin } from '@/websocket/websocket'
import React from 'react'
import { useSelector } from 'react-redux'
import styles from './SessionPage.module.scss'

export default function SessionPage(props: {
    children?: React.ReactNode,
    className?: string,
}) {
    const dispatch = useAppDispatch()
    const title = useSelector(getTitle)
    const session = useSelector(getSession)
    const leaveSession = () => sendBuiltin(dispatch, 'leave')

    return (
        <>
            <div className={styles.header}>
                <IconButton
                    className={styles.button}
                    iconUrl="/icons/leave-session.svg"
                    height={35}
                    width={35}
                    layout="fixed"
                    onClick={leaveSession}
                    tooltip="Leave session"
                />
                <h1 className="title">
                    {title ?? 'Genetic Algorithm Visualizer'}
                </h1>
                <p>{'@' + session}</p>
            </div>
            <div className={props.className}>
                {props.children}
            </div>
        </>
    )
}
