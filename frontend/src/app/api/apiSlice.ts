import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
    tagTypes: ['User', 'Chat'],
    endpoints: (builder) => ({
        getMessages: builder.query<string, string>({
            query: (chatId) => `chat/${chatId}`,
        }),
    }),
})
export const { useGetMessagesQuery } = apiSlice

