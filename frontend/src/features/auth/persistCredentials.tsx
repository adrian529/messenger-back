import { Outlet } from "react-router-dom";
import { useEffect } from 'react'
import { useGetUserInfoQuery } from "./authApiSlice";
interface User {
    username: string;
    avatar: string;
    contacts: [string];
    _id: string;
    email: string
}
type T = Awaited<Promise<PromiseLike<object>>>
const PersistCredentials = () => {

    useGetUserInfoQuery()
    let content

    content = <Outlet />

    return content
}
export default PersistCredentials