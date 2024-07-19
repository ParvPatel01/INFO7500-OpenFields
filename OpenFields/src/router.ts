import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Market from "./components/Market";
import Mint from "./components/Mint";


const routes = createBrowserRouter([
    {
        path: '/',
        Component: App,
        children: [
            {
                path: '/market',
                Component: Market,
            },
            {
                path: "/mint",
                Component: Mint
            }

        ]
    }
]);

export default routes;