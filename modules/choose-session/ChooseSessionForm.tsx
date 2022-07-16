import Button from '@/components/buttons/Button'
import Form from '@/components/form/Form'
import TextInput from '@/components/input/TextInput'
import SimplePage from '@/components/layout/SimplePage'
import { LS_SESSION_NAME } from '@/utils/constants'
import { useEffect, useState } from 'react'
import styles from './ChooseSessionForm.module.scss'
import DisconnectButton from '@/components/buttons/presets/DisconnectButton'
import { useAppDispatch, useAppSelector } from '@/utils/store'
import { sendBuiltin } from '@/websocket/websocket'
import { getWebsocket } from '@/websocket/connectionSlice'
import { getProtocol, getTitle } from '@/websocket/builtinSlice'

export default function ChooseSessionForm() {
    const dispatch = useAppDispatch()
    const ws = useAppSelector(getWebsocket)
    const title = useAppSelector(getTitle)
    const protocol = useAppSelector(getProtocol)
    const [session, setSession] = useState('')

    useEffect(() => {
        setSession(localStorage.getItem(LS_SESSION_NAME) ?? '')
    }, [])

    const onSubmit = () => {
        const name = session.trim()
        if (name.length > 0)
            sendBuiltin(dispatch, 'join-or-create', { name: session })
    }

    const disconnect = () => ws?.close()

    return (
        <SimplePage>
            <div className={styles.header}>
                <div className={styles.separator}>
                    <DisconnectButton
                        tooltip="Disconnect"
                        onClick={disconnect}
                    />
                </div>
                <h1 className="title">
                    {title ?? 'Generic Algorithm Visualizer'}
                </h1>
                <div className={styles.separator} />
            </div>
            <p className={styles.protocol}>Protocol: {protocol}</p>
            <Form onSubmit={onSubmit} className={styles.form}>
                <div className={styles.input}>
                    <h3>Choose your session</h3>
                    <TextInput
                        onChange={setSession}
                        value={session}
                        placeholder="Session name"
                    />
                </div>
                <Button primary={true}>Join session</Button>
            </Form>
        </SimplePage>
    )
}
