import ConnectToServerForm from '@/modules/connect-to-server/ConnectToServerForm';
import WebsocketHandler from '@/websocket/websocket';
import { useState } from 'react';



export default function App() {
    const [connected, setConnected] = useState(false)
    const [websocket] = useState(new WebsocketHandler(setConnected))

    function onSubmit(url: string) {
        websocket.connect(url)
    }

    if (!connected) {
        return (
            <div>
                <ConnectToServerForm onSubmit={onSubmit} />
            </div>
        )
    } else {
        return (
            <div>
                connected!
            </div>
        )
    }
}
