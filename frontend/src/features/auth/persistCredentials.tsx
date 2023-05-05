import { Outlet } from "react-router-dom";
import { useEffect } from 'react'
import { useGetUserInfoMutation } from "./authApiSlice";
interface User {
    username: string;
    avatar: string;
    contacts: [string];
    _id: string;
    email: string
}
type T = Awaited<Promise<PromiseLike<object>>>
const PersistCredentials = () => {

    const [getUserInfo] = useGetUserInfoMutation()


    useEffect(() => {
        (async () => {
            const userData = await getUserInfo()
        })()
    }, [])


    let content

    content = <Outlet />

    return content
}
export default PersistCredentials