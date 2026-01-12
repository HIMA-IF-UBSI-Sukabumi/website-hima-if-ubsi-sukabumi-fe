import {Outlet} from "react-router-dom";

const PortalLayout = () => {
    return (
        <>
            <main>
                <Outlet/>
            </main>
        </>
    )
}

export default PortalLayout;