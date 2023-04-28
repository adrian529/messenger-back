import { Outlet } from "react-router-dom";
import ContactList from "../features/contacts/ContactList";
import { useLocation } from "react-router-dom";
const Layout = () => {
    const location = useLocation();
    console.log(location)


    return (

        <div className="layout">
            <ContactList />
            <Outlet />
        </div >

    )
}

export default Layout