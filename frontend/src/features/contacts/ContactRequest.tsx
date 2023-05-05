import { useAppDispatch } from "../../app/hooks"
import { useGetUserMutation } from "../user/userApiSlice"
import { useContactRequestResponseMutation } from "../user/userApiSlice"
import { useEffect } from "react"
import { useState } from "react"
import Done from '@mui/icons-material/Done';
import Close from '@mui/icons-material/Close';

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
    if (user) {
        return (
            <div>
                <img src={user.avatar} className="contact-img" />
                {user.username}
                <Done onClick={(e) => handleResponse(e, true)} />
                <Close onClick={(e) => handleResponse(e, false)} />
            </div>
        )
    } else {
        return <div>

        </div>
    }

}

export default ContactRequest