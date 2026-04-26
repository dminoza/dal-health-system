import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";

const DashboardPage  = lazy(() => import("./pages/DashboardPage").then(m => ({ default: m.DashboardPage })));
const HistoryPage    = lazy(() => import("./pages/HistoryPage").then(m => ({ default: m.HistoryPage })));
const PredictionPage = lazy(() => import("./pages/PredictionPage").then(m => ({ default: m.PredictionPage })));
const LoginPage      = lazy(() => import("./pages/LoginPage").then(m => ({ default: m.LoginPage })));

function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
}

function WithSuspense({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <WithSuspense><LoginPage /></WithSuspense>,
  },
  {
    path: "/",
    Component: ProtectedRoute,
    children: [
      {
        Component: Layout,
        children: [
          { index: true,          element: <WithSuspense><DashboardPage /></WithSuspense> },
          { path: "history",      element: <WithSuspense><HistoryPage /></WithSuspense> },
          { path: "prediction",   element: <WithSuspense><PredictionPage /></WithSuspense> },
        ],
      },
    ],
  },
]);