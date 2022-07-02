import Button from '@/components/buttons/Button';
import Form from '@/components/form/Form';
import TextInput from '@/components/input/TextInput';
import WebsocketHandler from '@/websocket/websocket';
import { useState } from 'react';

export default function ChooseSessionForm(props: {
    websocket: WebsocketHandler
}) {
    const [session, setSession] = useState('session')
    const onSubmit = () => {
        const name = session.trim()
        if (name.length > 0)
            props.websocket.builtinCommand('join-or-create', {
                name: session
            });
    }

    return (
        <Form onSubmit={onSubmit}>
            <h3>Choose your session</h3>
            <TextInput onChange={setSession} value={session} />
            <br />
            <br />
            <Button primary={true}>
                Join session
            </Button>
        </Form>
    )
}
