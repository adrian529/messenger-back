import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


interface Message {
    id: String;
    userId: String;
    body: String;
}

// Define a service using a base URL and expected endpoints
export const chatApi = createApi({
    reducerPath: 'chatApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
    tagTypes: ['Chat'],
    endpoints: (builder) => ({
        getChat: builder.mutation<any, String>({
            query: (id: String) => ({
                url: `chat/${id}`
            }),
            providesTags: ['Chat'] as any,
        }),
        sendMessage: builder.mutation<Message, Message>({
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

export const { useGetChatMutation, useSendMessageMutation, useCreateChatMutation } = chatApi
