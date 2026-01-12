import type {RouteObject} from "react-router-dom";
import PortalLayout from "../layout/portal.layout.tsx";

const BasePortalRoutes: RouteObject[] = [
    {
        path: '/',
        lazy: async () => {
            const LandingPage = await import('../pages/landing.page.tsx')

            return {
                Component: LandingPage.default
            }
        },
        handle: {
            title: 'Landing Page',
            trackCode: 'landing-page'
        }
    }
]

const routes: RouteObject[] = [
    {
        path: '/',
        element: <PortalLayout/>,
        children: BasePortalRoutes
    }
]

export default routes;