import Button from '@/components/buttons/Button'
import { GenericProtocolData } from '@/websocket/GenericHandler'
import WebsocketHandler from '@/websocket/websocket'
import { useEffect } from 'react'

type GraphData = {
    name: string
    data: {
        [key: string]: number[]
    }
}

function getStats(data: GenericProtocolData): GraphData[] {
    const first = data.generation_stats?.at(0)
    if (first === undefined) return []
    const graphData: GraphData[] = []
    for (const element in first) {
        graphData.push({
            name: element,
            data: {},
        })
    }
    data.generation_stats?.forEach((gs) => {
        graphData.forEach((gd) => {
            for (const stat in gs[gd.name]) {
                if (gd.data[stat] === undefined)
                    gd.data[stat] = [gs[gd.name][stat]]
                else
                    gd.data[stat].push(gs[gd.name][stat])
            }
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
                        <h3>{stat.name}</h3>
                        {/* {stat.data.map((value, j) => (
                            <div key={`${i}-${j}-values`}>
                            {JSON.stringify(value)}
                            </div>
                            ))} */}
                        {JSON.stringify(stat.data)}
                    </div>
                ))}
            </div>
        </div>
    )
}
