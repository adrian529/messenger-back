import { useNavigate } from "react-router-dom"
import { setChattUrl } from "../counter/counterSlice"
import { useAppSelector } from "../../app/hooks"
import { useAppDispatch } from "../../app/hooks"

type ContactProps = {
    chatName: string;
    chatId: string
}

const Contact = (props: ContactProps) => {

    const dispatch = useAppDispatch()
    return (
        <div className="contact"

            onClick={() => {
                window.history.pushState({}, "", (`/chat/${props.chatId}`));
                dispatch(setChattUrl());
                //window.location.replace(`/chat/${props.chatId}`)
            }} >
            <img className="contact-img" src="/src/340987372_196446673142667_804629794630719344_n.jpg"></img>
            <div className='contact-info'>
                <div className="contact-name">{props.chatName}</div>
                <div className="contact-lastmsg">
                    <p>bly bly bly bly bly bly bly bly bly bly bly </p>
                    <time dateTime="20:00" className='contact-lastmsg_timestamp'>
                        12:52
                    </time>
                </div>
            </div>
        </div>
    )
}

export default Contact