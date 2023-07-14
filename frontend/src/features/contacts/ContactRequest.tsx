import { useAppDispatch } from "../../app/hooks"
import { useGetUserQuery } from "../user/userApiSlice"
import { useContactRequestResponseMutation } from "../user/userApiSlice"
import Done from '@mui/icons-material/Done';
import Close from '@mui/icons-material/Close';
type ContactProps = {
    contact: string;
}

const ContactRequest = (props: ContactProps) => {

    const {
        data: user,
        isFetching,
        isLoading,
    } = useGetUserQuery(props.contact)

    const [contactReponse] = useContactRequestResponseMutation()

    const handleResponse = async (e: React.MouseEvent<SVGSVGElement, MouseEvent>, response: boolean) => {
        e.preventDefault()
        const id = user._id
        contactReponse({ id, response })
            .then(res => console.log('res', res))
    }
    if (isLoading) {
        return (<>loading</>)
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