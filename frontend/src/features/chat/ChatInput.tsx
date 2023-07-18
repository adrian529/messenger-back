import Send from '@mui/icons-material/Send';
import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useAppSelector } from "../../app/hooks";
import { selectCurrentUserId } from "../auth/authSlice";
import { useSendMessageMutation } from './chatApiSlice';


const ChatInput = (props: any) => {

    interface newMessage {
        id: string;
        userId: string;
        body: string;
    }

    const currentUserId = useAppSelector(state => selectCurrentUserId(state))
    const chatId = props.chatId

    const [message, setMessage] = useState('')
    const [sendMessage] = useSendMessageMutation()

    const handleSendMessage = (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
        e.preventDefault()
        if (message.trim() !== '') {
            setMessage('')
            const newMessage: newMessage = {
                id: chatId,
                userId: currentUserId,
                body: message
            }
            sendMessage(newMessage)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage(e)
        }
    }

    return (
        <form className='chat-input' onSubmit={handleSendMessage}>
            <label htmlFor="chat">Chat Input</label>
            <TextareaAutosize aria-label="chat" autoFocus className="chat-input_textarea" maxRows={9} value={message} onKeyDown={handleKeyPress}
                onChange={(e) => setMessage(e.target.value)} />
            <button className='chat-input_btn' aria-label="send message" type="submit"><Send /></button>
        </form>
    )
}

export default ChatInput