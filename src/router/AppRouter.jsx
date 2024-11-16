import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import App from "../App";
import SignIn from "../_auth/Signin";
import Signup from "../_auth/Signup";
import Home from "../_root/Home";
import AddCar from "../_root/AddCar";
import CarDetails from "../_root/CarDetails";

// Protected Route wrapper for authenticated routes
const ProtectedRoute = () => {
  const token = Cookies.get("token");

  // Redirect to sign-in if no token is present
  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
};

// Auth Route wrapper for non-authenticated routes (sign-in, sign-up)
const AuthRoute = () => {
  const token = Cookies.get("token");

  // Redirect to home if token is present
  if (token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const AppRouter = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <App />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "/add-car",
            element: <AddCar />,
          },
          {
            path: "/:id",
            element: <CarDetails />,
          },
        ],
      },
    ],
  },
  {
    element: <AuthRoute />,
    children: [
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
]);

export default AppRouter;
