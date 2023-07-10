import { format, parseJSON } from 'date-fns'
import { selectCurrentUserId } from '../auth/authSlice'
import { useAppSelector } from '../../app/hooks'

type MessageProps = {
    userId: string;
    body: string;
    timestamp: string;
}

const Message = (props: MessageProps) => {
    const currentUserId = useAppSelector(state => selectCurrentUserId(state))

    const date = parseJSON(props.timestamp)
    const formatted = format(date, 'dd/MM/yyyy HH:mm')

    let messageClasses;
    messageClasses = props.userId === currentUserId ? 'message my-message' : 'message'
    return (
        <li className={messageClasses} title={formatted}>{props.body}</li>
    )
}

export default Message