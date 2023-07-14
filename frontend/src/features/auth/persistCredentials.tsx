import { Outlet } from "react-router-dom";
import { useEffect } from 'react'
import { useGetUserInfoQuery } from "./authApiSlice";
import { useNavigate } from "react-router-dom";

const PersistCredentials = () => {

    const { isError } = useGetUserInfoQuery()
    const navigate = useNavigate()

    useEffect(() => {
        if (isError) {
            navigate('/auth')

        }
    }, [isError])

    return <Outlet />
}
export default PersistCredentials