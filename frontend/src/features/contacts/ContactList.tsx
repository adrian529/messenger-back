import Contact from "./Contact"
import { selectCurrentUser } from "../auth/authSlice"
import { useAppSelector } from "../../app/hooks"
import { pusherClient } from "../../app/pusherClient"
import { useEffect, useState } from "react"
import AddContact from "../user/AddContact"
import ContactRequest from "./ContactRequest"

const ContactList = () => {

    const currentUser = useAppSelector(state => selectCurrentUser(state))
    const chats: string[] | null = currentUser.contacts
    const contactRequests: string[] | null = currentUser.contactRequests
    const pusher = pusherClient

    const [requests, setRequests] = useState([])


    useEffect(() => {
        try{
        if (chats) {
            setRequests(currentUser.contactRequests)
            let channels = chats.map(channelName => pusher.subscribe(channelName));
            //pusher.signin()

            for (let channel of channels) {
                channel.bind('new-message', async (data: any) => {
                    //callback
                    console.log(data)
                })
            }
            pusher.bind('new-channel', async (data: any) => {
                //callback
            })
        } else {
            return
        }} catch(e){
            console.log(contactRequests)
        }
    }, [chats, requests, currentUser])

    const requestsTitle = requests.length !== 0 ? (
    <div className="contact-requests">
        <p>Contact requests</p>
        {
            requests.map((contact, index) => (
                <ContactRequest contact={contact} key={index} />
            ))
        }
    </div>
) 
: null

    if (chats) {
        return (
            <div className="sidebar">
                <div className="contact-list">
                    {
                        chats.map((chat, index) => (
                            <Contact chatName={chat} chatId={chat} key={index} />
                        ))
                    }
                </div>
                    {requestsTitle}
                <AddContact />
            </div>
        )

    }
}

export default ContactList