import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IContact, IChat } from '../../../..';

interface newMessage {
    id: string;
    userId: string;
    body: string;
}

interface IContactList {
    contactsList: IContact[]
}

export const chatApi = createApi({
    reducerPath: 'chatApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
    tagTypes: ['Chat'],

    endpoints: (builder) => ({
        getChat: builder.mutation<IChat, string>({
            query: (id: string) => ({
                url: `chat/${id}`,
                credentials: 'include',
                withCredentials: true,
            }),
        }),
        getContacts: builder.query<any, void>({
            query: () => ({
                url: `chat/contacts`,
                credentials: 'include',
                withCredentials: true,
            }),
            providesTags: ['Chat'],
            transformResponse: (responseData: IContactList) => {
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
                withCredentials: true,
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
