import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GameDetails from "./pages/GameDetailsPage";
import Layout from "./pages/layout";
import ErrorPage from "./pages/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "games/:id", element: <GameDetails /> },
    ],
  },
]);

export default router;
