import Button from '@/components/buttons/Button'
import Form from '@/components/form/Form'
import TextInput from '@/components/input/TextInput'
import SimplePage from '@/components/layout/SimplePage'
import WebsocketHandler from '@/websocket/websocket'
import { useState } from 'react'
import styles from './ChooseSessionForm.module.scss'

export default function ChooseSessionForm(props: {
    websocket: WebsocketHandler
}) {
    const [session, setSession] = useState('session')
    const onSubmit = () => {
        const name = session.trim()
        if (name.length > 0)
            props.websocket.builtinCommand('join-or-create', {
                name: session,
            })
    }

    return (
        <SimplePage>
            <h1 className="title">Generic Algorithm Visualizer</h1>
            <p className={styles.protocol}>Protocol: {props.websocket.protocol}</p>
            <Form onSubmit={onSubmit} className={styles.form}>
                <div className={styles.input}>
                    <h3>Choose your session</h3>
                    <TextInput onChange={setSession} value={session} placeholder="Session name" />
                </div>
                <Button primary={true}>Join session</Button>
            </Form>
        </SimplePage>
    )
}
