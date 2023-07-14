import Close from '@mui/icons-material/Close';
import Done from '@mui/icons-material/Done';
import { useContactRequestResponseMutation, useGetUserQuery } from "../user/userApiSlice";
import { useGetUserInfoQuery } from '../auth/authApiSlice';
import { useAppDispatch } from '../../app/hooks';
import { setCredentials } from '../auth/authSlice';

type ContactProps = {
    contact: string;
}

const ContactRequest = (props: ContactProps) => {

    const dispatch = useAppDispatch()

    const {
        data: user,
        isLoading,
    } = useGetUserQuery(props.contact)

    const [contactReponse] = useContactRequestResponseMutation()

    const handleResponse = async (e: React.MouseEvent<SVGSVGElement, MouseEvent>, response: boolean) => {
        e.preventDefault()
        const id = user._id
        contactReponse({ id, response })
            .then((data: any) => {
                if (response === true) {
                    dispatch(setCredentials((state: any) => state.contactRequests.push(data.newChatId)))
                }
            })
    }
    if (isLoading) {
        return (<></>)
    } else {
        return (
            <div className="contact-request">
                <img src={user.avatar} className="contact-img" alt="profile picture"
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
}

export default ContactRequest