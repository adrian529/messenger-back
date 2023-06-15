import { useEffect, useState } from "react";
import Message from "./Message";
import { useGetChatMutation } from "./chatApiSlice";
import { selectCurrentUser } from "../auth/authSlice";
import { useAppSelector } from "../../app/hooks";
import { useParams } from "react-router-dom";
import { pusherClient } from "../../app/pusherClient";
import { selectChatUrl } from "../counter/counterSlice";
import ChatInput from "./ChatInput";

/* 
import useFeed from "../../hooks/useFeed"

const Feed = () => {
    const email = useSelector(selectCurrentUser)

    const [page, setPage] = useState(Number(sessionStorage.getItem("feedPage")) || 0)
    const {
        postsIsLoading,
        postsIsError,
        postsError,
        postsResults,
        postsHasNextPage,
    } = useFeed(email, page)

    const intObserver = useRef()

    const lastPostRef = useCallback(post => {
        if (postsIsLoading) return
        if (intObserver.current) intObserver.current.disconnect()
        intObserver.current = new IntersectionObserver(posts => {
            if (posts[0].isIntersecting && postsHasNextPage) {
                setPage(prev => prev + 1)
                const pageNum = page + 1
                sessionStorage.setItem("feedPage", pageNum);
            }
        })
        if (post) intObserver.current.observe(post)
    }, [postsIsLoading, postsHasNextPage])

*/

const Chat = () => {
    interface Message {
        userId: string;
        body: string;
        timestamp: string;
    }
    const scrollToBottom = (id: string) => {
        const element = document.getElementById(id);
        if (!element) {
            return
        }
        element.scrollIntoView({ behavior: "smooth" });
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

    let chatUrl = useAppSelector(selectChatUrl)
    let currentUrl = chatUrl ? chatUrl.split('/').pop() : chatId

    const getData = async () => {
        await getChat(currentUrl as string)
            .then(res => setMessages(res.data.messages)
            ).catch((e) => {
                console.log(e)
            })
    }

    useEffect(() => {
        scrollToBottom("bottom")
    }, [chatUrl])

    useEffect(() => {
        if (currentUrl) {
            pusher.signin()
            let channel = pusher.subscribe(currentUrl) // channel = chat ID
            channel.bind('new-message', async (data: any) => {
                //callback
                setMessages((prev => [...prev, data.newMessage]))
                scrollToBottom("bottom")
                console.log(messages)
            })
            pusher.bind('new-channel', async (data: any) => {
                //callback
                console.log(data)
            })
        }
        getData()
        scrollToBottom("bottom")
    }, [chatUrl])

    return (
        <>
            <div className="chat" id="chat">
                <ul id="chuj">
                    <li id='top'></li>
                    {/*  {
                    messages.map((message: Message, index) =>{
                        if(messages.length-1 === index){
                        return (
                            <Message userId={message.userId} timestamp={message.timestamp} body={message.body} key={index} id="xd"/>
                        )
                    } else  return (
                        <Message userId={message.userId} timestamp={message.timestamp} body={message.body} key={index} id={`${index}`}/>
                    )
                        
                    })
                } */}
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
        </>
    )

    /* 
      return (
        <div className="feed">
            {content}
            {postsIsLoading && <p>Loading...</p>}
        </div>
    )
    */
}

export default Chat
