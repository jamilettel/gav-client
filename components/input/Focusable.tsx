import { CSSProperties } from 'react'

export default function Focusable(props: {
    children?: React.ReactNode
    onClick?: () => any
    focusable?: boolean
    className?: string
    style?: CSSProperties
}) {
    const tabIndex = props.focusable ?? true ? 0 : undefined
    const onClick = (e: React.MouseEvent) => {
        if (props.onClick) props.onClick()
    }
    const onMouseDown = (e: React.MouseEvent) => {
        e.preventDefault()
    }
    const onKeyDown = (e: React.KeyboardEvent) => {
        if (props.onClick && (e.key === 'Enter' || e.key === ' '))
            props.onClick!()
    }

    return (
        <div
            className={props.className}
            tabIndex={tabIndex}
            onClick={onClick}
            onKeyDown={onKeyDown}
            onMouseDown={onMouseDown}
            style={props.style}
        >
            {props.children}
        </div>
    )
}
