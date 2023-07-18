import { useEffect } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import { useGetUserInfoQuery } from "./authApiSlice";

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