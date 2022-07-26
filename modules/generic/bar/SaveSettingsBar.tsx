import Button from '@/components/buttons/Button'
import styles from './ActionBar.module.scss'

export default function SaveSettingsBar(props: {
    onSave: () => any
    onCancel: () => any
}) {
    const buttonClass = styles.button + ' ' + styles.primary + ' ' + styles.alignRight
    const cancelButton = styles.button + ' ' + styles.cancelButton

    return (
        <>
            <Button primary tooltip="Save settings" onClick={props.onSave} className={buttonClass}>
                Save
            </Button>
            <Button className={cancelButton} onClick={props.onCancel}>
                ×
            </Button>
        </>
    )
}
