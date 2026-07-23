import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import CommandPalette from "./CommandPalette";
import Sidebar from "./Sidebar";

const PAGE_TITLES = {
  "/": "Overview",
  "/dashboard": "Dashboard",
  "/products": "Products",
  "/analytics": "Analytics",
  "/settings": "Settings"
};

export default function Layout({ logout, username }) {
  const [commandOpen, setCommandOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const closeCommand = useCallback(() => setCommandOpen(false), []);

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((open) => !open);
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="appShell">
      <Sidebar
        logout={logout}
        username={username}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="mainArea">
        <header className="topBar">
          <div className="topBarTitle">
            <button
              className="menuBtn"
              type="button"
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <div>
              <div className="pageTitle">{PAGE_TITLES[location.pathname] || "InventoryPro"}</div>
              <div className="pageContext">Inventory workspace</div>
            </div>
          </div>

          <div className="topBarActions">
            <button className="cmdBtn" type="button" onClick={() => setCommandOpen(true)}>
              Search <kbd>⌘ K</kbd>
            </button>
            <div className="profile" title={username}>
              {(username || "U").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="pageContent">
          <Outlet />
        </main>
      </div>

      {commandOpen && <CommandPalette onClose={closeCommand} />}
    </div>
  );
}
