import { apiSlice } from "../../app/api/apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        getUser: builder.query({
            query: (id: string) => ({
                url: `/user/${id}`,
                method: 'GET',
                credentials: 'include',
                withCredentials: true,
            }),
        }),

        addContact: builder.mutation({
            query: (id: string) => ({
                url: `/user/${id}`,
                method: 'POST',
                credentials: 'include',
                withCredentials: true,
            }),
            invalidatesTags: ['User'],
        }),
        contactRequestResponse: builder.mutation<{ newChatId: string }, { id: string, response: boolean }>({
            query: ({ id, response }) => ({
                url: `/user/contact`,
                body: {
                    id, response
                },
                method: 'POST',
                credentials: 'include',
                withCredentials: true,
            }),
            invalidatesTags: ['User'],
        }),
    })
})

export const {
    useGetUserQuery,
    useAddContactMutation,
    useContactRequestResponseMutation
} = userApiSlice
