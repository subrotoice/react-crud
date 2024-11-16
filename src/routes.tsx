import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GameDetails from "./pages/GameDetails";
import Layout from "./pages/layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "games/:id", element: <GameDetails /> },
    ],
  },
]);

export default router;
