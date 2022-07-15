import { ButtonProps } from '@/components/buttons/Button'
import IconButton from '@/components/buttons/IconButton'
import styles from './DisconnectButton.module.scss'

export default function DisconnectButton(
    props: ButtonProps
) {
    return (
        <IconButton
            {...props}
            className={`${styles.redButton} ${props.className ?? ''}`}
            iconUrl="/icons/disconnect.svg"
            height={35}
            width={35}
            layout="fixed"
        />
    )
}
