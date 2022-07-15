import Button from '@/components/buttons/Button'
import Form from '@/components/form/Form'
import TextInput from '@/components/input/TextInput'
import SimplePage from '@/components/layout/SimplePage'
import { useState } from 'react'
import styles from './ConnectToServerForm.module.scss'

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
        <SimplePage>
            <h1 className="title">Generic Algorithm Visualizer</h1>
            <Form onSubmit={onSubmit} className={styles.form}>
                <div className={styles.inputWrapper}>
                    <h3>Connect to GA Server</h3>
                    <div className={styles.input}>
                        <TextInput
                            onChange={setUrl}
                            value={url}
                            placeholder="ws://localhost:8080"
                        />
                    </div>
                </div>
                <Button primary={true}>Connect</Button>
            </Form>
        </SimplePage>
    )
}
