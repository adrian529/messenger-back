/*
for testing 
{
    "userIds": ["643b1db386a2e9654bfa3d77","643b1d930e5059fc7a067b86","644071eaff92bd61194f48f8"],
    "chatAdminId": "644071eaff92bd61194f48f8",
    "chatName": "name"
}
*/

import React from 'react'
import { useCreateChatMutation } from './chatApiSlice'
import { useState } from 'react'
import { useEffect } from 'react'
import { selectCurrentUserId } from '../auth/authSlice'
import { useAppSelector } from '../../app/hooks'

const NewChat = () => {

    const [createChat] = useCreateChatMutation()

    const [chatName, setChatName] = useState('')

    const currentUserId = useAppSelector(state => selectCurrentUserId(state))

    const onChatNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => setChatName(e.target.value)
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await createChat({ userIds: ["643b1db386a2e9654bfa3d77", "643b1d930e5059fc7a067b86", "644071eaff92bd61194f48f8"], chatAdminId: currentUserId, chatName })
            .then(res => console.log(res))
    }

    return (
        <div>
            <form onSubmit={(e) => handleSubmit(e)}>
                <input onChange={(e) => onChatNameChanged(e)}>

                </input>
                <button type="submit">subaaaaaaaaamit</button>
            </form>
        </div>
    )
}

export default NewChat