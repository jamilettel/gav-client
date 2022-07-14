import ChooseSessionForm from '@/modules/choose-session/ChooseSessionForm'
import ConnectToServerForm from '@/modules/connect-to-server/ConnectToServerForm'
import Generic from '@/modules/generic/Generic'
import WebsocketHandler from '@/websocket/websocket'
import { useState } from 'react'

function getWebsocket(): WebsocketHandler {
    const [update, setUpdate] = useState(false)
    const [websocket] = useState(new WebsocketHandler())
    websocket.onUpdate = () => setUpdate(!update)
    return websocket
}

const PROTOCOL_PROVIDERS: {
    protocol: string
    provider: (ws: WebsocketHandler) => React.ReactNode
}[] = [
    {
        protocol: 'generic',
        provider: (ws) => <Generic websocket={ws} />,
    },
]

export default function App() {
    const websocket = getWebsocket()

    function onSubmit(url: string) {
        websocket.connect(url)
    }

    if (!websocket.isConnected()) {
        return (
            <div>
                <ConnectToServerForm onSubmit={onSubmit} />
            </div>
        )
    } else if (websocket.session === null) {
        return (
            <div>
                <ChooseSessionForm websocket={websocket} />
            </div>
        )
    } else {
        return (
            <div>
                Protocol: {websocket.protocol}
                {PROTOCOL_PROVIDERS.find(
                    (pp) => pp.protocol === websocket.protocol
                )?.provider(websocket) ?? <></>}
            </div>
        )
    }
}
