import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { IUser, Message } from '../../../../index'
import { useAppSelector } from "../../app/hooks"
import { pusherClient } from "../../app/pusherClient"
import { useGetUserInfoQuery, useSendLogoutMutation } from "../auth/authApiSlice"
import { selectChatUrl, selectCurrentUser } from "../auth/authSlice"
import { useGetContactsQuery } from "../chat/chatApiSlice"
import AddContact from "../user/AddContact"
import Contact from "./Contact"
import ContactRequest from "./ContactRequest"
interface Icontact {
    chatId: string,
    id: string,
    lastMessage: Message,
    targetUser: IUser
}

const ContactList = () => {

    const currentUser = useAppSelector(state => selectCurrentUser(state))
    const chats: string[] = currentUser.contacts
    const contactRequests: string[] = currentUser.contactRequests
    const pusher = pusherClient
    const navigate = useNavigate()
    const [requests, setRequests] = useState([])
    const [active, setActive] = useState(false)

    let chatUrl = useAppSelector(selectChatUrl)
    let currentUrl = chatUrl ? chatUrl.split('/').pop() : null

    const [logout] = useSendLogoutMutation()

    const handleLogout = () => {
        logout()
        navigate('/auth')
    }
    const { refetch: refetchCurrentUser } = useGetUserInfoQuery()

    const {
        data: contacts,
        isLoading,
        refetch
    } = useGetContactsQuery()

    useEffect(() => {
        try {
            if (chats && currentUser) {
                setRequests(currentUser.contactRequests!)
                let channels = chats.map(channelName => pusher.subscribe(channelName));

                for (let channel of channels) {
                    channel.bind('new-message', async () => {
                        //callback
                        refetch()
                    })
                }
                pusher.bind('new-channel', async () => {
                    //callback
                    refetch()
                })
            }
        } catch (e) {
            console.log(contactRequests)
        }
    }, [chats, requests, currentUser])

    useEffect(() => {
        pusher.signin()

        pusher.bind('contact-request', async () => {
            await refetchCurrentUser()
        })
    }, [])

    let menuActive = active ? 'menu-active' : 'menu-notActive'

    let contactsList: Icontact[] = []


    const RequestsList = requests.length !== 0 ? (
        <>
            <div className="contact-requests">
                {
                    requests.map((contact, index) => (
                        <ContactRequest contact={contact} key={index} />
                    ))
                }
            </div>
        </>
    )
        : null

    if (contacts) {
        Object.values(contacts as Icontact[]).forEach(function (chat: Icontact, index) {
            contactsList.push(chat)
        })
    }

    const isActiveMobile = (chatUrl === null || chatUrl === '' || chatUrl === 'http://localhost:4173/') ? 'sidebar-active' : null
    if (!isLoading) {
        return (
            <div className={`sidebar ${isActiveMobile}`}>
                <div className="current-user-card">
                    <div className="current-user-left">
                        <img className="contact-img" alt="profile picture" src={currentUser.avatar || "https://i.ytimg.com/vi/VqWmSoWvQqo/mqdefault.jpg"}></img>
                        <div className="contact-name">{currentUser.username}</div>
                    </div>
                    <button className={`open-menu-button`} onClick={() => setActive(prev => !prev)}><ExpandMoreIcon className={menuActive} /></button>
                </div>
                <div className={menuActive}>
                    <ul className="menu">
                        <li>
                            <button className="menu-button" onClick={handleLogout}>Log Out</button>
                        </li>
                    </ul>
                </div>
                <div className="contact-list">
                    {
                        contactsList.map((chat, index) => {
                            if (chat.chatId === currentUrl) {
                                return <Contact chatId={chat.chatId} lastMessage={chat.lastMessage} targetUser={chat.targetUser} key={index} activeContact={true} />
                            } else {
                                return <Contact chatId={chat.chatId} lastMessage={chat.lastMessage} targetUser={chat.targetUser} key={index} />
                            }
                        })
                    }
                </div>
                {RequestsList}
                <AddContact />
            </div>
        )
    } else {
        return (<></>)
    }
}

export default ContactList