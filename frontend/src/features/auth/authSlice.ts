import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"

/* username, contacts, avatar, email, id */
export const authSlice = createSlice({
    name: 'auth',
    initialState: { id: null, username: null, contacts: null, avatar: null, email: null, contactRequests: null, url: '' },
    reducers: {
        setCredentials: (state, action) => {
            const { id, username, contacts, avatar, email, contactRequests } = action.payload
            state.id = id
            state.username = username
            state.contacts = contacts
            state.avatar = avatar
            state.email = email
            state.contactRequests = contactRequests
        },
        logOut: (state) => {
            state.id = null
            state.username = null
            state.contacts = null
            state.avatar = null
            state.email = null
            state.contactRequests = null

        },
        addNewContact: (state: RootState, action) => {
            const { id } = action.payload
            state.contactRequests = state.contactRequests.filter(req => req !== id)
            state.contacts.push(id)
        },
        rejectContact: (state, action) => {
            const { id } = action.payload
            state.contactRequests = state.contactRequests.filter(req !== id)
        },
        setChattUrl: (state) => {
            state.url = document.location.href
        }
    }
})

export const { setCredentials, logOut, addNewContact, rejectContact, setChattUrl } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state: RootState) => state.authSlice
export const selectCurrentUserId = (state: RootState) => state.authSlice.id
export const selectCurrentUserRequests = (state: RootState) => state.authSlice.contactRequests
export const selectChatUrl = (state: RootState) => state.authSlice.url;
