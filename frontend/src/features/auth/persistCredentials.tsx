import { Outlet } from "react-router-dom";
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from "./authSlice";
import { useAppDispatch } from '../../app/hooks';
import { useGetUserMutation } from "../user/userApiSlice";
import { setCredentials } from "./authSlice";
import { useAppSelector } from "../../app/hooks";
interface User {
    username: string;
    avatar: string;
    contacts: [string];
    _id: string;
    email: string
}
type T = Awaited<Promise<PromiseLike<object>>>
const PersistCredentials = () => {
/* 
    const dispatch = useAppDispatch()

    const [getUser] = useGetUserMutation({ id: String })


    useEffect(() => {
        const getData = async () => {
            await getUser('644071eaff92bd61194f48f8')
                .then((res: any) => {
                    if (!res.data) {
                        throw new Error('err')
                    }
                    const userCredentials: User = res.data
                    dispatch(setCredentials({ id: userCredentials._id, ...userCredentials }))


                })
        }
        getData()
    }, []) */

    let content

    content = <Outlet />

    return content
}
export default PersistCredentials