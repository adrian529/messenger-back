import { useNavigate } from "react-router-dom"
import { setChattUrl } from "../auth/authSlice"
import { useAppSelector } from "../../app/hooks"
import { useAppDispatch } from "../../app/hooks"
import { formatDistanceToNow, parseJSON } from 'date-fns'
import { useState, useEffect } from "react"

type ContactProps = {
    chatId: string;
    lastMessage: {
        body: string,
        timestamp: string,
        userId: string,
        _id?: string
    };
    targetUser: {
        avatar: string,
        username: string,
        _id?: string
    };
    activeContact?: boolean;
}


const Contact = (props: ContactProps) => {

    const dispatch = useAppDispatch()
    const [timestamp, setTimestamp] = useState('')

    useEffect(() => {
        const date = parseJSON(props.lastMessage.timestamp)
        let timeAgo = formatDistanceToNow(date)
        setTimestamp(timeAgo)

        const interval = setInterval(() => {
            let timeAgo = formatDistanceToNow(date)
            setTimestamp(timeAgo)
        }, 1000 * 60); //runs every 60 seconds
        return () => clearInterval(interval);

    }, [props])

    let contactClasses = props.activeContact ? 'contact contact-active' : 'contact'

        return (
            <div className={contactClasses} onClick={() => {
                window.history.pushState({}, "", (`/chat/${props.chatId}`));
                dispatch(setChattUrl());
                //window.location.replace(`/chat/${props.chatId}`)
            }} >
                <img className="contact-img" src={props.targetUser.avatar}></img>
                <div className='contact-info'>
                    <div className="contact-name">{props.targetUser.username}</div>
                    <div className="contact-lastmsg">
                        <p>{props.lastMessage.body}</p>
                        <time dateTime="20:00" className='contact-lastmsg_timestamp'>
                            {timestamp}
                        </time>
                    </div>
                </div>

            </div>
        )
}

export default Contact