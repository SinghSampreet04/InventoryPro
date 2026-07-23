import { useEffect, useState } from "react";

export default function Settings({
  displayName,
  onSaveDisplayName,
  username
}) {
  const [name, setName] = useState(displayName);
  const [reducedMotion, setReducedMotion] = useState(
    () => localStorage.getItem("inventoryReducedMotion") === "true"
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(reducedMotion);
  }, [reducedMotion]);

  const save = (event) => {
    event.preventDefault();
    onSaveDisplayName(name);
    localStorage.setItem("inventoryReducedMotion", String(reducedMotion));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="pageStack settingsPage">
      <section className="pageHeader">
        <div>
          <p className="eyebrow">Workspace preferences</p>
          <h1>Settings</h1>
          <p>Manage how your account appears and how the interface behaves.</p>
        </div>
      </section>

      <form onSubmit={save}>
        <section className="card settingsSection">
          <div>
            <h2>Profile</h2>
            <p>Choose the name shown in your InventoryPro workspace.</p>
          </div>
          <div className="settingsFields">
            <label>
              <span className="fieldLabel">Display name</span>
              <input
                className="input"
                placeholder={username}
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>
            <label>
              <span className="fieldLabel">Account username</span>
              <input className="input" value={username || ""} disabled />
            </label>
          </div>
        </section>

        <section className="card settingsSection">
          <div>
            <h2>Accessibility</h2>
            <p>Adjust interface effects to match your preference.</p>
          </div>
          <label className="toggleRow">
            <div>
              <strong>Reduce motion</strong>
              <span>Disable non-essential movement and transitions.</span>
            </div>
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(event) => setReducedMotion(event.target.checked)}
            />
          </label>
        </section>

        <div className="settingsActions">
          {saved && <span className="saveStatus" role="status">Preferences saved</span>}
          <button className="primaryBtn">Save preferences</button>
        </div>
      </form>
    </div>
  );
}
