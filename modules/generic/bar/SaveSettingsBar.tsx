import Button from '@/components/buttons/Button'
import IconButton from '@/components/buttons/IconButton'
import TextInput from '@/components/input/TextInput'
import {
    getSettings,
    resetAllSettingsGeneric,
} from '@/modules/generic/genericSlice'
import {
    deletePreset,
    getLastUsedPreset,
    getPresetList,
    loadPresetGeneric,
    presetHasChanged,
    savePreset,
} from '@/utils/presets'
import { useAppDispatch, useAppSelector } from '@/utils/store'
import { getTitle } from '@/websocket/builtinSlice'
import { saveSettingsGeneric } from '@/websocket/GenericHandler'
import { useEffect, useState } from 'react'
import styles from './ActionBar.module.scss'

export default function SaveSettingsBar() {
    const settings = useAppSelector(getSettings)
    const title = useAppSelector(getTitle)
    const dispatch = useAppDispatch()
    const menus = useAppSelector(getSettings) ?? {}
    let buttonClass =
        styles.button + ' ' + styles.primary + ' ' + styles.alignRight
    let cancelButton = styles.button + ' ' + styles.charButton
    const onSave = () => saveSettingsGeneric(dispatch, menus)
    const onCancel = () => dispatch(resetAllSettingsGeneric())
    const [requiresSave, setRequiresSave] = useState(false)
    const [preset, setPreset] = useState('')
    const [presetList, setPresetList] = useState(getPresetList(title))
    const [presetChanged, setPresetChanged] = useState(false)
    const presetExists = presetList.includes(preset)

    if (!requiresSave) {
        cancelButton += ' ' + styles.translateRight
        buttonClass += ' ' + styles.translateRight
    }

    useEffect(() => {
        setPresetChanged(presetHasChanged(title, preset, menus))
        for (const menuName in menus) {
            if (menus[menuName].value !== menus[menuName].currentValue)
                return setRequiresSave(true)
        }
        setRequiresSave(false)
    }, [menus])

    useEffect(() => {
        setPresetChanged(presetHasChanged(title, preset, menus))
    }, [preset, presetList])

    useEffect(() => {
        setPreset(getLastUsedPreset(title) ?? '')
    }, [title])

    const buttonSavePreset = (
        <IconButton
            iconUrl="/icons/save.svg"
            height={30}
            width={30}
            primary
            className={styles.centerV}
            white
            tooltip="Save preset"
            onClick={() => {
                savePreset(title, preset, settings ?? {})
                setPresetChanged(false)
            }}
            disabled={!presetChanged}
        />
    )

    const buttonImportPreset = (
        <IconButton
            iconUrl="/icons/import.svg"
            height={30}
            width={30}
            primary
            className={styles.centerV}
            white
            tooltip="Load preset"
            onClick={() => loadPresetGeneric(title, preset, dispatch)}
            disabled={!presetChanged}
        />
    )

    const buttonRemovePreset = (
        <Button
            disabled={preset === ''}
            primary
            className={
            styles.centerV + ' ' + styles.charButton + ' ' + styles.red
            }
            tooltip="Delete preset"
            onClick={() => {
                deletePreset(title, preset)
                setPresetList(getPresetList(title))
                setPreset('')
            }}
        >
            -
        </Button>
    )

    const buttonAddPreset = (
        <Button
            disabled={preset === ''}
            className={styles.centerV + ' ' + styles.charButton}
            tooltip="Create preset"
            primary
            onClick={() => {
                savePreset(title, preset, settings ?? {})
                setPresetList(getPresetList(title))
            }}
        >
            +
        </Button>
    )

    return (
        <>
            <h2 className={styles.centerV}>Preset</h2>
            <TextInput
                className={styles.centerV + ' ' + styles.presetInput}
                directionUp
                suggestions={presetList}
                value={preset}
                onChange={(input) => {
                    setPreset(input)
                    if (presetList.includes(input))
                        loadPresetGeneric(title, input, dispatch)
                }}
                placeholder="Choose preset..."
            />
            {!presetExists && buttonAddPreset}
            {presetExists && buttonSavePreset}
            {presetExists && buttonImportPreset}
            {presetExists && buttonRemovePreset}
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
