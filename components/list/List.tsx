import { useRef } from 'react'
import styles from './List.module.scss'

function getHeaders(elem: any): string[] {
    const headers = []
    for (const field in elem) {
        headers.push(field)
    }
    return headers
}

let i = 0
function getHeader(header: string, width: string | number | undefined) {
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

/**
 * List
 * Default width of a column is 200px
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
    columnSort?: {
        [colName: string]: (data: any[]) => any[]
    }
}) {
    const colClass = props.columnClass ?? {}
    const colWidth = props.columnWidths ?? {}
    const cellProvider = props.cellContentProvider ?? {}
    const headerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    let headers: string[] = []
    if (props.data.length > 0) headers = getHeaders(props.data[0])

    const headerElems = headers.map((header) =>
        getHeader(header, colWidth[header])
    )

    let row = 0
    const content = props.data.map((ind) =>
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
