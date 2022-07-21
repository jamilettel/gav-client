import { useEffect, useState } from 'react'
import { sendCommand } from '@/websocket/websocket'
import { useAppDispatch } from '@/utils/store'
import NavmenuPage from '@/components/layout/NavmenuPage'
import SessionPage from '@/components/layout/SessionPage'
import ActionBarGeneric from '@/modules/generic/bar/ActionBar'
import styles from './Generic.module.scss'
import GenericGraphs from '@/modules/generic/statistics/GenericGraphs'
import GenericGeneralStats from '@/modules/generic/statistics/GenericGeneralStats'
import GenericSettings from '@/modules/generic/settings/GenericSettings'

const NAVMENU_OPTIONS = ['Statistics', 'Change Settings']

type MenuFunction = {
    [key: string]: {
        handler: () => React.ReactNode
        actionbar: boolean
    }
}

const MENU_FUNCTIONS: MenuFunction = {
    [NAVMENU_OPTIONS[0]]: {
        handler: () => (
            <>
                <GenericGraphs />
                <GenericGeneralStats />
            </>
        ),
        actionbar: true,
    },
    [NAVMENU_OPTIONS[1]]: {
        handler: () => (
            <>
                <GenericSettings />
            </>
        ),
        actionbar: false,
    },
}

const INITIAL_NAVMENU_OPTION = NAVMENU_OPTIONS[0]

export default function Generic() {
    const dispatch = useAppDispatch()
    const [navMenu, setNavMenu] = useState(INITIAL_NAVMENU_OPTION)

    useEffect(() => {
        sendCommand(dispatch, 'info')
    }, [])

    return (
        <NavmenuPage
            className={styles.navbar}
            options={NAVMENU_OPTIONS}
            currentOption={navMenu}
            onChange={setNavMenu}
        >
            <SessionPage className={styles.content}>
                {MENU_FUNCTIONS[navMenu].handler()}
                <ActionBarGeneric hidden={!MENU_FUNCTIONS[navMenu].actionbar} />
            </SessionPage>
        </NavmenuPage>
    )
}
