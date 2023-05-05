import React from 'react'
import { useAddContactMutation } from './userApiSlice'
import { useState } from 'react'

const AddContact = () => {

    const [addContact] = useAddContactMutation()

    const [id, setId] = useState('')

    const handleSubmit = async (targetId: string, event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        await addContact(targetId)
        setId('')
    }

    return (
        <div>
            <form onSubmit={(event) => handleSubmit(id, event)} className="contact-add">
                <input type='text' className='contact-add_input' placeholder='Add new contact by ID' onChange={(e) => { setId(e.target.value) }} value={id}></input>
            </form>
        </div>
    )
}

export default AddContact