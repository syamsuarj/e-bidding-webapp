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
  const normalizedPath = window.location.pathname.replace(/\/+$/, "");

  // Clean path-based navigation
  if (normalizedPath === "" || normalizedPath === "/") return "home";
  if (normalizedPath.endsWith("/signup")) return "signup";
  if (normalizedPath.endsWith("/user/dashboard")) return "dashboard";
  if (normalizedPath.endsWith("/admin/dashboard")) return "admin-dashboard";
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

  return "home";
};

const AppRouter = () => {
  const [route, setRoute] = useState(resolveRoute);

  useEffect(() => {
    const handlePopState = () => setRoute(resolveRoute());
    const handleClick = (e) => {
      // Only intercept left-clicks without modifier keys
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;

      // Traverse up to find anchor
      let el = e.target;
      while (el && el !== document.body) {
        if (el.tagName === "A" && el.getAttribute("href")) break;
        el = el.parentElement;
      }
      if (!el || el.tagName !== "A") return;

      const href = el.getAttribute("href");
      const target = el.getAttribute("target");
      const download = el.getAttribute("download");
      // External or hash links should be ignored
      if (
        !href ||
        href.startsWith("http") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        target === "_blank" ||
        download != null
      )
        return;

      // Only intercept app routes; let other absolute links (e.g. /docs/*.pdf) pass through
      const isAppRoute =
        href === "/" ||
        href === "/signup" ||
        href === "/user/dashboard" ||
        href.startsWith("/admin/");

      if (isAppRoute) {
        e.preventDefault();
        window.history.pushState(null, "", href);
        handlePopState();
      }
    };

    window.addEventListener("popstate", handlePopState);
    document.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleClick);
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

  if (route === "admin-dashboard") return <AdminDashboard />;
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
