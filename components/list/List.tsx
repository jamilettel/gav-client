import Focusable from '@/components/input/Focusable'
import { useEffect, useRef, useState } from 'react'
import styles from './List.module.scss'

function getHeaders(
    elem: any,
    mapper: ((any: any) => any) | undefined
): string[] {
    const headers = []
    let usedElem = elem
    if (mapper) usedElem = mapper(elem)
    for (const field in usedElem) {
        headers.push(field)
    }
    return headers
}

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
                {header.charAt(0).toUpperCase() +
                    header.slice(1).replaceAll('_', ' ')}
            </Focusable>
        )
    }
    return (
        <div
            key={header}
            className={styles.elem}
            style={{ minWidth: width, maxWidth: width }}
        >
            {header.charAt(0).toUpperCase() + header.slice(1)}
        </div>
    )
}

function getRow(
    data: any,
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
    } = {},
    rowClass: string | undefined,
    onClickRow: ((rowData: any) => any) | undefined,
    last: boolean,
    mapper: ((any: any) => any) | undefined
) {
    const content: React.ReactNode[] = []
    const rowData = mapper ? mapper(data) : data
    for (const header of headers) {
        let width = colWidths ? colWidths[header] : undefined
        let value = rowData[header]
        let title = undefined
        if (
            !cellProvider[header] &&
            typeof value === 'number' &&
            Number.isInteger(value) === false
        ) {
            title = value.toString()
            value = value.toFixed(1)
        }
        content.push(
            <div
                key={header + index.toString()}
                className={styles.elem + ' ' + (colClass[header] ?? '')}
                style={{ minWidth: width, maxWidth: width }}
                title={title}
            >
                {cellProvider[header]
                    ? cellProvider[header](rowData[header])
                    : value}
            </div>
        )
    }

    let className = styles.row
    if (index % 2 == 1) className += ' ' + styles.alternateRow
    if (rowClass) className += ' ' + rowClass
    if (last) className += ' ' + styles.lastRow
    return (
        <div
            onMouseDown={() => (onClickRow ? onClickRow(data) : {})}
            className={className}
            key={`header-${index}`}
        >
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
    rowClass?: string
    onClickRow?: (rowData: any) => any
    mapper?: (row: any) => any
}) {
    const colClass = props.columnClass ?? {}
    const colWidth = props.columnWidths ?? {}
    const cellProvider = props.cellContentProvider ?? {}
    const headerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const [data, setData] = useState(props.data)
    const [sortby, setSortBy] = useState(null as SortSettings | null)
    const [content, setContent] = useState([] as React.ReactNode[])

    useEffect(() => {
        setData(props.data)
        sortData(props.data)
    }, [props.data])

    useEffect(() => {
        sortData(data)
    }, [sortby])

    useEffect(() => {
        const newContent = data.map((ind, index) =>
            getRow(
                ind,
                index,
                headers,
                cellProvider,
                colWidth,
                colClass,
                props.rowClass,
                props.onClickRow,
                index === data.length - 1,
                props.mapper
            )
        )
        setContent(newContent)
    }, [data])

    const sortData = (dataToSort: any) => {
        if (!sortby) return
        const dataClone = [...dataToSort]
        dataClone.sort((a, b) => {
            if (typeof a[sortby.column] !== typeof b[sortby.column])
                return typeof a[sortby.column] < typeof b[sortby.column]
                    ? -1
                    : 0
            if (a[sortby.column] < b[sortby.column]) return -1
            if (a[sortby.column] == b[sortby.column]) return 0
            return 1
        })
        if (sortby!.ascending == false) dataClone.reverse()
        setData(dataClone)
    }

    const firstElem = props.mapper ? props.mapper(data[0]) : data[0]

    let headers: string[] = []
    if (data.length > 0) headers = getHeaders(firstElem, props.mapper)

    const setNewSortCol = (col: string) => {
        if (sortby?.column === col) {
            if (sortby.ascending) setSortBy({ ascending: false, column: col })
            else {
                setSortBy(null)
                setData(props.data)
            }
        } else {
            setSortBy({ ascending: true, column: col })
        }
    }

    const headerElems = headers.map((header) => {
        const sortable =
            typeof firstElem[header] === 'string' ||
            typeof firstElem[header] === 'number'
        return getHeader(
            header,
            colWidth[header],
            sortable ? setNewSortCol : null,
            sortby
        )
    })

    const className =
        styles.table + (props.className ? ` ${props.className}` : '')

    const onScrollHeaders = (e: React.UIEvent) => {
        contentRef.current!.scrollLeft = e.currentTarget.scrollLeft
    }

    const onScrollContent = (e: React.UIEvent) => {
        headerRef.current!.scrollLeft = e.currentTarget.scrollLeft
    }

    return (
        <div className={styles.wrapper}>
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
        </div>
    )
}
