export default function Settings() {
  return (
    <div>
      <div className="card">
        <h2>Profile Settings</h2>

        <div className="formGrid">
          <input className="input" placeholder="First Name" />
          <input className="input" placeholder="Last Name" />
          <input className="input" placeholder="Email" />
          <input className="input" placeholder="Phone" />
        </div>
      </div>

      <div className="card">
        <h2>Preferences</h2>
        <p>Dark mode enabled</p>
        <p>Notifications ON</p>
      </div>

      <button className="primaryBtn">Save Changes</button>
    </div>
  );
}