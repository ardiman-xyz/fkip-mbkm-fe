import { createBrowserRouter, Navigate } from "react-router";
import { useAuth } from "@/context/AuthProvider";
import Login from "@/pages/auth/Login";
import ProtectedRoute from "@/components/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import DashboarLayout from "@/components/DashboardLayout";
import ProgramList from "@/pages/programs/ProgramList";
import AddNewProgram from "@/pages/programs/AddNewProgram";
import PlacesList from "@/pages/places/PlacesList";
import RegisterSetting from "@/pages/setting/register/RegisterSetting";
import NotFound from "@/pages/NotFound";
import RegisterList from "@/pages/register/RegisterList";
import RegisterCreate from "@/pages/register/RegisterCreate";
import RegisterEdit from "@/pages/register/RegisterEdit";
import GuidanceList from "@/pages/guidance/GuidanceList";

function AuthRedirect() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthRedirect />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboarLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "programs",
        element: <ProgramList />,
      },
      {
        path: "programs/add",
        element: <AddNewProgram />,
      },
      {
        path: "places",
        element: <PlacesList />,
      },
      {
        path: "settings/register",
        element: <RegisterSetting />,
      },
      {
        path: "register/list",
        element: <RegisterList />,
      },
      {
        path: "register/create",
        element: <RegisterCreate />,
      },
      {
        path: "register/:id/edit",
        element: <RegisterEdit />,
      },

      {
        path: "guidance",
        element: <GuidanceList />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
