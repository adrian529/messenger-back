import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
/* username, contacts, avatar, email, id */
export const authSlice = createSlice({
    name: 'auth',
    initialState: { id: null, username: null, contacts: null, avatar: null, email: null },
    reducers: {
        setCredentials: (state, action) => {
            const { id, username, contacts, avatar, email } = action.payload
            state.id = id
            state.username = username
            state.contacts = contacts
            state.avatar = avatar
            state.email = email
        },
        logOut: (state) => {
            state.id = null
            state.username = null
            state.contacts = null
            state.avatar = null
            state.email = null
        }
    }
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state: RootState) => state.authSlice
export const selectCurrentUserId = (state: RootState) => state.authSlice.id