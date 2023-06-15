import { useAppDispatch } from "../../app/hooks"
import { useGetUserMutation } from "../user/userApiSlice"
import { useContactRequestResponseMutation } from "../user/userApiSlice"
import { useEffect } from "react"
import { useState } from "react"
import Done from '@mui/icons-material/Done';
import Close from '@mui/icons-material/Close';
import { useAppSelector } from "../../app/hooks"
import { addContact } from "../auth/authSlice"
type ContactProps = {
    contact: string;
}

interface IUser {
    username: string;
    avatar: string;
    _id: string;
    contacts: string[];
    email: string;
    contactRequests: string[]
}

const ContactRequest = (props: ContactProps) => {

    const dispatch = useAppDispatch()

    const [user, setUser] = useState<IUser>({})

    const [getUser] = useGetUserMutation()
    const [contactReponse] = useContactRequestResponseMutation()
    useEffect(() => {

        //get user data 
        (async () => {
            getUser(props.contact)
                .then(res =>
                    setUser(res.data)
                )
        })()
    }, [getUser])

    const handleResponse = async (e: any, response: boolean) => {
        e.preventDefault()
        const id = user._id
        contactReponse({ id, response })
            .then(res => console.log('res', res))
    }
    return (
        <div className="contact-request">
            <img src={user.avatar} className="contact-img"
                onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = "https://i.ytimg.com/vi/VqWmSoWvQqo/mqdefault.jpg";
                }}
            />

            <div className="contact-request_text">
                {user.username}
                <span className="contact-request_buttons">
                    <Close role="button" className="contact-request_btn contact-request_decline" onClick={(e) => handleResponse(e, false)} />
                    <Done role="button" className="contact-request_btn contact-request_accept" onClick={(e) => handleResponse(e, true)} />
                </span>
            </div>
        </div>
    )
}

export default ContactRequest