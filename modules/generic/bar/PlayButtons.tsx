import IconButton from '@/components/buttons/IconButton'
import NumberInput from '@/components/input/NumberInput'
import { getGenericStatus } from '@/modules/generic/genericSlice'
import { useAppDispatch, useAppSelector } from '@/utils/store'
import { sendCommand } from '@/websocket/websocket'
import { useEffect, useState } from 'react'
import stylesAction from './ActionBar.module.scss'
import styles from './PlayButtons.module.scss'

function getMultiRunValue() {
    try {
        let value = localStorage.getItem('genericMultiRunValue')
        if (value) return parseInt(value)
    } catch {}
    return 10
}

export default function PlayButtons() {
    const dispatch = useAppDispatch()
    const [multiGenValue, setMultiGenValue] = useState(getMultiRunValue())
    const status = useAppSelector(getGenericStatus) ?? 'idle'

    const runOneGen = () => sendCommand(dispatch, 'run-one-gen')

    const runNGen = () =>
        sendCommand(dispatch, 'run-n-gen', {
            generations: multiGenValue,
        })

    useEffect(() => {
        let value = multiGenValue
        if (multiGenValue < 0 || multiGenValue > 100) {
            value = Math.max(0, Math.min(multiGenValue, 100))
            setMultiGenValue(value)
        }
        localStorage.setItem('genericMultiRunValue', value.toString())
    }, [multiGenValue])

    return (
        <>
            <h2 className={stylesAction.centerV}>Status</h2>
            <h2 className={stylesAction.centerV + ' ' + styles.status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </h2>
            <div className={stylesAction.buttonOne}>
                <IconButton
                    className={stylesAction.button}
                    iconUrl="/icons/play.svg"
                    height={45}
                    width={45}
                    onClick={runOneGen}
                    tooltip="Run one generation"
                />
            </div>
            <div className={stylesAction.centerV + ' ' + styles.multiPlay}>
                <IconButton
                    onClick={runNGen}
                    iconUrl="/icons/play.svg"
                    height={45}
                    width={45}
                    tooltip={`Run ${multiGenValue} generations`}
                />
                <NumberInput
                    min={0}
                    max={100}
                    value={multiGenValue}
                    onChange={setMultiGenValue}
                    title="Number of generations"
                />
            </div>
        </>
    )
}
