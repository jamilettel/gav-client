import React from 'react'
import styles from './Button.module.scss'

export interface ButtonProps {
    children?: React.ReactNode
    className?: string
    primary?: boolean
    onClick?: () => void
    tooltip?: string
    disabled?: boolean
}

export default function Button(props: ButtonProps) {
    let className = styles.button + ' ' + props.className ?? ''
    if (props.primary === true) className += ' ' + styles.primary
    if (props.disabled) className += ' ' + styles.disabled

    const onMouseDown = (e: React.MouseEvent) => e.preventDefault()

    return (
        <button
            tabIndex={props.disabled ? -1 : undefined}
            className={className}
            onClick={props.disabled ? undefined : props.onClick}
            onMouseDown={onMouseDown}
            title={props.tooltip}
        >
            {props.children ?? 'Button'}
        </button>
    )
}
