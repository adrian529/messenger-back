import { format, parseJSON } from 'date-fns'

type MessageProps = {
    userId: string;
    body: string;
    timestamp: string;
}

const Message = (props: MessageProps) => {

    const date = parseJSON(props.timestamp)
    const formatted = format(date, 'dd/MM/yyyy hh:mm')

    let divClasses;
    divClasses = props.userId === 'xd' ? 'message my-message' : 'message'
    return (
        <div className={divClasses} title={formatted}>{props.body}</div>
    )
}

export default Message