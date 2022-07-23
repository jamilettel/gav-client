import PlayButtons from '@/modules/generic/bar/PlayButtons';
import GenericGeneralStats from '@/modules/generic/statistics/GenericGeneralStats';
import GenericGraphs from '@/modules/generic/statistics/GenericGraphs';
import { useEffect } from 'react';

export default function GenericStatistics(props: {
    setABContent: (setContent: React.ReactNode | undefined) => any
}) {
    useEffect(() => {
        props.setABContent(<PlayButtons />)
    }, [])
    return (
        <>
            <GenericGraphs />
            <GenericGeneralStats />
        </>
    )
}
