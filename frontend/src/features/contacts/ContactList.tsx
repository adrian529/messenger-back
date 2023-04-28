import Contact from "./Contact"
import { selectCurrentUser } from "../auth/authSlice"
import { useAppSelector } from "../../app/hooks"
import { pusherClient } from "../../app/pusherClient"
import { useEffect } from "react"
const ContactList = () => {

    const currentUser = useAppSelector(state => selectCurrentUser(state))
    const chats: string[] = currentUser.contacts

    const pusher = pusherClient

    useEffect(() => {
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
        }
    }, [chats])

    if (chats) {
        return (
            <div className="contact-list">
                {
                    chats.map((chat, index) => (
                        <Contact chatName={chat} chatId={chat} key={index} />
                    ))
                }
            </div>
        )
    }

}

export default ContactList