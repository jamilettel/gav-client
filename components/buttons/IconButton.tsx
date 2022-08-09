import { ButtonProps } from '@/components/buttons/Button'
import Image from 'next/image'
import React, { useEffect, useRef } from 'react'
import styles from './Button.module.scss'

export default function IconButton(
    props: ButtonProps & {
        iconUrl: string
        height?: number
        width?: number
        layout?: 'fill' | 'fixed' | 'intrinsic' | 'responsive'
        white?: boolean
        disabled?: boolean
    }
) {
    let className = `${styles.button} ${styles.iconButton} ${props.className ?? ''}`
    if (props.primary === true) className += ' ' + styles.primary
    if (props.disabled) className += ' ' + styles.disabled
    const ref = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        if (props.disabled && document.activeElement == ref.current)
            ref.current?.blur()
    }, [props.disabled])

    const onMouseDown = (e: React.MouseEvent) => props.disabled ? e.preventDefault() : {}

    return (
        <button
            className={className}
            onClick={props.disabled ? undefined : props.onClick}
            onMouseDown={onMouseDown}
            title={props.tooltip}
            tabIndex={props.disabled ? -1 : undefined}
            ref={ref}
        >
            <Image
                src={props.iconUrl}
                layout={props.layout ?? 'fixed'}
                height={props.height}
                width={props.width}
                className={props.white ? styles.white : undefined}
            />
        </button>
    )
}
