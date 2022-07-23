import NumberInput from '@/components/input/NumberInput'
import TextInput from '@/components/input/TextInput'
import { getSettings } from '@/modules/generic/genericSlice'
import { Setting } from '@/websocket/GenericHandler'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styles from './GenericSettings.module.scss'

type MenuSettings = {
    [key: string]: Setting &
        (
            | {
                  type: 'string'
                  currentValue: string
              }
            | {
                  type: 'number'
                  currentValue: number
              }
        )
}

export default function GenericSettings(props: {
    setABContent: (setContent: React.ReactNode | undefined) => any
}) {
    const settings = useSelector(getSettings) ?? {}
    const [menus, setMenus] = useState({} as MenuSettings)

    useEffect(() => {
        const newMenus = {} as MenuSettings
        for (const settingName in settings) {
            const setting = settings[settingName]
            if (setting.type === 'string') {
                newMenus[settingName] = {
                    ...setting,
                    currentValue: setting.value,
                }
            } else {
                newMenus[settingName] = {
                    ...setting,
                    currentValue: setting.value,
                }
            }
        }
        setMenus(newMenus)
    }, [settings])

    const display = [] as React.ReactNode[]
    for (const menuName in menus) {
        const menu = menus[menuName]

        const onchange = (value: any) => {
            const newMenus = { ...menus }
            newMenus[menuName].currentValue = value
            setMenus(newMenus)
        }

        if (menu.type === 'string')
            display.push(
                <div key={menuName} className={styles.item}>
                    {menuName}:
                    <br />
                    <TextInput value={menu.currentValue} />
                </div>
            )
        else
            display.push(
                <div key={menuName} className={styles.item}>
                    <h3>
                        {menuName}:
                    </h3>
                    <NumberInput
                        value={menu.currentValue}
                        onChange={onchange}
                        minIncrement={menu.min_increment}
                        min={menu.range?.at(0)}
                        max={menu.range?.at(1)}
                    />
                </div>
            )
    }

    return (
        <div className={styles.wrapper}>
            {display}
        </div>
    )
}
