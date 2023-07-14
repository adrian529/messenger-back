import { formatDistanceToNow, parseJSON } from 'date-fns'
import { useEffect, useState } from "react"
import { useAppDispatch } from "../../app/hooks"
import { setChattUrl } from "../auth/authSlice"

type ContactProps = {
    chatId: string;
    targetUser: {
        avatar: string,
        username: string,
        _id?: string
    };
    activeContact?: boolean;
    lastMessage?: Message;
}
interface Message {
    id: string;
    userId: string;
    body: string;
    timestamp?: number;
}

const Contact = (props: ContactProps) => {
    if (!props.targetUser) { return (<></>) }
    const dispatch = useAppDispatch()
    const [timestamp, setTimestamp] = useState('')

    let lastMessage = props.lastMessage ? props.lastMessage :
        {
            body: '',
            timestamp: 0,
            userId: '',
        };


    useEffect(() => {
        if (lastMessage.timestamp !== undefined && lastMessage.timestamp > 0) {
            const date = parseJSON(lastMessage.timestamp)
            let timeAgo = formatDistanceToNow(date)
            setTimestamp(timeAgo)

            const interval = setInterval(() => {
                let timeAgo = formatDistanceToNow(date)
                setTimestamp(timeAgo)
            }, 1000 * 10); //runs every 60 seconds
            return () => clearInterval(interval);
        }
    }, [props])

    let contactClasses = props.activeContact ? 'contact contact-active' : 'contact'

    return (
        <div className={contactClasses} onClick={() => {
            window.history.pushState({}, "", (`/chat/${props.chatId}`));
            dispatch(setChattUrl());
            //window.location.replace(`/chat/${props.chatId}`)
        }} >
            <img className="contact-img" alt="profile picture" src={props.targetUser.avatar}></img>
            <div className='contact-info'>
                <div className="contact-name">{props.targetUser.username}</div>
                <div className="contact-lastmsg">
                    <p>{lastMessage.body}</p>
                    <time dateTime="20:00" className='contact-lastmsg_timestamp'>
                        {timestamp}
                    </time>
                </div>
            </div>

        </div>
    )
}

export default Contact