import { useEffect, useState } from "react";
import Pusher from 'pusher-js';
import Message from "./Message";
import { useGetChatMutation } from "./chatApiSlice";

const Chat = () => {

    interface Message {
        userId: string;
        body: string;
        timestamp: string;
    }

    const [newMessage, setNewMessage] = useState('')
    const [messages, setMessages] = useState([])

    const [getChat] = useGetChatMutation({ id: String })

    useEffect(() => {
        const getData = async () => {
            await getChat('643b1ea6501c12d1db85dea9')
                .then(res => setMessages(res.data.messages)
                )
        }
        getData()
    }, [newMessage])

    useEffect(() => {
        const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
            cluster: import.meta.env.VITE_PUSHER_CLUSTER,
        })
        let channel = pusher.subscribe('643b1ea6501c12d1db85dea9') // channel = chat ID

        channel.bind('new-message', async (data: Message) => {
            //callback
            setNewMessage(data)
        })
    }, [])

    return (
        <div className="chat">
            {
                messages.map(message => (
                    <Message userId={message.userId} timestamp={message.timestamp} body={message.body} key={message.timestamp}/>
                ))
            }
        </div>
    )
}

export default Chat