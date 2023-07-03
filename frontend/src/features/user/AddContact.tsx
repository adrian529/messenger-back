import React from 'react'
import { useAddContactMutation } from './userApiSlice'
import { useState, useRef } from 'react'
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const AddContact = () => {

    const [addContact] = useAddContactMutation()
    const ref = useRef(null);
    const [id, setId] = useState('')
    const [visible, setVisible] = useState(false)

    const handleSubmit = async (targetId: string, e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await addContact(targetId)
        setId('')
    }

    const gowno = async (e)=>{
        e.preventDefault();
        setVisible(!visible)
        ref.current.focus();
    }

    return (
        <div className="contact-add">
            <button className='contact-add_btn' title="Click to add a new contact" onClick={(e)=>gowno(e)}><PersonAddIcon /></button>
            <form onSubmit={(event) => handleSubmit(id, event)} className="contact-add_form">
                <input type='text' className='contact-add_input' ref={ref}  placeholder={'Add a new contact by ID'} onChange={(e) => { setId(e.target.value) }} value={id}></input>
            </form>

        </div>
    )
}

export default AddContact