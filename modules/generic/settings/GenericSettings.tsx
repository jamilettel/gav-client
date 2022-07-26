import IconButton from '@/components/buttons/IconButton'
import NumberInput from '@/components/input/NumberInput'
import TextInput from '@/components/input/TextInput'
import Select, { toSelectElem } from '@/components/selectors/Select'
import SaveSettingsBar from '@/modules/generic/bar/SaveSettingsBar'
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

type Settings = {
    [key: string]: Setting
}

function extractSettings(
    settings: Settings,
    oldMenus: MenuSettings
): MenuSettings {
    const newMenus = {} as MenuSettings
    for (const settingName in settings) {
        const setting = settings[settingName]
        if (setting.type === 'string') {
            let currentValue = setting.value
            if (
                oldMenus[settingName] !== undefined &&
                oldMenus[settingName].currentValue !==
                    oldMenus[settingName].value
            )
                currentValue = oldMenus[settingName].currentValue as string

            newMenus[settingName] = {
                ...setting,
                currentValue,
            }
        } else {
            let currentValue = setting.value
            if (
                oldMenus[settingName] !== undefined &&
                oldMenus[settingName].currentValue !==
                    oldMenus[settingName].value
            )
                currentValue = oldMenus[settingName].currentValue as number

            newMenus[settingName] = {
                ...setting,
                currentValue,
            }
        }
    }
    return newMenus
}

export default function GenericSettings(props: {
    setABContent: (setContent: React.ReactNode | undefined) => any
}) {
    const settings = useSelector(getSettings) ?? {}
    const [menus, setMenus] = useState({} as MenuSettings)
    const [requiresSave, setRequiresSave] = useState(false)

    useEffect(() => {
        setMenus(extractSettings(settings, menus))
    }, [settings])

    useEffect(() => {
        for (const menuName in menus) {
            if (menus[menuName].value !== menus[menuName].currentValue)
                return setRequiresSave(true)
        }
        setRequiresSave(false)
    }, [menus])

    useEffect(() => {
        if (requiresSave)
            props.setABContent(
                <SaveSettingsBar
                    onSave={() => console.log('save')}
                    onCancel={() => console.log('cancel')}
                />
            )
        else props.setABContent(undefined)
    }, [requiresSave])

    const display = [] as React.ReactNode[]
    for (const menuName in menus) {
        const menu = menus[menuName]

        const onchange = (value: any) => {
            const newMenus = { ...menus }
            newMenus[menuName].currentValue = value
            setMenus(newMenus)
        }

        const resetInput = () => {
            const newMenus = { ...menus }
            newMenus[menuName].currentValue = newMenus[menuName].value
            setMenus(newMenus)
        }

        let input = <></>

        if (menu.type === 'string') {
            if (menu.values === undefined)
                input = (
                    <TextInput
                        className={styles.input}
                        value={menu.currentValue}
                        onChange={onchange}
                    />
                )
            else
                input = (
                    <Select
                        className={styles.input}
                        chosenValue={menu.currentValue}
                        elements={toSelectElem(menu.values)}
                        onChange={onchange}
                    />
                )
        } else {
            input = (
                <NumberInput
                    className={styles.input}
                    value={menu.currentValue}
                    onChange={onchange}
                    minIncrement={menu.min_increment}
                    min={menu.range?.at(0)}
                    max={menu.range?.at(1)}
                />
            )
        }
        display.push(
            <div key={menuName} className={styles.item}>
                <h3>{menuName}</h3>
                <div className={styles.inputWrapper}>
                    {input}
                    {menu.currentValue !== menu.value && (
                        <IconButton
                            className={styles.button}
                            iconUrl="/icons/undo.svg"
                            width={20}
                            height={20}
                            onClick={resetInput}
                            tooltip="Reset value"
                        />
                    )}
                </div>
            </div>
        )
    }

    return <div className={styles.wrapper}>{display}</div>
}
