import { Outlet } from "react-router-dom";
import SchoolSidebar from "./SchoolSidebar";

export default function SchoolLayout() {
  return (
    <div className="min-h-screen bg-background">
      <SchoolSidebar />
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}
