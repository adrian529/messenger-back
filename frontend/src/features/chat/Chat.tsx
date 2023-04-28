import { useEffect, useState } from "react";
import Message from "./Message";
import { useGetChatMutation } from "./chatApiSlice";
import { selectCurrentUser } from "../auth/authSlice";
import { useAppSelector } from "../../app/hooks";
import { useParams } from "react-router-dom";
import { pusherClient } from "../../app/pusherClient";
import { selectChatUrl } from "../counter/counterSlice";
import ChatInput from "./ChatInput";

const Chat = () => {
    interface Message {
        userId: string;
        body: string;
        timestamp: string;
    }
    const pusher = pusherClient

    const { chatId } = useParams()

    const [newMessage, setNewMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [getChat, {
        isLoading,
        error
    }] = useGetChatMutation({ id: String })

    const [contactUrl, setContactUrl] = useState('')

    let xd = useAppSelector(selectChatUrl)
    let currentUrl = xd ? xd.split('/').pop() : chatId

    useEffect(() => {
        console.log('current url: ', currentUrl)
        const getData = async () => {
            await getChat(currentUrl as string)
                .then(res => setMessages(res.data.messages)
                ).catch((e) => {
                    console.log(e)
                })
        }
        getData()
    }, [newMessage, xd])

    useEffect(() => {
        if (currentUrl) {
            pusher.signin()

            let channel = pusher.subscribe(currentUrl) // channel = chat ID

            channel.bind('new-message', async (data: any) => {
                //callback
                setNewMessage(data)
            })
            pusher.bind('new-channel', async (data: any) => {
                //callback
                console.log(data)
            })
        }
    }, [currentUrl])

    return (
        <>
            <div className="chat">
                {
                    messages.map((message: Message, index) => (
                        <Message userId={message.userId} timestamp={message.timestamp} body={message.body} key={index} />
                    ))
                }
            </div>
            <ChatInput chatId={currentUrl} />
        </>
    )
}

export default Chat
