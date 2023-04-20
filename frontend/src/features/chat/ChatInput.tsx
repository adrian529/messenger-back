import React from 'react'
import { useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import Send from '@mui/icons-material/Send';
import { useSendMessageMutation } from './chatApiSlice';

const ChatInput = () => {

    interface Message {
        id: String;
        userId: String;
        body: String;
    }

    const [message, setMessage] = useState('')
    const [sendMessage] = useSendMessageMutation({ id: String, userId: String, body: String })

    const handleSendMessage = (e): void => {
        e.preventDefault()
        setMessage('')
        const newMessage: Message = {
            id: '643b1ea6501c12d1db85dea9',
            userId: 'xd',
            body: message
        }
        sendMessage(newMessage)
            .then(res => console.log(res))
    }

    return (
        <form className='chat-input' onSubmit={handleSendMessage}>
            <TextareaAutosize className="chat-input_textarea" maxRows={9} value={message} onChange={(e) => setMessage(e.target.value)}>
            </TextareaAutosize>
            <button className='chat-input_btn' type="submit"><Send /></button>
        </form>
    )
}

export default ChatInput