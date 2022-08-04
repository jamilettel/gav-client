import Focusable from '@/components/input/Focusable'
import { useEffect, useRef, useState } from 'react'
import styles from './List.module.scss'

function getHeaders(elem: any): string[] {
    const headers = []
    for (const field in elem) {
        headers.push(field)
    }
    return headers
}

let i = 0
function getHeader(
    header: string,
    width: string | number | undefined,
    setSortby: ((col: string) => any) | null,
    sortby: SortSettings | null
) {
    if (setSortby) {
        let className = styles.elemButton
        if (sortby?.column === header)
            className +=
                ' ' +
                (sortby.ascending
                    ? styles.sortedAscending
                    : styles.sortedDescending)
        return (
            <Focusable
                key={header}
                className={className}
                onClick={() => setSortby(header)}
                style={{ minWidth: width, maxWidth: width }}
            >
                {header}
            </Focusable>
        )
    }
    return (
        <div
            key={header}
            className={styles.elem}
            style={{ minWidth: width, maxWidth: width }}
        >
            {header}
        </div>
    )
}

function getRow(
    ind: any,
    index: number,
    headers: string[],
    cellProvider: {
        [columnName: string]: (cellData: any) => React.ReactNode
    } = {},
    colWidths: {
        [columName: string]: number | string
    } = {},
    colClass: {
        [columName: string]: string
    } = {}
) {
    const content: React.ReactNode[] = []
    for (const header of headers) {
        let width = colWidths ? colWidths[header] : undefined
        content.push(
            <div
                key={header + index.toString()}
                className={styles.elem + ' ' + (colClass[header] ?? '')}
                style={{ minWidth: width, maxWidth: width }}
            >
                {cellProvider[header]
                    ? cellProvider[header](ind[header])
                    : ind[header]}
            </div>
        )
    }

    let className = styles.row
    if (index % 2 == 1) className += ' ' + styles.alternateRow
    return (
        <div className={className} key={index}>
            {content}
        </div>
    )
}

interface SortSettings {
    column: string
    ascending: boolean
}

/**
 * List
 * Default width of a column is 200px
 * Sorting is enabled on all string and number columns
 */
export default function List(props: {
    data: any[]
    columnWidths?: {
        [columName: string]: number | string
    }
    columnClass?: {
        [columName: string]: string
    }
    className?: string
    cellContentProvider?: {
        [columName: string]: (cellData: any) => React.ReactNode
    }
}) {
    const colClass = props.columnClass ?? {}
    const colWidth = props.columnWidths ?? {}
    const cellProvider = props.cellContentProvider ?? {}
    const headerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const [data, setData] = useState(props.data)
    const [sortby, setSortBy] = useState(null as SortSettings | null)

    useEffect(() => {
        setData(props.data)
        sortData(props.data)
    }, [props.data])

    useEffect(() => {
        sortData(data)
    }, [sortby])

    const sortData = (dataToSort: any) => {
        if (!sortby) return
        const dataClone = [...dataToSort]
        dataClone.sort((a, b) => {
            if (a[sortby.column] < b[sortby.column]) return -1
            if (a[sortby.column] == b[sortby.column]) return 0
            return 1
        })
        if (sortby!.ascending == false) dataClone.reverse()
        console.log(dataClone)
        setData(dataClone)
    }

    let headers: string[] = []
    if (data.length > 0) headers = getHeaders(data[0])

    const setNewSortCol = (col: string) => {
        if (sortby?.column === col) {
            setSortBy({ ascending: !sortby.ascending, column: col })
        } else {
            setSortBy({ ascending: true, column: col })
        }
    }

    const headerElems = headers.map((header) => {
        const sortable =
            typeof data[0][header] === 'string' ||
            typeof data[0][header] === 'number'
        return getHeader(
            header,
            colWidth[header],
            sortable ? setNewSortCol : null,
            sortby
        )
    })

    let row = 0
    const content = data.map((ind) =>
        getRow(ind, row++, headers, cellProvider, colWidth, colClass)
    )

    const className =
        styles.table + (props.className ? ` ${props.className}` : '')

    const onScrollHeaders = (e: React.UIEvent) => {
        if (i++ % 2) contentRef.current!.scrollLeft = e.currentTarget.scrollLeft
    }

    const onScrollContent = (e: React.UIEvent) => {
        if (i++ % 2) headerRef.current!.scrollLeft = e.currentTarget.scrollLeft
    }

    return (
        <>
            <div className={styles.headerWrapper}>
                <div
                    className={styles.header}
                    onScroll={onScrollHeaders}
                    ref={headerRef}
                >
                    {headerElems}
                </div>
            </div>
            <div
                className={className}
                onScroll={onScrollContent}
                ref={contentRef}
            >
                <div className={styles.content}>{content}</div>
            </div>
        </>
    )
}
