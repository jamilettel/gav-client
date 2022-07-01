export default function TextInput(props: {
    children?: React.ReactNode
    onChange?: (str: any) => any
    value?: string
}) {
    return (
        <input
            type="text"
            value={props.value}
            onChange={(e) => {
                if (props.onChange) props.onChange(e.target.value)
            }}
        />
    )
}
