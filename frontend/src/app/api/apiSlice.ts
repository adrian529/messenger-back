import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/' }),
    tagTypes: ['User', 'Chat'],
    endpoints: (builder) => ({
        getMessages: builder.query<string, string>({
            query: (chatId) => `chat/${chatId}`,
        }),
    }),
})
export const { useGetMessagesQuery } = apiSlice

