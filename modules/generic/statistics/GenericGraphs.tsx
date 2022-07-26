import styles from './GenericGraphs.module.scss'
import {
    getGenericGeneration,
    getGenericGraphData,
} from '@/modules/generic/genericSlice'
import { Line } from 'react-chartjs-2'
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
import { useAppSelector } from '@/utils/store'

const colors = [
    {
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
        borderColor: 'rgb(126, 104, 212)',
        backgroundColor: 'rgba(126, 104, 212, 0.5)',
    },
    {
        borderColor: 'rgb(99, 255, 132)',
        backgroundColor: 'rgba(99, 255, 132, 0.5)',
    },
    {
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
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

function range(size: number, startAt = 0): number[] {
    const arr: number[] = []
    for (let i = 0; i < size; i++) {
        arr.push(i + startAt)
    }
    return arr
}

export default function GenericGraphs() {
    let colorIndex = 0;

    function getDatasets(data: {
        [key: string]: number[]
    }): ChartDataset<'line', number[]>[] {
        const datasets: ChartDataset<'line', number[]>[] = []
        for (const line in data) {
            datasets.push({
                data: data[line],
                label: line,
                ...colors[colorIndex % colors.length],
            })
            colorIndex++
        }
        return datasets
    }

    const data = useAppSelector(getGenericGraphData)
    const generation = useAppSelector(getGenericGeneration)

    if (!data?.length) {
        return (
            <div className={styles.contentEmpty}>
                Graphs will appear here after you compute<br />
                the first generation
            </div>
        )
    }

    return (
        <div className={styles.content}>
            {data?.map((stat, i) => (
                <div key={`${i}-graphs`} className={styles.wrapper}>
                    <h3>{stat.name}</h3>
                    <Line
                        className={styles.graph}
                        options={{ ...options }}
                        height={400}
                        width={885}
                        data={{
                            labels: range(generation ?? 0, 1),
                            datasets: getDatasets(stat.data),
                        }}
                    />
                </div>
            ))}
        </div>
    )
}
