import Button from '@/components/buttons/Button'
import { GenericProtocolData } from '@/websocket/GenericHandler'
import WebsocketHandler from '@/websocket/websocket'
import { useEffect } from 'react'

type GraphData = {
    graph: string
    data: string[]
}

function getStats(data: GenericProtocolData): GraphData[] {
    const first = data.generation_stats?.at(0)
    if (first === undefined) return []
    const graphData: GraphData[] = []
    for (const element in first) {
        graphData.push({
            graph: element,
            data: [],
        })
    }
    /* for (const genData in data.generation_stats) {
     *     graphData.forEach((gd) => {
     *         gd.data.push(genData[gd.graph])
     *     })
     * } */
    data.generation_stats?.forEach((gs) => {
        graphData.forEach((gd) => {
            gd.data.push(gs[gd.graph])
        })
    })
    return graphData
}

export default function Generic(props: { websocket: WebsocketHandler }) {
    useEffect(() => {
        // send info command on join session
        props.websocket.command('info')
    }, [])

    const runOneGen = () => props.websocket.command('run-one-gen')

    const data = props.websocket.data as GenericProtocolData

    const stats = getStats(data)

    return (
        <div>
            <h2>Generations: {data.generation}</h2>
            <Button onClick={runOneGen}>Run one generation</Button>
            <div>
                <h2>Stats:</h2>
                {stats.map((stat, i) => (
                    <div key={`${i}-graphs`}>
                        <h3>{stat.graph}</h3>
                        {stat.data.map((value, j) => (
                            <div key={`${i}-${j}-values`}>{value}</div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}
