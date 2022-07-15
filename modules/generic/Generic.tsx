import Button from '@/components/buttons/Button'
import { GenericProtocolData } from '@/websocket/GenericHandler'
import WebsocketHandler from '@/websocket/websocket'
import { useEffect } from 'react'
import {
    Chart,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    ChartDataset,
    CategoryScale,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

const colors = [
    {
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
    {
        borderColor: 'rgb(99, 255, 132)',
        backgroundColor: 'rgba(99, 255, 132, 0.5)',
    },
    {
        borderColor: 'rgb(235, 162, 235)',
        backgroundColor: 'rgba(235, 162, 235, 0.5)',
    },
]

Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
)

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
                else gd.data[stat].push(gs[gd.name][stat])
            }
        })
    })
    return graphData
}

function getDatasets(data: {
    [key: string]: number[]
}): ChartDataset<'line', number[]>[] {
    const datasets: ChartDataset<'line', number[]>[] = []
    let i = 0
    for (const line in data) {
        datasets.push({
            data: data[line],
            label: line,
            ...colors[i],
        })
        i++
    }
    return datasets
}

function range(size: number, startAt = 0): number[] {
    const arr: number[] = []
    for (let i = 0; i < size; i++) {
        arr.push(i + startAt)
    }
    return arr
}

export default function Generic(props: { websocket: WebsocketHandler }) {
    useEffect(() => {
        props.websocket.command('info')
    }, [])

    const runOneGen = () => props.websocket.command('run-one-gen')

    const data = props.websocket.data as GenericProtocolData

    const stats = getStats(data)

    const options = {
        scale: {
            font: {
                family: 'Comfortaa',
            },
        },
        scales: {
            y: {
                grid: {
                    color: '#444',
                },
                ticks: {
                    color: '#fff',
                },
            },
            x: {
                beginAtZero: true,
                grid: {
                    color: '#444',
                },
                ticks: {
                    color: '#fff',
                },
            },
        },
    }

    return (
        <div>
            <h2>Generations: {data.generation}</h2>
            <h2>Actions:</h2>
            <Button onClick={runOneGen}>Run one generation</Button>
            <div>
                <h2>Statistics:</h2>
                {stats.map((stat, i) => (
                    <div key={`${i}-graphs`}>
                        <h3>{stat.name}</h3>
                        <Line
                            options={options}
                            data={{
                                labels: range(data.generation ?? 0, 1),
                                datasets: getDatasets(stat.data),
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
