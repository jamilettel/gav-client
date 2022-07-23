import IconButton from '@/components/buttons/IconButton'
import { useAppDispatch } from '@/utils/store'
import { sendCommand } from '@/websocket/websocket'
import styles from './ActionBar.module.scss'

export default function PlayButtons() {
    const dispatch = useAppDispatch()
    const runOneGen = () => sendCommand(dispatch, 'run-one-gen')

    return (
        <div className={styles.buttonOne}>
            <IconButton
                className={styles.button}
                iconUrl="/icons/play.svg"
                height={45}
                width={45}
                onClick={runOneGen}
            />
        </div>
    )
}
