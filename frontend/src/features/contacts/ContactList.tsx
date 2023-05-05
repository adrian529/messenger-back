import Contact from "./Contact"
import { selectCurrentUser } from "../auth/authSlice"
import { useAppSelector } from "../../app/hooks"
import { pusherClient } from "../../app/pusherClient"
import { useEffect } from "react"
import AddContact from "../user/AddContact"
import ContactRequest from "./ContactRequest"
const ContactList = () => {

    const currentUser = useAppSelector(state => selectCurrentUser(state))
    const chats: string[] | null = currentUser.contacts
    const contactRequests: string[] | null = currentUser.contactRequests
    const pusher = pusherClient

    useEffect(() => {
        console.log(currentUser)
        if (chats) {
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
                console.log(data)
            })
        } else {
            return
        }
    }, [chats])

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
                <div className="">
                    {
                        contactRequests.map((contact, index) => (
                            <ContactRequest contact={contact} key={index} />
                        ))
                    }
                </div>
                <AddContact />
            </div>
        )

    }
}

export default ContactList