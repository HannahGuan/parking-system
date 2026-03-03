import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { MainPage } from "./components/MainPage";
import { ParkingConfirmation } from "./components/ParkingConfirmation";
import { SessionStarted } from "./components/SessionStarted";
import { SessionActive } from "./components/SessionActive";
import { EndSession } from "./components/EndSession";
import { SessionReview } from "./components/SessionReview";
import { BlackScreen } from "./components/BlackScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: MainPage,
      },
      {
        path: "parking-confirmation",
        Component: ParkingConfirmation,
      },
      {
        path: "session-started",
        Component: SessionStarted,
      },
      {
        path: "session-active",
        Component: SessionActive,
      },
      {
        path: "end-session",
        Component: EndSession,
      },
      {
        path: "session-review",
        Component: SessionReview,
      },
      {
        path: "black-screen",
        Component: BlackScreen,
      },
    ],
  },
]);