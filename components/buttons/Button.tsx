import React from 'react'
import styles from './Button.module.scss'

export default function Button(props: {
    children?: React.ReactNode
    className?: string
    primary?: boolean
    onClick?: () => void,
}) {
    let className = styles.button + ' ' + props.className ?? ''
    if (props.primary === true) className += ' ' + styles.primary

    const onMouseDown = (e: React.MouseEvent) => e.preventDefault()

    return (
        <button
            className={className}
            onClick={props.onClick}
            onMouseDown={onMouseDown}
        >
            {props.children ?? 'Button'}
        </button>
    )
}
