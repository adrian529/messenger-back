import { apiSlice } from "../../app/api/apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        getUser: builder.mutation({
            query: (id: String) => ({
                url: `/user/${id}`,
                method: 'GET',
                credentials: 'include'
            }),
        }),

    })
})

export const {
    useGetUserMutation
} = userApiSlice