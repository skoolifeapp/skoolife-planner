import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';

const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

export const AppLayout = () => {
  return (
    <AppSidebar>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </AppSidebar>
  );
};

export default AppLayout;
