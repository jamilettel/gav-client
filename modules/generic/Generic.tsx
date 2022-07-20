import { useEffect, useState } from 'react'
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
    getGenericGeneralStats,
    getGenericGeneration,
    getGenericGraphData,
} from '@/modules/generic/genericSlice'
import { sendCommand } from '@/websocket/websocket'
import { useAppDispatch } from '@/utils/store'
import { useSelector } from 'react-redux'
import NavbarPage from '@/components/layout/NavbarPage'
import SessionPage from '@/components/layout/SessionPage'
import ActionBarGeneric from '@/modules/generic/bar/ActionBar'
import styles from './Generic.module.scss'

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

    const data = useSelector(getGenericGraphData)
    const generation = useSelector(getGenericGeneration)
    const stats = useSelector(getGenericGeneralStats)

    return (
        <NavbarPage className={styles.navbar}>
            <SessionPage>
                <div>{JSON.stringify(stats)}</div>
                <div>
                    {data?.map((stat, i) => (
                        <div key={`${i}-graphs`}>
                            <h3>{stat.name}</h3>
                            <Line
                                updateMode='none'
                                options={{ ...options }}
                                data={{
                                    labels: range(generation ?? 0, 1),
                                    datasets: getDatasets(stat.data),
                                }}
                            />
                        </div>
                    ))}
                </div>
            </SessionPage>
            <ActionBarGeneric />
        </NavbarPage>
    )
}
