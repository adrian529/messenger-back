import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type headerProps = {
    avatar: string;
    username: string;
}
const ChatHeader = (props: headerProps
    ) => {
    return (
        <div className="chat-header">
            <a href="/" className="mobile" style={{'fontSize': 0}}><ArrowBackIcon/></a>
            <img className="contact-img header-img" src={props.avatar} alt="profile picture"
             onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = "https://i.ytimg.com/vi/VqWmSoWvQqo/mqdefault.jpg";
            }}
            />
            <h3 className="chat-header_name">
                {props.username}
            </h3>
        </div>
    )
}

export default ChatHeader