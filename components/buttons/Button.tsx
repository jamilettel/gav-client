import React from 'react'
import styles from './Button.module.scss'

export interface ButtonProps {
    children?: React.ReactNode
    className?: string
    primary?: boolean
    onClick?: () => void
    tooltip?: string
}

export default function Button(props: ButtonProps) {
    let className = styles.button + ' ' + props.className ?? ''
    if (props.primary === true) className += ' ' + styles.primary

    const onMouseDown = (e: React.MouseEvent) => e.preventDefault()

    return (
        <button
            className={className}
            onClick={props.onClick}
            onMouseDown={onMouseDown}
            title={props.tooltip}
        >
            {props.children ?? 'Button'}
        </button>
    )
}
