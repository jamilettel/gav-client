import { useEffect } from 'react'
import {
    getGenericGeneralStats,
} from '@/modules/generic/genericSlice'
import { sendCommand } from '@/websocket/websocket'
import { useAppDispatch } from '@/utils/store'
import { useSelector } from 'react-redux'
import NavbarPage from '@/components/layout/NavbarPage'
import SessionPage from '@/components/layout/SessionPage'
import ActionBarGeneric from '@/modules/generic/bar/ActionBar'
import styles from './Generic.module.scss'
import GenericGraphs from '@/modules/generic/statistics/GenericGraphs'
import GenericGeneralStats from '@/modules/generic/statistics/GenericGeneralStats'

export default function Generic() {
    const dispatch = useAppDispatch()
    useEffect(() => {
        sendCommand(dispatch, 'info')
    }, [])


    return (
        <NavbarPage className={styles.navbar}>
            <SessionPage className={styles.content}>
                <GenericGraphs />
                <GenericGeneralStats />
            </SessionPage>
            <ActionBarGeneric />
        </NavbarPage>
    )
}
