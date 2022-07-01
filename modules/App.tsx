import ConnectToServerForm from '@/modules/connect-to-server/ConnectToServerForm';

export default function App() {

    function onSubmit(url: string) {
        console.log(url)
    }

    return (
        <div>
            <ConnectToServerForm onSubmit={onSubmit} />
        </div>
    )
}
