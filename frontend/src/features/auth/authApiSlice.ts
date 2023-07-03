interface User {
    username: string;
    avatar: string;
    contacts: [string];
    _id: string;
    email: string
}

import { apiSlice } from "../../app/api/apiSlice";
import { setCredentials, logOut } from "./authSlice";
import { useAppDispatch } from "../../app/hooks";
export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/auth/login',
                method: 'POST',
                body: { ...credentials }
            })
        }),

        sendLogout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'GET',
                credentials: 'include',
                withCredentials: true,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                    dispatch(logOut())
                    dispatch(apiSlice.util.resetApiState())
                } catch (err) {
                    console.log(err)
                }
            }
        }),

        googleLogin: builder.mutation({
            query: codeFromGoogle => ({
                url: `http://localhost:3000/auth/google?code=${codeFromGoogle}&redirect_uri=http://localhost:5173/auth/google`,
                method: 'GET',
                credentials: 'include',
                withCredentials: true,
            }),
        }),
        getUserInfo: builder.query({
            query: () => ({
                url: '/auth/userinfo',
                method: 'GET',
                credentials: 'include',
                withCredentials: true,
            }),
            providesTags: ['User'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    dispatch(setCredentials(data))
                } catch (err) {
                    console.log(err)
                }
            },
        })
    }),
})

export const {
    useLoginMutation,
    useSendLogoutMutation,
    useGoogleLoginMutation,
    useGetUserInfoQuery,
} = authApiSlice