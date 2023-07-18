import Close from '@mui/icons-material/Close';
import Done from '@mui/icons-material/Done';
import { useAppDispatch } from '../../app/hooks';
import { useContactRequestResponseMutation, useGetUserQuery } from "../user/userApiSlice";
import { pushNewContact } from '../auth/authSlice';
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
import { Loading } from '../../assets/Loading';
type ContactProps = {
    contact: string;
}

const ContactRequest = (props: ContactProps) => {

    const dispatch = useAppDispatch()
    const {
        data: user,
        isLoading,
    } = useGetUserQuery(props.contact)

    const [contactReponse, { isLoading: contactIsLoading }] = useContactRequestResponseMutation()
    const isContactReponseType = (data: { data: { newChatId: string; } } | { error: FetchBaseQueryError | SerializedError; }): data is { data: { newChatId: string } } => 'data' in data

    const handleResponse = async (e: React.MouseEvent<SVGSVGElement, MouseEvent>, response: boolean) => {
        e.preventDefault()
        const id = user._id
        contactReponse({ id, response })
            .then((data) => {

                if (response === true && isContactReponseType(data)) {
                    const { newChatId } = data.data
                    dispatch(() => pushNewContact(newChatId))
                    console.log(data)
                }
            })
    }
    if (contactIsLoading || isLoading) {
        return (<Loading />)
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
                    <span>{user.username}</span>
                    <span className="contact-request_buttons">
                        <button className="contact-request_btn contact-request_decline" name="decline contact request">
                            <Close role="button" onClick={(e) => handleResponse(e, false)} />
                        </button>
                        <button className="contact-request_btn contact-request_accept" name="accept contact request">
                            <Done role="button" onClick={(e) => handleResponse(e, true)} />
                        </button>
                    </span>
                </div>
            </div>
        )
    }
}

export default ContactRequest