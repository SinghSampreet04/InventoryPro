import { NavLink } from "react-router-dom";

export default function Sidebar({ logout }) {
  return (
    <div className="sidebar">

      <div className="sidebarTop">

        <div className="brand">
          <div className="logoDot"></div>
          <div className="logoText">InventoryPro</div>
        </div>

        <nav className="navGroup">

          <NavLink to="/" className="navItem">
            <span>🏠</span> Home
          </NavLink>

          <NavLink to="/dashboard" className="navItem">
            <span>📊</span> Dashboard
          </NavLink>

          <NavLink to="/products" className="navItem">
            <span>📦</span> Products
          </NavLink>

          <NavLink to="/analytics" className="navItem">
            <span>📈</span> Analytics
          </NavLink>

          <NavLink to="/settings" className="navItem">
            <span>⚙️</span> Settings
          </NavLink>

        </nav>
      </div>

      <div className="sidebarBottom">
        <div className="userBox">
          <div className="avatar">S</div>
          <div>
            <div className="userName">Admin</div>
            <div className="userRole">Pro Plan</div>
          </div>
        </div>

        <button className="logoutBtn" onClick={logout}>
          Sign out
        </button>
      </div>

    </div>
  );
}