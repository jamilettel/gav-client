import Button from '@/components/buttons/Button'
import Form from '@/components/form/Form'
import TextInput from '@/components/input/TextInput'
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
        <div className="content-wrapper">
            <div className="border-before" />
            <h1 className="title">Generic Algorithm Visualizer</h1>
            <p className={styles.protocol}>Protocol: {props.websocket.protocol}</p>
            <Form onSubmit={onSubmit} className={styles.form}>
                <div className={styles.input}>
                    <h3>Choose your session</h3>
                    <TextInput onChange={setSession} value={session} placeholder="Session name" />
                </div>
                <Button primary={true}>Join session</Button>
            </Form>
            <div className="border-after" />
        </div>
    )
}
