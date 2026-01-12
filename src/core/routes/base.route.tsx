import type {RouteObject} from "react-router-dom";
import BaseLayout from "../layout/base.layout.tsx";
import BasePortalRoutes from "../../modules/portal/routes/base.route.tsx"

const BaseRouter: RouteObject[] = [
    {
        path: '/',
        element: <BaseLayout/>,
        children: [
            ...BasePortalRoutes
        ]
    }
]

export default BaseRouter;