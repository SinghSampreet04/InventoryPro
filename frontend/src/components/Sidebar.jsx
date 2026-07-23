import { NavLink } from "react-router-dom";

const NAVIGATION = [
  { label: "Overview", icon: "⌂", path: "/" },
  { label: "Dashboard", icon: "◫", path: "/dashboard" },
  { label: "Products", icon: "◇", path: "/products" },
  { label: "Analytics", icon: "↗", path: "/analytics" },
  { label: "Settings", icon: "⚙", path: "/settings" }
];

export default function Sidebar({ logout, onClose, open, username }) {
  return (
    <>
      {open && <button className="sidebarBackdrop" aria-label="Close navigation" onClick={onClose} />}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebarTop">
          <div className="brand">
            <div className="logoMark">IP</div>
            <div>
              <div className="logoText">InventoryPro</div>
              <div className="logoCaption">Operations console</div>
            </div>
          </div>

          <nav className="navGroup" aria-label="Primary navigation">
            <p className="navLabel">Workspace</p>
            {NAVIGATION.map((item) => (
              <NavLink
                end={item.path === "/"}
                key={item.path}
                to={item.path}
                className={({ isActive }) => `navItem ${isActive ? "active" : ""}`}
              >
                <span className="navIcon" aria-hidden="true">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebarBottom">
          <div className="userBox">
            <div className="avatar">{(username || "U").charAt(0).toUpperCase()}</div>
            <div className="userDetails">
              <div className="userName">{username || "Inventory user"}</div>
              <div className="userRole">Authenticated session</div>
            </div>
          </div>

          <button className="logoutBtn" type="button" onClick={logout}>
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
