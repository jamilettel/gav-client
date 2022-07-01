import React from 'react'

export default function Form(props: {
    children?: React.ReactNode
    className?: string
    onSubmit?: () => any
}) {
    let onSubmit = (e: any) => {
        e.preventDefault()
        if (props.onSubmit) props.onSubmit()
    }
    return (
        <form className={props.className} onSubmit={onSubmit}>
            {props.children}
        </form>
    )
}
