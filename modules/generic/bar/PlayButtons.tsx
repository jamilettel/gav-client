import IconButton from '@/components/buttons/IconButton'
import NumberInput from '@/components/input/NumberInput'
import { useAppDispatch } from '@/utils/store'
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
    const runOneGen = () => sendCommand(dispatch, 'run-one-gen')
    const [multiRunValue, setMultiRunValue] = useState(getMultiRunValue())

    useEffect(() => {
        let value = multiRunValue
        if (multiRunValue < 0 || multiRunValue > 100) {
            value = Math.max(0, Math.min(multiRunValue, 100))
            setMultiRunValue(value)
        }
        localStorage.setItem('genericMultiRunValue', value.toString())
    }, [multiRunValue])

    return (
        <>
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
                <IconButton iconUrl="/icons/play.svg" height={45} width={45} />
                <NumberInput
                    min={0}
                    max={100}
                    value={multiRunValue}
                    onChange={setMultiRunValue}
                    title="Number of generations"
                />
            </div>
        </>
    )
}
