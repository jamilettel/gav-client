import ChooseSessionForm from '@/modules/choose-session/ChooseSessionForm'
import ConnectToServerForm from '@/modules/connect-to-server/ConnectToServerForm'
import Generic from '@/modules/generic/Generic'
import { useAppDispatch, useAppSelector } from '@/utils/store'
import { getProtocol, getSession } from '@/websocket/builtinSlice'
import { connectWS, isWebsocketConnected } from '@/websocket/connectionSlice'

const PROTOCOL_PROVIDERS: {
    protocol: string
    provider: () => React.ReactNode
}[] = [
    {
        protocol: 'generic',
        provider: () => <Generic />,
    },
]

export default function App() {
    const dispatch = useAppDispatch()
    const connected = useAppSelector(isWebsocketConnected)
    const session = useAppSelector(getSession)
    const protocol = useAppSelector(getProtocol)

    function onSubmit(url: string) {
        dispatch(connectWS({ url, dispatch }))
    }

    if (!connected) {
        return (
            <div>
                <ConnectToServerForm onSubmit={onSubmit} />
            </div>
        )
    } else if (session === undefined) {
        return (
            <div>
                <ChooseSessionForm />
            </div>
        )
    } else {
        return (
            <div>
                {PROTOCOL_PROVIDERS.find(
                    (pp) => pp.protocol === protocol
                )?.provider() ?? <></>}
            </div>
        )
    }
}
