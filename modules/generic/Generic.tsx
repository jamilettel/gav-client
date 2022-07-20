import { useEffect, useState } from 'react'
import {
    getGenericGeneralStats,
} from '@/modules/generic/genericSlice'
import { sendCommand } from '@/websocket/websocket'
import { useAppDispatch } from '@/utils/store'
import { useSelector } from 'react-redux'
import NavmenuPage from '@/components/layout/NavmenuPage'
import SessionPage from '@/components/layout/SessionPage'
import ActionBarGeneric from '@/modules/generic/bar/ActionBar'
import styles from './Generic.module.scss'
import GenericGraphs from '@/modules/generic/statistics/GenericGraphs'
import GenericGeneralStats from '@/modules/generic/statistics/GenericGeneralStats'

const NAVBAR_OPTIONS = [
    'Statistics',
    'Change Settings',
]

const INITIAL_NAVBAR_OPTION = NAVBAR_OPTIONS[0]

export default function Generic() {
    const dispatch = useAppDispatch()
    const [navMenu, setNavMenu] = useState(INITIAL_NAVBAR_OPTION)

    useEffect(() => {
        sendCommand(dispatch, 'info')
    }, [])

    return (
        <NavmenuPage className={styles.navbar} options={NAVBAR_OPTIONS} currentOption={navMenu} onChange={setNavMenu}>
            <SessionPage className={styles.content}>
                <GenericGraphs />
                <GenericGeneralStats />
            </SessionPage>
            <ActionBarGeneric />
        </NavmenuPage>
    )
}
