import { useEffect, useState } from 'react'
import { sendCommand } from '@/websocket/websocket'
import { useAppDispatch } from '@/utils/store'
import NavmenuPage from '@/components/layout/NavmenuPage'
import SessionPage from '@/components/layout/SessionPage'
import ActionBarGeneric from '@/modules/generic/bar/ActionBar'
import styles from './Generic.module.scss'
import GenericSettings from '@/modules/generic/settings/GenericSettings'
import GenericStatistics from '@/modules/generic/statistics/GenericStatistics'
import GenericPopulation from '@/modules/generic/population/GenericPopulation'
import { resetGeneric } from '@/modules/generic/genericSlice'

const NAVMENU_OPTIONS = ['Statistics', 'Change Settings', 'Population']

type MenuFunction = {
    [key: string]: {
        handler: (
            setABContent: (setContent: React.ReactNode | undefined) => any
        ) => React.ReactNode
    }
}

const MENU_FUNCTIONS: MenuFunction = {
    [NAVMENU_OPTIONS[0]]: {
        handler: (setContent) => (
            <GenericStatistics setABContent={setContent} />
        ),
    },
    [NAVMENU_OPTIONS[1]]: {
        handler: (setContent) => <GenericSettings setABContent={setContent} />,
    },
    [NAVMENU_OPTIONS[2]]: {
        handler: (setContent) => (
            <GenericPopulation setABContent={setContent} />
        ),
    },
}

const INITIAL_NAVMENU_OPTION = NAVMENU_OPTIONS[0]

export default function Generic() {
    const dispatch = useAppDispatch()
    const [navMenu, setNavMenu] = useState(INITIAL_NAVMENU_OPTION)
    const [actionbarContent, setABContent] = useState(
        undefined as React.ReactNode | undefined
    )

    useEffect(() => {
        dispatch(resetGeneric())
        sendCommand(dispatch, 'info')
    }, [])

    const changeMenu = (menu: string) => {
        setNavMenu(menu)
        setABContent(undefined)
    }

    return (
        <NavmenuPage
            className={styles.navbar}
            options={NAVMENU_OPTIONS}
            currentOption={navMenu}
            onChange={changeMenu}
        >
            <SessionPage className={styles.content}>
                {MENU_FUNCTIONS[navMenu]?.handler(setABContent)}
                <ActionBarGeneric>{actionbarContent}</ActionBarGeneric>
            </SessionPage>
        </NavmenuPage>
    )
}
