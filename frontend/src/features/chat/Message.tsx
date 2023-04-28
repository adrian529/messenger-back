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
    const formatted = format(date, 'dd/MM/yyyy hh:mm')

    let divClasses;
    divClasses = props.userId === currentUserId ? 'message my-message' : 'message'
    return (
        <div className={divClasses} title={formatted}>{props.body}</div>
    )
}

export default Message