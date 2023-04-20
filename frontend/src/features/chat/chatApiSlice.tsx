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
        getChat: builder.mutation<Array<String> | Object, String>({
            query: (id) => `chat/${id}`,
        }),
        sendMessage: builder.mutation<Message, Message>({
            query: ({ id, userId, body }) => ({
                url: `chat/${id}`,
                method: 'POST',
                credentials: 'include',
                body: { userId, body },
            }),
        }),
    }),
})

export const { useGetChatMutation, useSendMessageMutation } = chatApi
