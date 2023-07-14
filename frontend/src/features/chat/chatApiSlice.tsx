import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface Message {
    id: string;
    userId: string;
    body: string;
    timestamp: number;
}
interface newMessage {
    id: string;
    userId: string;
    body: string;
}

interface IUser {
    avatar: string,
    username: string,
    _id: string
}

interface IChat {
        user: IUser,
        chat: {
            users: [string],
            messages: [
                Message
            ]
        }
}
interface IContact {
    contactsList: [
        {
            chatId: string,
            id: string,
            targetUser: IUser,
            lastMessage: Message
        }
    ]
}

export const chatApi = createApi({
    reducerPath: 'chatApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
    tagTypes: ['Chat'],

    endpoints: (builder) => ({
        getChat: builder.mutation<IChat, string>({
            query: (id: string) => ({
                url: `chat/${id}`,
                credentials: 'include'
            }),
        }),
        getContacts: builder.query<any, void>({
            query: () => ({
                url: `chat/contacts`,
                credentials: 'include'
            }),
            providesTags: ['Chat'],
            transformResponse: (responseData: IContact) => {
                let res = responseData.contactsList
                const loadedContacts = res.map(contact => {
                    contact.id = contact.chatId
                    return contact
                });
                let sortedResponse = loadedContacts.sort((a, b) => b.lastMessage?.timestamp - a.lastMessage?.timestamp)
                return sortedResponse
            }
        }),

        sendMessage: builder.mutation<void, newMessage>({
            query: ({ id, userId, body }) => ({
                url: `chat/${id}`,
                method: 'POST',
                credentials: 'include',
                body: { userId, body },
            }),
            invalidatesTags: ['Chat']
        }),
        createChat: builder.mutation({
            query: ({ userIds, chatAdminId, chatName }) => ({
                url: '/chat/new',
                method: 'POST',
                body: {
                    userIds,
                    chatAdminId,
                    chatName
                }
            }),
            invalidatesTags: [
                { type: 'Chat', id: "LIST" }
            ]
        }),
    }),
})

export const { useGetChatMutation, useSendMessageMutation, useCreateChatMutation, useGetContactsQuery } = chatApi
