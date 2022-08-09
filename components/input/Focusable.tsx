import { CSSProperties } from 'react'

export default function Focusable(props: {
    children?: React.ReactNode
    onClick?: () => any
    focusable?: boolean
    className?: string
    style?: CSSProperties
}) {
    const tabIndex = props.focusable ?? true ? 0 : -1
    const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (props.onClick) props.onClick()
        if (props.focusable)
            e.currentTarget.focus()
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
            style={props.style}
        >
            {props.children}
        </div>
    )
}
