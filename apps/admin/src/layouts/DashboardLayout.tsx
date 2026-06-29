import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { isLoggedIn } from '../lib/session';

export default function DashboardLayout() {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-full bg-bg-dark overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col relative">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="w-full max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
