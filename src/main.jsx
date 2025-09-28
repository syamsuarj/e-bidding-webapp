import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import SignUp from "./components/SignUp.jsx";
import Dashboard from "./components/Dashboard.jsx";
import AdminLogin from "./components/admin/AdminLogin.jsx";
import AdminRoleMatrix from "./components/admin/AdminRoleMatrix.jsx";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import AdminAuctions from "./components/admin/AdminAuctions.jsx";
import AdminParticipants from "./components/admin/AdminParticipants.jsx";
import AdminPKS from "./components/admin/AdminPKS.jsx";
import AdminUsers from "./components/admin/AdminUsers.jsx";
import AdminPolicies from "./components/admin/AdminPolicies.jsx";
import AdminAuctionDetail from "./components/admin/AdminAuctionDetail.jsx";
import AdminParticipantDetail from "./components/admin/AdminParticipantDetail.jsx";
import AdminPKSDetail from "./components/admin/AdminPKSDetail.jsx";
import "./index.css";

const resolveRoute = () => {
  const normalizedHash = window.location.hash.replace(/^#/, "");
  const normalizedPath = window.location.pathname.replace(/\/+$/, "");

  // Support clean path-based navigation first
  if (normalizedPath.endsWith("/signup")) return "signup";
  if (normalizedPath.endsWith("/dashboard")) return "dashboard";
  if (normalizedPath.endsWith("/admin")) return "admin";
  if (normalizedPath.endsWith("/admin/login")) return "admin-login";
  if (normalizedPath.endsWith("/admin/roles")) return "admin-roles";
  if (normalizedPath.endsWith("/admin/auctions")) return "admin-auctions";
  if (/^\/admin\/auctions\/.+/.test(normalizedPath))
    return "admin-auction-detail";
  if (normalizedPath.endsWith("/admin/participants"))
    return "admin-participants";
  if (normalizedPath.endsWith("/admin/pks")) return "admin-pks";
  if (normalizedPath.endsWith("/admin/users")) return "admin-users";
  if (normalizedPath.endsWith("/admin/policies")) return "admin-policies";
  if (/^\/admin\/participants\/.+/.test(normalizedPath))
    return "admin-participant-detail";
  if (/^\/admin\/pks\/.+/.test(normalizedPath)) return "admin-pks-detail";

  // Fallback: hash-based navigation
  if (normalizedHash === "/signup") return "signup";
  if (normalizedHash === "/dashboard") return "dashboard";
  if (normalizedHash === "/admin/login") return "admin-login";
  if (normalizedHash === "/admin/roles") return "admin-roles";
  if (normalizedHash === "/admin") return "admin";
  if (normalizedHash === "/admin/auctions") return "admin-auctions";
  if (/^#\/admin\/auctions\/.+/.test(window.location.hash))
    return "admin-auction-detail";
  if (normalizedHash === "/admin/participants") return "admin-participants";
  if (normalizedHash === "/admin/pks") return "admin-pks";
  if (normalizedHash === "/admin/users") return "admin-users";
  if (normalizedHash === "/admin/policies") return "admin-policies";
  if (/^#\/admin\/participants\/.+/.test(window.location.hash))
    return "admin-participant-detail";
  if (/^#\/admin\/pks\/.+/.test(window.location.hash))
    return "admin-pks-detail";

  return "home";
};

const AppRouter = () => {
  const [route, setRoute] = useState(resolveRoute);

  useEffect(() => {
    const handleHashChange = () => setRoute(resolveRoute());
    const handlePopState = () => setRoute(resolveRoute());

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  if (route === "signup") {
    return <SignUp />;
  }

  if (route === "dashboard") {
    return <Dashboard />;
  }

  if (route === "admin-login") {
    return <AdminLogin />;
  }

  if (route === "admin-roles") {
    return <AdminRoleMatrix />;
  }

  if (route === "admin") return <AdminDashboard />;
  if (route === "admin-auctions") return <AdminAuctions />;
  if (route === "admin-auction-detail") return <AdminAuctionDetail />;
  if (route === "admin-participants") return <AdminParticipants />;
  if (route === "admin-pks") return <AdminPKS />;
  if (route === "admin-users") return <AdminUsers />;
  if (route === "admin-policies") return <AdminPolicies />;
  if (route === "admin-participant-detail") return <AdminParticipantDetail />;
  if (route === "admin-pks-detail") return <AdminPKSDetail />;

  return <App />;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
