import { apiSlice } from "../../app/api/apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        getUser: builder.mutation({
            query: (id: string) => ({
                url: `/user/${id}`,
                method: 'GET',
                credentials: 'include'
            }),
            providesTags: ['User'] as any,
        }),
        addContact: builder.mutation({
            query: (id: string) => ({
                url: `/user/${id}`,
                method: 'POST',
                credentials: 'include'
            })
        }),
        contactRequestResponse: builder.mutation({
            query: ({ id, response }) => ({
                url: `/user/contact`,
                body: {
                    id, response
                },
                method: 'POST',
                credentials: 'include',
                invalidatesTags: ['User']
            }),
            invalidatesTags: ['User']

        }),
    })
})

export const {
    useGetUserMutation,
    useAddContactMutation,
    useContactRequestResponseMutation
} = userApiSlice