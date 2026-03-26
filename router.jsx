import { createBrowserRouter, Navigate } from "react-router";
import Home from "./src/pages/Home";
import Lottery2DResultDetail from "./src/pages/Lottery2DResultDetail";
import LotteryThreeDBetting from "./src/pages/LotteryThreeDBetting";
import LotteryTwoDBetting from "./src/pages/LotteryTwoDBetting";
import LotteryTwoDConfirmation from "./src/pages/LotteryTwoDConfirmation";
import WalletPage from "./src/pages/WalletPage";
import NotificationsPage from "./src/pages/NotificationsPage";
import ProfilePage from "./src/pages/ProfilePage";
import Layout from "./src/Layout";
import NotFoundPage from "./src/pages/NotFoundPage";
import Lottery3DResultDetail from "./src/pages/Lottery3DResultDetail";
import ContactPage from "./src/pages/ContactPage";
import DepositPage from "./src/pages/DepositPage";
import DepositForm from "./src/components/DepositForm";
import WithdrawForm from "./src/components/WithdrawForm";
import Dubai2DResultPage from "./src/pages/Dubai2DResultPage";
import Dubai3DResultPage from "./src/pages/Dubai3DResultPage";
import History2DPage from "./src/pages/History2DPage";
import LoginPage from "./src/pages/auth/LoginPage";
import RegisterPage from "./src/pages/auth/RegisterPage";
import AdminLayout from "./src/admin/AdminLayout";
import Dashboard from "./src/admin/pages/Dashboard";
import UsersList from "./src/admin/pages/UsersList";
import AgentsList from "./src/admin/pages/AgentsList";
import AdminDepositPage from "./src/admin/pages/AdminDepositPage";
import AdminWithdrawPage from "./src/admin/pages/AdminWithdrawPage";
import AdminMM2DPage from "./src/admin/pages/AdminMM2DPage";

const router = createBrowserRouter([
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/lottery-2d-result-detail",
        element: <Lottery2DResultDetail />,
      },
      {
        path: "/lottery-2d-history",
        element: <History2DPage />,
      },
      {
        path: "/lottery-3d-result-detail",
        element: <Lottery3DResultDetail />,
      },
      {
        path: "/lottery-three-d-betting",
        element: <LotteryThreeDBetting />,
      },
      {
        path: "/lottery-two-d-betting",
        element: <LotteryTwoDBetting />,
      },
      {
        path: "/lottery-two-d-confirmation",
        element: <LotteryTwoDConfirmation />,
      },
      {
        path: "/dubai-2d-result",
        element: <Dubai2DResultPage />,
      },
      {
        path: "/dubai-3d-result",
        element: <Dubai3DResultPage />,
      },
      {
        path: "/wallet",
        element: <WalletPage />,
      },
      {
        path: "/wallet-deposit",
        element: <DepositPage />,
      },
      {
        path: "/wallet-deposit-form",
        element: <DepositForm />,
      },
      {
        path: "/wallet-withdraw-form",
        element: <WithdrawForm />,
      },
      {
        path: "/notifications",
        element: <NotificationsPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: "/admin",
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <Dashboard /> },
          { path: "users", element: <UsersList /> },
          { path: "agents", element: <AgentsList /> },
          { path: "deposit", element: <AdminDepositPage /> },
          { path: "withdraw", element: <AdminWithdrawPage /> },
          { path: "mm2d", element: <AdminMM2DPage /> },
        ],
      },
    ],
  },
]);
export default router;
