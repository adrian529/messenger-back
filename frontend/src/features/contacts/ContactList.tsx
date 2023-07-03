import Contact from "./Contact"
import { selectCurrentUser } from "../auth/authSlice"
import { useAppSelector } from "../../app/hooks"
import { pusherClient } from "../../app/pusherClient"
import { useEffect, useState } from "react"
import AddContact from "../user/AddContact"
import ContactRequest from "./ContactRequest"
import { selectChatUrl } from "../auth/authSlice"
import { useGetContactsQuery } from "../chat/chatApiSlice"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Loading } from "../../assets/Loading"
import { useAppDispatch } from "../../app/hooks"
import { useSendLogoutMutation } from "../auth/authApiSlice"
import { useNavigate } from "react-router-dom"

const ContactList = () => {

    const currentUser = useAppSelector(state => selectCurrentUser(state))
    const chats: string[] | null = currentUser.contacts
    const contactRequests: string[] | null = currentUser.contactRequests
    const pusher = pusherClient
    const dispatch = useAppDispatch()
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

    const {
        data: contacts,
        isLoading,
        refetch
    } = useGetContactsQuery()

    useEffect(() => {
        try {
            if (chats) {
                setRequests(currentUser.contactRequests)
                let channels = chats.map(channelName => pusher.subscribe(channelName));
                //pusher.signin()

                for (let channel of channels) {
                    channel.bind('new-message', async (data: any) => {
                        //callback
                        console.log('xd newmsg', data)
                        refetch()
                    })
                }
                pusher.bind('new-channel', async (data: any) => {
                    //callback
                })
            } else {
                return
            }
        } catch (e) {
            console.log(contactRequests)
        }
    }, [chats, requests, currentUser])


    let menuActive = active ? 'menu-active' : 'menu-notActive'

    let gowno = []


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
        Object.values(contacts).forEach(function (chat, index) {
            gowno.push(chat)
        })
    }
    let chuj = isLoading ? (<Loading />) : (
        <div className="contact-list">
            {
                gowno.map((chat, index) => {
                    if (chat.chatId === currentUrl) {
                        return <Contact chatId={chat.chatId} lastMessage={chat.lastMessage} targetUser={chat.targetUser} key={index} activeContact={true} />
                    } else {
                        return <Contact chatId={chat.chatId} lastMessage={chat.lastMessage} targetUser={chat.targetUser} key={index} />
                    }
                })
            }
        </div>
    )

    const isActiveMobile = (chatUrl === null || chatUrl === '' || chatUrl === 'http://localhost:5173/') ? 'sidebar-active' : null
    if (contacts) {
        return (
            <div className={`sidebar ${isActiveMobile}`}>
                <div className="current-user-card">
                    <div className="current-user-left">
                        <img className="contact-img" src={currentUser.avatar}></img>
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
                {chuj}
                {RequestsList}
                <AddContact />
            </div>
        )
    }
}

export default ContactList