import {createBrowserRouter, RouterProvider} from "react-router-dom";
import BaseRouter from "./base.route.tsx";

const browserRouter = createBrowserRouter(
    BaseRouter
);

const RenderRouter = () => {
    return (
        <RouterProvider router={browserRouter}/>
    )
}

export default RenderRouter;