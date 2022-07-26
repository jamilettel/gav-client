import IconButton from '@/components/buttons/IconButton'
import NumberInput from '@/components/input/NumberInput'
import TextInput from '@/components/input/TextInput'
import Select, { toSelectElem } from '@/components/selectors/Select'
import SaveSettingsBar from '@/modules/generic/bar/SaveSettingsBar'
import {
    getSettings,
    setMenuValueGeneric,
} from '@/modules/generic/genericSlice'
import { useAppDispatch, useAppSelector } from '@/utils/store'
import { useEffect, useState } from 'react'
import styles from './GenericSettings.module.scss'

export default function GenericSettings(props: {
    setABContent: (setContent: React.ReactNode | undefined) => any
}) {
    const dispatch = useAppDispatch()
    const menus = useAppSelector(getSettings) ?? {}
    const [requiresSave, setRequiresSave] = useState(false)

    useEffect(() => {
        for (const menuName in menus) {
            if (menus[menuName].value !== menus[menuName].currentValue)
                return setRequiresSave(true)
        }
        setRequiresSave(false)
    }, [menus])

    useEffect(() => {
        if (requiresSave) props.setABContent(<SaveSettingsBar />)
        else props.setABContent(undefined)
    }, [requiresSave])

    const display = [] as React.ReactNode[]
    for (const menuName in menus) {
        const menu = menus[menuName]

        const onchange = (value: any) => {
            dispatch(setMenuValueGeneric({ key: menuName, value: value }))
        }

        const resetInput = () =>
            dispatch(
                setMenuValueGeneric({
                    key: menuName,
                    value: menus[menuName].value,
                })
            )

        let input: React.ReactNode

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
