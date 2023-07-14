import { apiSlice } from "../../app/api/apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        getUser: builder.query({
            query: (id: string) => ({
                url: `/user/${id}`,
                method: 'GET',
                credentials: 'include',
            }),
        }),
        
        addContact: builder.mutation({
            query: (id: string) => ({
                url: `/user/${id}`,
                method: 'POST',
                credentials: 'include'
            }),
            invalidatesTags: ['User'],
        }),
        contactRequestResponse: builder.mutation({
            query: ({ id, response }) => ({
                url: `/user/contact`,
                body: {
                    id, response
                },
                method: 'POST',
                credentials: 'include',
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