import React from 'react'
import { useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import Send from '@mui/icons-material/Send';
import { useSendMessageMutation } from './chatApiSlice';
import { selectCurrentUserId } from "../auth/authSlice"
import { useParams } from 'react-router-dom';
import { useAppSelector } from "../../app/hooks"
import { TableBody } from '@mui/material';


const ChatInput = (props: any) => {

    interface Message {
        id: string;
        userId: string;
        body: string;
    }
    const currentUserId = useAppSelector(state => selectCurrentUserId(state))
    const chatId = props.chatId

    const [message, setMessage] = useState('')
    const [sendMessage] = useSendMessageMutation()

    const handleSendMessage = (e): void => {
        e.preventDefault()
        if (message.trim() !== '') {
            setMessage('')
            const newMessage: Message = {
                id: chatId,
                userId: currentUserId,
                body: message
            }
            sendMessage(newMessage)
                .then(res => console.log(res))
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage(e)
        }
    }

    return (
        <form className='chat-input' onSubmit={handleSendMessage}>
            <TextareaAutosize className="chat-input_textarea" maxRows={9} value={message} onKeyDown={handleKeyPress}
                onChange={(e) => setMessage(e.target.value)} />
            <button className='chat-input_btn' type="submit"><Send /></button>
        </form>
    )
}

export default ChatInput