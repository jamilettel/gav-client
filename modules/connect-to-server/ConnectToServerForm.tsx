import Button from '@/components/buttons/Button'
import Form from '@/components/form/Form'
import TextInput from '@/components/input/TextInput'
import { useState } from 'react'

export default function ConnectToServerForm(props: {
    onSubmit?: (url: string) => any
}) {
    const [url, setUrl] = useState('ws://localhost:8080')

    const onSubmit =
        props.onSubmit !== undefined
            ? () => {
                props.onSubmit!(url)
            }
            : undefined

    return (
        <Form onSubmit={onSubmit}>
            <h3>Connect to GA Server</h3>
            <TextInput onChange={setUrl} value={url} />
            <br />
            <br />
            <Button primary={true}>
                Connect
            </Button>
        </Form>
    )
}
