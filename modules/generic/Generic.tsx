import Button from '@/components/buttons/Button'
import { GenericProtocolData } from '@/websocket/GenericHandler'
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
import {
    getGenericGeneration,
    getGenericGraphData,
    GraphData,
} from '@/modules/generic/genericSlice'
import { sendCommand } from '@/websocket/websocket'
import { useAppDispatch } from '@/utils/store'
import { useSelector } from 'react-redux'

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

export default function Generic() {
    const dispatch = useAppDispatch()
    useEffect(() => {
        sendCommand(dispatch, 'info')
    }, [])

    const runOneGen = () => sendCommand(dispatch, 'run-one-gen')

    const data = useSelector(getGenericGraphData)
    const generation = useSelector(getGenericGeneration)

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
            <h2>Generations: {generation}</h2>
            <h2>Actions:</h2>
            <Button onClick={runOneGen}>Run one generation</Button>
            <div>
                <h2>Statistics:</h2>
                {data?.map((stat, i) => (
                    <div key={`${i}-graphs`}>
                        <h3>{stat.name}</h3>
                        <Line
                            options={options}
                            data={{
                                labels: range(generation ?? 0, 1),
                                datasets: getDatasets(stat.data),
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
