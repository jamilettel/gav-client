import { ButtonProps } from '@/components/buttons/Button'
import Image from 'next/image'
import React from 'react'
import styles from './Button.module.scss'

export default function IconButton(
    props: ButtonProps & {
        iconUrl: string
        height?: number
        width?: number
        layout?: 'fill' | 'fixed' | 'intrinsic' | 'responsive'
        invert?: boolean
    }
) {
    let className = `${styles.button} ${styles.iconButton} ${props.className ?? ''}`
    if (props.primary === true) className += ' ' + styles.primary

    const onMouseDown = (e: React.MouseEvent) => e.preventDefault()

    return (
        <button
            className={className}
            onClick={props.onClick}
            onMouseDown={onMouseDown}
            title={props.tooltip}
        >
            <Image
                src={props.iconUrl}
                layout={props.layout ?? 'fixed'}
                height={props.height}
                width={props.width}
                className={props.invert ? styles.invert : undefined}
            />
        </button>
    )
}
