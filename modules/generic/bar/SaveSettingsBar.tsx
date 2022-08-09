import Button from '@/components/buttons/Button'
import IconButton from '@/components/buttons/IconButton'
import TextInput from '@/components/input/TextInput'
import {
    getSettings,
    resetAllSettingsGeneric,
} from '@/modules/generic/genericSlice'
import { useAppDispatch, useAppSelector } from '@/utils/store'
import { saveSettingsGeneric } from '@/websocket/GenericHandler'
import { useEffect, useState } from 'react'
import styles from './ActionBar.module.scss'

export default function SaveSettingsBar() {
    const dispatch = useAppDispatch()
    const menus = useAppSelector(getSettings) ?? {}
    let buttonClass =
        styles.button + ' ' + styles.primary + ' ' + styles.alignRight
    let cancelButton = styles.button + ' ' + styles.charButton
    const onSave = () => saveSettingsGeneric(dispatch, menus)
    const onCancel = () => dispatch(resetAllSettingsGeneric())
    const [requiresSave, setRequiresSave] = useState(false)
    const [preset, setPreset] = useState('')

    if (!requiresSave) {
        cancelButton += ' ' + styles.translateRight
        buttonClass += ' ' + styles.translateRight
    }

    useEffect(() => {
        for (const menuName in menus) {
            if (menus[menuName].value !== menus[menuName].currentValue)
                return setRequiresSave(true)
        }
        setRequiresSave(false)
    }, [menus])

    useEffect(() => {}, [requiresSave])

    const buttonSavePreset = (
        <IconButton
            iconUrl="/icons/save.svg"
            height={30}
            width={30}
            primary
            className={styles.centerH}
            invert
            tooltip='Save preset'
        />
    )

    const buttonImportPreset = (
        <IconButton
            iconUrl="/icons/import.svg"
            height={30}
            width={30}
            primary
            className={styles.centerH}
            invert
            tooltip='Load preset'
        />
    )

    const buttonAddPreset = (
        <Button disabled={preset === ''} primary className={styles.centerH + ' ' + styles.charButton} tooltip='Create preset'>
            +
        </Button>
    )

    return (
        <>
            <h2 className={styles.centerH}>Preset</h2>
            <TextInput
                className={styles.centerH + ' ' + styles.presetInput}
                directionUp
                suggestions={['Jeoff', 'Jeoffroy', 'Joe froid', 'Jeffrey']}
                filterSuggestions
                value={preset}
                onChange={setPreset}
            />
            {buttonAddPreset}
            {buttonImportPreset}
            {buttonSavePreset}
            <Button
                disabled={!requiresSave}
                primary
                tooltip="Save settings"
                onClick={onSave}
                className={buttonClass}
            >
                Save
            </Button>
            <Button
                disabled={!requiresSave}
                className={cancelButton}
                onClick={onCancel}
            >
                ×
            </Button>
        </>
    )
}
