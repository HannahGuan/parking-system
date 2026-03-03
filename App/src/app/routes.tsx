import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Confirmation from "./pages/Confirmation";
import ActiveSession from "./pages/ActiveSession";
import Payment from "./pages/Payment";
import Receipt from "./pages/Receipt";
import Layout from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "confirm", Component: Confirmation },
      { path: "active", Component: ActiveSession },
      { path: "payment", Component: Payment },
      { path: "receipt", Component: Receipt },
    ],
  },
]);