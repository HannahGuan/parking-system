import { Outlet } from "react-router";
import { useWebSocket } from "../hooks/useWebSocket";

export function Layout() {
  // Initialize WebSocket connection
  useWebSocket();

  return <Outlet />;
}
