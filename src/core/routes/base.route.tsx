import type {RouteObject} from "react-router-dom";
import BaseLayout from "../layout/base.layout.tsx";

const BaseRouter: RouteObject[] = [
    {
        path: '/',
        element: <BaseLayout/>
    }
]

export default BaseRouter;