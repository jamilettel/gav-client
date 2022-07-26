import Button from '@/components/buttons/Button'
import { getSettings, resetAllSettingsGeneric } from '@/modules/generic/genericSlice'
import { useAppDispatch, useAppSelector } from '@/utils/store'
import { saveSettingsGeneric } from '@/websocket/GenericHandler'
import styles from './ActionBar.module.scss'

export default function SaveSettingsBar() {
    const dispatch = useAppDispatch()
    const menus = useAppSelector(getSettings) ?? {}
    const buttonClass = styles.button + ' ' + styles.primary + ' ' + styles.alignRight
    const cancelButton = styles.button + ' ' + styles.cancelButton
    const onSave = () => saveSettingsGeneric(dispatch, menus)
    const onCancel = () => dispatch(resetAllSettingsGeneric())


    return (
        <>
            <Button primary tooltip="Save settings" onClick={onSave} className={buttonClass}>
                Save
            </Button>
            <Button className={cancelButton} onClick={onCancel}>
                ×
            </Button>
        </>
    )
}
