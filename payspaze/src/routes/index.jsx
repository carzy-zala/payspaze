import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layout/Layout.jsx";
import Home from "../Pages/Home.jsx";
import SignIn from "../Pages/SignIn.jsx";
import Signup from "../Pages/Signup.jsx";
import NoFound from "../Pages/NoFound.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        path: "/sign-up",
        element: <Signup />,
      },
    ],
  },
  {
    path: "*",
    element: <NoFound />,
  },
]);
