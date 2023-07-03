import { useEffect, useState, useRef } from "react";
import Message from "./Message";
import { useGetChatMutation } from "./chatApiSlice";
import { selectCurrentUser } from "../auth/authSlice";
import { useAppSelector } from "../../app/hooks";
import { useParams } from "react-router-dom";
import { pusherClient } from "../../app/pusherClient";
import { selectChatUrl } from "../auth/authSlice";
import ChatInput from "./ChatInput";
import { useLocation } from "react-router-dom";
import ChatHeader from "./ChatHeader"
import { useAppDispatch } from "../../app/hooks";
import { setChattUrl } from "../auth/authSlice";
import { Loading } from "../../assets/Loading";
import { useGetContactsQuery } from "../chat/chatApiSlice"

const Chat = () => {
    interface Message {
        userId: string;
        body: string;
        timestamp: string;
    }
    const chatRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = (behavior) => {
        const element = document.getElementById('chuj');
        if (!element) {
            return
        }

        let chatHeight = element.scrollHeight

        element.scrollTo({
            top: chatHeight,
            behavior,
        });
    }
    const dispatch = useAppDispatch()
    const pusher = pusherClient
    const { chatId } = useParams()
    const [messages, setMessages] = useState([])
    const [contact, setContact] = useState({})
    const [getChat, {
        isLoading,
        error
    }] = useGetChatMutation({ id: String })

    let chatUrl = useAppSelector(selectChatUrl)
    if(!chatUrl){
        dispatch(setChattUrl())
    }
    let currentUrl = chatUrl ? chatUrl.split('/').pop() : chatId

    
    const {
        refetch 
    } = useGetContactsQuery()

    const getData = async () => {
        await getChat(currentUrl as string)
            .then(res => {
                setMessages(res.data.chat.messages)
                setContact(res.data.user)
            }
            ).catch((e) => {
                console.log(e)
            })
    }

    useEffect(() => {
        scrollToBottom('smooth')
    }, [messages])

    useEffect(() => {
        setMessages([])
        if (currentUrl) {
            pusher.signin()
            let channel = pusher.subscribe(currentUrl) // channel = chat ID
            channel.unbind()
            channel.bind('new-message', async (data: any) => {
                //callback
                refetch()
                setMessages((prev) => [...prev, data.newMessage])
            })
            pusher.bind('new-channel', async (data: any) => {
                //callback
                console.log(data)
            })
        }
        getData()
        scrollToBottom('instant')
    }, [chatUrl])

    if (currentUrl === '' || null || undefined) {
        return null
    } else if(isLoading) {
        return <Loading />
    } else {
        return (
            <div className="chat-area">
                <ChatHeader username={contact.username} avatar={contact.avatar}/>
                <div className="chat" id="chat" ref={chatRef}>
                    <ul id="chuj">
                        <li id='top'></li>
                        {messages.map((message: Message, index) => {
                            return (
                                <Message userId={message.userId} timestamp={message.timestamp} body={message.body} key={index} id={`${index}`} />
                            )
                        })
                        }
                        <li id='bottom'></li>
                    </ul>
                </div>
                <ChatInput chatId={currentUrl} />
            </div>
        )
    }
}

export default Chat
