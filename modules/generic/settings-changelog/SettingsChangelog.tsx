import styles from './SettingsChangelog.module.scss'
import { useEffect } from 'react'
import List from '@/components/list/List'
import { useAppSelector } from '@/utils/store'
import { getGenericSettingsChangelog } from '@/modules/generic/genericSlice'

export default function SettingsChangelog(props: {
    setABContent: (setContent: React.ReactNode | undefined) => any
}) {
    const settingsChangelog = useAppSelector(getGenericSettingsChangelog)

    useEffect(() => props.setABContent(undefined), [])

    return (
        <div className={styles.content}>
            <List
                cellContentProvider={{
                    generation: (data: number) => data >= 0 ? data : 'Init'
                }}
                columnWidths={{
                    setting: 500,
                    value: 400,
                }}
                data={settingsChangelog ?? []}
            />
        </div>
    )
}
